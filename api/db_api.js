'use strict';

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

    async beforeInsert(payload) {
        return payload;
    }

    async insert(payload) {
        payload = await this.beforeInsert(payload);
        return await db[this.constructor.name]._update({ ...payload });
    }

    async beforeUpdate(payload) {
        return payload;
    }

    async update(payload) {
        payload = await this.beforeUpdate(payload)
        return await db[this.constructor.name]._update({ ...payload });
    }

    async beforeDelete(payload) {
        return payload;
    }

    async delete(payload) {
        payload = await this.beforeDelete(payload);
        let deleted = payload;
        await db[this.constructor.name]._query('MATCH (node {_id: {id}}) DETACH DELETE node', { id: payload._id });
        return deleted;
    }

    async transformData(data, req) {
        return data;
    }

    afterSave(data, req) {

    }

    async save(payload, req) {
        if(this.accessGranted(payload)) {
            let data = void 0;

            switch(req.method) {
                case 'DELETE':
                    data = await this.delete(payload);
                    break;
                default:
                    data = payload._id ? await this.update(payload) : await this.insert(payload);
                    break;
            }

            let transformed = await this.transformData(data, req);
            let normalized = model(transformed || {});

            this.afterSave(data, normalized, req);

            return normalized;
        }
        else this.generateError({ code:403, message: 'Вам отказано в доступе.', data: this.constructor.name });
    }
}

module.exports = { DBAccess }