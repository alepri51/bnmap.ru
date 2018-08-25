'use strict';

const fs = require('fs-extra');
const path = require('path');

const model = require('../model');
const db = require('../db');

const { SecuredAPI } = require('./base_api');

class DBAccess extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    defaults() {
        return {
            name: 'some name',
            value: 100,
            //percent: 0
        }
    }

    accessGranted(payload) {
        return true;
    }

    async beforeInsert(payload, req) {
        return payload;
    }

    async insert(payload, req) {
        payload = await this.beforeInsert(payload, req);
        return await db[this.constructor.name]._update({ ...payload });
    }

    async beforeUpdate(payload, req) {
        return payload;
    }

    async update(payload, req) {
        payload = await this.beforeUpdate(payload, req)
        return await db[this.constructor.name]._update({ ...payload });
    }

    async beforeDelete(payload, req) {
        return payload;
    }

    async delete(payload, req) {
        payload = await this.beforeDelete(payload, req);
        let deleted = payload;
        await db[this.constructor.name]._query('MATCH (node {_id: {id}}) DETACH DELETE node', { id: payload._id });
        return deleted;
    }

    async transformData(data, req) {
        return data;
    }

    afterSave(data, req) {

    }

    async save(payload, req, res) {

        let blobSave = () => new Promise(async (resolve, reject) => {
            if(req.blob) {
                if(req.blob.err) {
                    let err = req.blob.err;
                    this.generateError({ code: err.code, message: err.message, data: this.constructor.name });  
                    resolve(err);
                }
                else {
                    let destination = path.join(process.cwd(), 'uploads', 'users');
                    fs.ensureDirSync(destination);

                    destination = path.join(destination, this.member + '', 'files');
                    fs.ensureDirSync(destination);
                    
                    let files = req.blob.files.map(file => {
                        let fullname = path.join(destination, file.originalname);

                        return new Promise((resolve) => fs.writeFile(fullname, file.buffer, (err) => resolve(err)));
                    });

                    let err = await Promise.all(files);
                    err = err.some(err => err);
                    resolve(err);
                }
            } 
            else resolve();
        });

        if(this.accessGranted(payload)) {

            let data = void 0;

            switch(req.method) {
                case 'DELETE':
                    data = await this.delete(payload, req);
                    break;
                default:
                    let err = await blobSave();
                    !err && (data = payload._id ? await this.update(payload, req) : await this.insert(payload, req));
                    break;
            }

            let transformed = await this.transformData(data, req);
            let normalized = model(transformed || {});

            this.afterSave(data, normalized, req);

            return normalized;
        }
        else this.generateError({ code:400, message: 'Вам отказано в доступе.', data: this.constructor.name });
    }
}

module.exports = { DBAccess }