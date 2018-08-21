//process.execArgv[0] = process.execArgv[0].replace('-brk', '');
"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const https = require('https');
const path = require('path');
const cluster = require('cluster');

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

    /* process.on('unhandledRejection', err => {
        console.log('unhandledRejection => ', err);
    }); */


    //let patterns = ['/:type\::id\.:action', '/:type\.:action', '/:type\::id', '/:type'];

    app.all('*', function(req, res, next) {
        next();
    });

    app.use('/api', function(req, res, next) {
        next();
    });

    app.use('/api', require('./router')(require('socket.io')(httpsServer)));
}

/* Object.prototype.$path = function(path) {
    let object = this;

    let splitted = path.split('.');
    let res = splitted.reduce((obj, key) => {
        return obj[key];

    }, object);

    return res;
} */

let price = {
    cost: 100,
    percent: void 0
};

//let { cost: sum, percent: sum } = price;
//console.log(sum);

/* let jObj = {
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
} */

//let ooo = jObj.path('names.0.name.sns.1')
//console.log(ooo);