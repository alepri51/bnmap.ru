'use strict'

const express = require('express');

let router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: false}));

let types = require('./api');
let model = require('./model');

let patterns = ['/:type\::id\.:action', '/:type\.:action', '/:type\::id', '/:type'];

let proccedRequest = async function(req) {
    let { type, id, action } = req.params;

    console.log('---------------BEGIN-----------------');
    console.log('REQUEST:', req.path);
    console.log('---------------BEGIN-----------------');

    type = type.toLowerCase();
    !types[type] && (type = 'unknown');

    let object = new types[type](req.headers.authorization, id, io);

    !object[action] && (action = 'default');

    let executor = action ? object[action].bind(object) : object.default.bind(object);

    let params = Object.keys(req.body).length === 0 ? req.query : req.body;
    let result = await executor(params, req);

    let { token, auth, error } = object;

    //result = model(result);
    console.log('----------------END------------------');
    console.log('RESPONSE:', req.path);
    console.log('RESULT:', result);
    console.log('----------------END------------------');

    return { token, auth, error, ...result } || {};
};

let io = void 0;
let current_request = void 0;

router.all(patterns, async (req, res, next) => {
    if(req.method === 'OPTIONS') {
        console.log("req.method === 'OPTIONS'");
    }

    try {
        let response = await proccedRequest(req, io);
        res.json(response).end();
    }
    catch(err) {
        let error = {
            code: err.code,
            message: err.message,
            data: {}
        }
        console.log('ERROR => ', err);

        res.json({error}).end();
    }

    
}); 

let socketInitialize = function(sockets) {
    io = sockets;

    sockets.on('connection', (socket) => {
        //io = socket;
        /* socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });

        socket.emit('login', {
            numUsers: numUsers
        }); */

        socket.on('request', async (data, cb) => {
            let { type, id, action, authorization, body, method = 'GET' } = data;
            let req = {
                params: { type, id, action },
                headers: { authorization },
                body,
                method
            };

            let response = await proccedRequest(req);

            cb(response);
        });
      
    });
}

process.on('unhandledRejection', err => {
    console.log('unhandledRejection => ', err);
});

module.exports = function(io) {
    socketInitialize(io);

    return router;
}