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

    async save(payload, req) {
        if(this.accessGranted(payload)) {
            let data = void 0;

            switch(req.method) {
                case 'DELETE':
                    data = await this.delete(payload, req);
                    break;
                default:
                    data = payload._id ? await this.update(payload, req) : await this.insert(payload, req);
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