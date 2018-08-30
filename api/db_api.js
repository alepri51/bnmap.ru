'use strict';

const fs = require('fs-extra');
const path = require('path');
const compress_images = require('compress-images');

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

        let blobSave = (payload) => new Promise(async (resolve, reject) => {
            if(req.blob) {
                if(req.blob.err) {
                    let err = req.blob.err;
                    this.generateError({ code: err.code, message: err.message, data: this.constructor.name });  
                    resolve(err);
                }
                else {
                    let destination = path.join(process.cwd(), 'uploads');
                    fs.ensureDirSync(destination);

                    destination = path.join(destination, payload._id + '', 'files');
                    fs.ensureDirSync(destination);
                    
                    let files = req.blob.files.map(file => {
                        let fullname = path.join(destination, file.originalname);

                        return new Promise((resolve) => fs.writeFile(fullname, file.buffer, (err) => resolve(err)));
                    });

                    let err = await Promise.all(files);
                    err = err.some(err => err);

                    if(!err) {
                        req.blob.files.forEach(file => {
                            let ext = path.extname(file.originalname).toLowerCase();
                            let jpg = ['.jpg', '.jpeg'].includes(ext);

                            let name = path.basename(file.originalname, ext);
                            let source = path.join(destination, name + '*.{jpg,JPG,jpeg,JPEG,png,svg,gif}');
                            
                            source = source.replace(/\\/gi, '/');
                            destination = destination.replace(/\\/gi, '/') + '/compressed-' + name;

                            compress_images(source, destination, {compress_force: true, statistic: true, autoupdate: false}, false,
                                {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
                                {png: {engine: 'pngquant', command: ['--quality=20-50']}},
                                {svg: {engine: 'svgo', command: '--multipass'}},
                                {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, 
                                function(err){
                                    //payload.compressed = 'compressed-'  + (jpg ? name + '.webp' : payload.picture);
                                    payload.compressed = 'compressed-'  + payload.picture;
                                    console.log(err);
                                    resolve(err);
                                }
                            );
                        });
                    } 
                    else resolve(err);
                }
            } 
            else resolve();
        });

        if(this.accessGranted(payload)) {

            let data = void 0;

            switch(req.method) {
                case 'DELETE':
                    data = await this.delete(payload, req);
                    let destination = path.join(process.cwd(), 'uploads', payload._id + '');
                    fs.removeSync(destination);
                    break;
                default:
                    payload.picture ? (payload.compressed = 'compressed-'  + payload.picture) : payload.compressed = '';
                    data = payload._id ? await this.update(payload, req) : await this.insert(payload, req);
                    
                    //payload = data;
                    let err = await blobSave(data);
                    //!err && (data = await db[this.constructor.name]._update({ ...payload }));
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