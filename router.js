'use strict'

const express = require('express');

let router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: false}));

let types = require('./api');

/////////////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs-extra');
const path = require('path');

MyCustomStorage.prototype.getDestination = function(req, file, cb) {
    let destination = path.join(__dirname, this.destination, 'users');
    fs.ensureDirSync(destination);

    destination = path.join(destination, req.object.auth.member + '', 'files');
    fs.ensureDirSync(destination);

    destination = path.join(destination, file.originalname);

    cb(null, destination)
}

function MyCustomStorage (opts) {
    this.destination = opts.destination || 'uploads';
    //this.getDestination = (opts.destination || getDestination)
}

MyCustomStorage.prototype._handleFile = function _handleFile (req, file, cb) {
    this.getDestination(req, file, function (err, path) {
        if (err) return cb(err);

        let outStream = fs.createWriteStream(path);

        file.stream.pipe(outStream);
        outStream.on('error', cb);
        outStream.on('finish', function (err) {
            cb(err, {
                path: path,
                size: outStream.bytesWritten
            });
        })
    })
};

MyCustomStorage.prototype._removeFile = function _removeFile (req, file, cb) {
    fs.unlink(file.path, cb)
};

const multer  = require('multer');
const blobUpload = multer({
    storage: new MyCustomStorage({ destination: 'uploads' }),
    limits: {
        fileSize: 1024 * 200
    }
});

let multipartDetector = function(req, res, next) {
    if(req.object.auth && req.headers['content-type'] && req.headers['content-type'].indexOf('multipart/form-data') !== -1) {
        let blob = blobUpload.single('blob');
        blob(req, res, async function (err) {
            //if(err) throw err;

            err ? res.status(500).json(err).end() : next();
        })
    }
    else next();
};

/////////////////////////////////////////////////////////////////////////////////////////////

let patterns = ['/:type\::id\.:action', '/:type\.:action', '/:type\::id', '/:type'];


let processToken = function(req, res, next) {
    let { type, id, action } = req.params;

    console.log('---------------BEGIN-----------------');
    console.log('REQUEST:', req.path);
    console.log('---------------BEGIN-----------------');

    type = type.toLowerCase();
    !types[type] && (type = 'unknown');

    let object = new types[type](req.headers.authorization, id, io);
    req.object = object;

    next();
};

let proccedRequest = async function(req, res) {
    
    let { action } = req.params;
    
    /* let { type, id, action } = req.params;

    console.log('---------------BEGIN-----------------');
    console.log('REQUEST:', req.path);
    console.log('---------------BEGIN-----------------');

    type = type.toLowerCase();
    !types[type] && (type = 'unknown');

    let object = new types[type](req.headers.authorization, id, io); */

    let object = req.object;

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

router.all(patterns, processToken, multipartDetector, async (req, res, next) => {
    if(req.method === 'OPTIONS') {
        console.log("req.method === 'OPTIONS'");
    }

    try {
        let response = await proccedRequest(req, res);
        res.json(response).end();
    }
    catch(err) {
        let error = {
            code: err.code,
            message: err.message,
            data: {},
            system: true
        }
        console.log('ERROR => ', err);

        res.json({error}).end();
    }

    
}); 

let socketInitialize = function(sockets) {
    io = sockets;

    sockets.on('connection', (socket) => {
     
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