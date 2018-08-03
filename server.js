//process.execArgv[0] = process.execArgv[0].replace('-brk', '');
"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const https = require('https');
const path = require('path');
const cluster = require('cluster');
const io = require('socket.io-client');

const express = require('express');
const staticFileMiddleware = express.static('client/dist', {});
const history = require('connect-history-api-fallback');
const cors = require('cors');

const fs = require('fs');

const key  = fs.readFileSync('ssl/key.pem', 'utf8');
const cert = fs.readFileSync('ssl/cert.pem', 'utf8');
const credentials = {key, cert};

const httpsListenPort = 8000;

const app = express();

app.use('/api', cors());

app.use(staticFileMiddleware);

app.use('/\/$/', history({
    disableDotRule: false,
    verbose: true
}));

app.use(staticFileMiddleware);

let httpsServer = https.createServer(credentials, app);

if(cluster.isMaster) {
    httpsServer.listen(httpsListenPort);

    console.log(`https server listen on ${httpsListenPort} port.`);

    process.on('unhandledRejection', err => {
        console.log('unhandledRejection => ', err);
    });


    //let patterns = ['/:type\::id\.:action', '/:type\.:action', '/:type\::id', '/:type'];

    app.all('*', function(req, res, next) {
        next();
    });

    app.use('/api', function(req, res, next) {
        next();
    });

    app.use('/api', require('./router'));

    /* const WebSocket = require("ws");
    var socket = new WebSocket('wss://ws.blockchain.info/inv');

    socket.onopen = function(){
        //socket.send(JSON.stringify({ "op":"unconfirmed_sub" }));
        //socket.send(JSON.stringify({ "op":"addr_sub", "addr":"19XKrAAWRf6GDuAkQwcQRch3UxqNA838tG" }));
    };

    socket.onmessage = function(onmsg)
    {
        var response = JSON.parse(onmsg.data);
        var getOuts = response.x.out;
        var countOuts = getOuts.length; 
        for(let i = 0; i < countOuts; i++)
            {
                //check every output to see if it matches specified address
                var outAdd = response.x.out[i].addr;
                var amount = response.x.out[i].value / 100000000;
                //transaction received
                //include a parameter with the amount in satoshis if you want
                console.log('TX FROM:', outAdd, 'BTC:', amount);
            };
    } */
}

Object.prototype.path = function(path) {
    let object = this;

    let splitted = path.split('.');
    let res = splitted.reduce((obj, key) => {
        return obj[key];

    }, object);

    return res;
}

let jObj = {
    names: [
        {
            name: {
                fn: 'uuu',
                sns: [
                    'one',
                    'two'
                ]
            }
        }
    ]
}

//let ooo = jObj.path('names.0.name.sns.1')
//console.log(ooo);