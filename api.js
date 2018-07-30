'use strict'

const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto2');

const model = require('./model');

/*
1. token !== null
verify & decode
cache private key in REDIS (now just plain json)
check expiration & refresh if needed
2. token === null

return new token & auth & error every time

*/
let KEYS_CACHE = {};

class APIError extends Error {
    constructor(code, message) {
        super();
        this.code = code;
        this.message = message;
    }
}

class API {
    constructor(token, id) {
        this.token = token;
        this.id = id;
        this.member = void 0;
        this.error = void 0;

        this.payload = this.token && this.verifyJWT(this.token);
        this.member = this.payload && this.payload.member;

        let self = this;

        const handler = {
            get(target, propKey, receiver) {
                const origMethod = target[propKey];
                if(typeof origMethod === 'function') {
                    let method = self.security(propKey, origMethod);
                    
                    return function (...args) {
                        console.log('CALLED:', self.constructor.name, propKey);
                        const result = method.apply(self, args);
                        return result;
                    };
                }
                else return origMethod;
            }
        };
        return new Proxy(this, handler);
    }

    get auth() {
        return this.payload && this.payload.auth;
    }

    get class_name() {
        return this.constructor.name.toLowerCase();
    }

    security(name, method) {
        return method;
    }

    generateError({ code, message, data, system }) {
        let error = this.error;
        //data = data || this.error.data;
        this.error = new APIError(code, message);
        this.error.class = this.class_name;
        this.error.data = data;
        this.error.history = this.error.history || [];
        error && this.error.history.push(error);

        this.error.system = system;
    }

    hash(value) {
        let salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(value, salt);
    }

    async createPassword(precision) {
        let salt = bcrypt.genSaltSync(10);
        return await crypto.createPassword(salt, precision || 32);
    }

    async generateJWT({ member }) {
        //let salt = bcrypt.genSaltSync(10);
        //let jwtid = await crypto.createPassword(salt, 32);
        let jwtid = await this.createPassword(32)

        let payload = {
            jwtid,
            member: member._id,
            auth: {
                member: member._id,
                email: member.email,
                name: member.name
            },
            key: member.publicKey
        };

        this.signJWT(member.privateKey, payload);

        //await db.insert('token', payload);
        return this.token;
    }

    signJWT(private_key, payload) {
        delete payload.iat;
        delete payload.exp;

        this.token = jwt.sign(payload, private_key, {algorithm: 'RS256', expiresIn: '10s'});
        this.payload = payload;
    }

    verifyJWT(token) {
        let payload = jwt.decode(token);

        try {
            jwt.verify(token, payload.key);
            this.member = payload.member;

            let private_key = KEYS_CACHE[this.member];

            !private_key && setImmediate( async () => {
                let member = await db.findOne('member', { _id: payload.member });
                KEYS_CACHE[this.member] = member.privateKey;
            });

            private_key && this.signJWT(private_key, payload);

            return payload;
        }
        catch(err) {
            this.revokeJWT(payload.jwtid);
            this.generateError({ code: 403, message: err.message, data: err.expiredAt, system: true });
        };

    }

    async revokeJWT(id) {
        this.token = void 0;
        this.payload = void 0;
    }

    default(params) {
        return { params }
    }
};

class SecuredAPI extends API {
    constructor(...args) {
        super(...args);

    }

    security(name, method) {
        let exceptions = ['generateError'];
        let except = exceptions.includes(name); //AVOID STACK OVERFLOW DUE RECURSION

        let self = this;
        if(!except && !this.auth) {
            return function(...args) { 
                self.generateError({ code:403, message: 'Отказано в доступе. Пожалуйста аутентифицируйтесь', data: self.constructor.name });
            };
        }

        return method;
    }
}

class Auth extends API {
    constructor(...args) {
        super(...args);
    }
}

class Signin extends API {
    constructor(...args) {
        super(...args);
    }

    async submit({email, password}) {
        //console.log(email, password);
        this.error = void 0;

        let member = await db.findOne('member', {email});
        let auth = member && await bcrypt.compare(`${email}:${password}`, member.hash);

        auth && await this.generateJWT({ member });

        !auth && this.generateError({ code: 404, message: 'Пользователь не найден' });
    }
}

class Signout extends API {
    constructor(...args) {
        super(...args);
    }

    async submit({email, password}) {
        this.payload && await this.revokeJWT(this.payload.jwtid);

        return {auth: void 0};
    }
}

class Signup extends API {
    constructor(...args) {
        super(...args);
    }

