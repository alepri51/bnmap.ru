'use strict'
//https://github.com/louischatriot/nedb

//Как запросы сделать:
//const db = require('./db');
//await db.remove('$имя_коллекции$', { _id: payload._id })
//await db.update('$имя_коллекции$', { _id: payload._id }, { ...payload }) 
//await db.insert('$имя_коллекции$', { ...payload });
//await db.findOne('$имя_коллекции$', { _id: payload.member });
//await db.find('$имя_коллекции$', { _id: payload.member });

//массив коллекций, создается при старте
let collections = ['member', 'token', 'order', 'product', 'list', 'news', 'wallet', 'price'];

const cluster = require('cluster');
const path = require('path');

const Datastore = require('nedb');

if(cluster.isMaster) { 

    let db = module.exports;

    for (let inx in collections) {
        let collection = collections[inx];
        db[collection] = new Datastore({filename: path.join(__dirname, `nedb/_${collection}.db`), autoload: true});
    }

    db.find = function (collection, query, options) {
        let { sort } = options || {}
        //sort = sort || {};
        return new Promise(function (resolve, reject) {
            db[collection].find(query).sort(sort).exec(function (err, results) {
                err ? reject(err) : resolve(results);
            })
        });
    };

    db.findOne = function (collection, query, options) {
        return new Promise(async function (resolve, reject) {
            try {
                let results = await db.find(collection, query, options);
                resolve(results[0]);
            }
            catch (err) {
                reject(err);
            }
        });
    };

    db.remove = function (collection, query, options) {
        return new Promise(async function (resolve, reject) {
            let to_remove = await db.findOne(collection, query);
            db[collection].remove(query, {multi: true}, function (err, results) {
                err ? reject(err) : resolve(to_remove);
            });

        });
    };

    db.update = function (collection, query, data) {
        return new Promise(async function (resolve, reject) {
            let object = await db.findOne(collection, query);

            if(data.$set) {
                //data.$set.created = data.created || new Date() / 1;
                data.$set.updated = new Date() / 1;
            }
            else {
                data.created = (object && object.created) || new Date() / 1;
                data.updated = new Date() / 1;
            }

            object && (data = {...object, ...data});

            db[collection].update(query, data, { upsert: !!!data.$set }, async function (err, results, upsert) {
                results = upsert ? await db.findOne(collection, { _id: upsert._id }) : await db.findOne(collection, query);
                results && resolve(results);
            });

        });
    };

    db.insert = function (collection, data) {
        return new Promise(async function (resolve, reject) {
            data.created = data.created || new Date() / 1;
            data.updated = new Date() / 1;

            db[collection].insert(data, function (err, inserted) {
                err ? reject(err) : resolve(inserted);
            });
        });
    };

    /* db.throttleLead = function (fn, threshhold = 250, scope) {
        let last;
        return function(...args) {
            const context = scope || this;
            const now = +(new Date());

            if (last && now > last + threshhold) {
                last = now;
                fn.apply(context, args);
            } else if (!last) {
                last = now;
                fn.apply(context, args);
            }
        };
    }; */
}