    async submit({name, email, password, referer}) {
        let member = await db.findOne('member', { email });

        if(!member) {
            let default_list = await db.findOne('list', { default: true });
            
            if(!default_list) {
                let roots = await db.find('member', { group: "root" });
                roots = roots.map((member, inx) => { 
                    member.position = inx;
                    return member._id;
                });
                default_list = await db.insert('list', { default: true, members: roots});
            }
    
            referer = referer || default_list.members.slice(-1)[0];

            let hash = this.hash(`${email}:${password}`);
            let {privateKey, publicKey} = await crypto.createKeyPair();

            let member = await db.insert('member', { group: "member", referer, name, email, hash, publicKey, privateKey });
            
            let wallets = await db.findOne('wallet', { member: member._id, default: true });
            if(!wallets) {
                await db.insert('wallet', { member: member._id, address: await this.createPassword(64), default: true, name: 'Основной' });
                await db.insert('wallet', { member: member._id, address: await this.createPassword(64), name: 'Резервный' });
            }

            let from = await db.findOne('wallet', { member: member._id, default: true });
            let to = await db.findOne('wallet', { member: referer, default: true });

            await db.insert('transaction', { from: from.address, to: to.address, currency: 'btc', amount: 0.01, date: new Date() });
            await db.insert('transaction', { from: from.address, to: to.address, currency: 'bnc', amount: 1, date: new Date() });
            await db.insert('transaction', { from: from.address, to: to.address, currency: 'usd', amount: 5, date: new Date() });
            await db.insert('transaction', { from: to.address, to: from.address, currency: 'usd', amount: 1, date: new Date() });

            await this.generateJWT({ member });
        }
        else this.generateError({ code: 404, message: 'Не корректный адрес почтового ящика или пользователь уже зарегистрирован.' });
    }
}

class NewsLayout extends SecuredAPI {
    constructor(...args) {
        super(...args);
        //use proxy to handle not auth
    }

    async default(params) {
        //console.log(this.payload.member);
        let wallet = await db.findOne('wallet', { member: this.member, default: true });
        let transactions = await db.find('transaction', { $or: [{ to: wallet.address } , { from: wallet.address }] });
        //let out_txs = await db.find('transaction', { from: wallet.address });

        let sum = transactions.reduce((sum, tx) => {
            sum[tx.currency] = sum[tx.currency] || 0;
            tx.to === wallet.address ? sum[tx.currency] += tx.amount : sum[tx.currency] -= tx.amount;

            return sum;
        }, {});

        /* let outcome = out_txs.reduce((sum, tx) => {
            sum[tx.currency] = sum[tx.currency] || 0;
            sum[tx.currency] += tx.amount;

            return sum;
        }, {});

        let sum = Object.entries(outcome).reduce((sum, [currency, value]) => {
            sum[currency] = income[currency] - value;
            return sum;
        }, {}); */

        let news = await db.find('news', { member: this.member });

        let result = model({
            account: { 
                _id: this.member,
                balance: {
                    ...sum 
                }, 
                news, 
                transactions, 
                params 
            }
        });

        return result;

        //return { balance:  { ...sum }, dreams, transactions: { in_txs, out_txs }, params };
    }
}

class DBAccess extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    defaults() {
        return {
            name: 'some name',
            value: 100,
            //percent: 100
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
        return await db.insert(this.class_name, { ...payload });
    }

    async beforeUpdate(payload) {
        return payload;
    }

    async update(payload) {
        payload = await this.beforeUpdate(payload)
        return await db.update(this.class_name, { _id: payload._id }, { ...payload });
    }

    async beforeDelete(payload) {
        return payload;
    }

    async delete(payload) {
        payload = await this.beforeDelete(payload);
        return await db.remove(this.class_name, { _id: payload._id });
    }

    async transformData(data, req) {
        return data;
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

            let normalized = model(await this.transformData(data, req));

            return normalized;
        }
        else this.generateError({ code:403, message: 'Отказано в доступе. Пожалуйста аутентифицируйтесь', data: this.constructor.name });
    }
}

class News extends DBAccess {
    constructor(...args) {
        super(...args);
    }

    accessGranted(payload) {
        return (payload._id && payload.member && payload.member === this.member) || true;
    }

    async beforeInsert(payload) {
        payload.member = this.member;
        return payload;
    }

    async transformData(data, req) {
        return {
            account: {
                _id: data.member,
                news: [data]
            }
        }
    }
} 

let classes = {
    API,
    Signin,
    Signup,
    Signout,
    Auth,
    NewsLayout,
    News
}

module.exports = Object.entries(classes).reduce((memo, item) => {
    memo[item[0].toLowerCase()] = item[1];
    return memo;
}, {});
