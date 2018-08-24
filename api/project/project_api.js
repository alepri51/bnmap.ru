'use strict';

const db = require('../../db');
const model = require('../../model');

const ms = require('./ms');

const { SecuredAPI } = require('../base_api');
const { DBAccess } = require('../db_api');


//////////////////////////////////////////////
class NewsLayout extends SecuredAPI { //LAYOUT
    constructor(...args) {
        super(...args);
    }

    async default(params) {
        
    }
}

class News extends DBAccess { //WIDGET AND DIALOG
    constructor(...args) {
        super(...args);
    }

    checkSecurity(name, method) {
        let accessDeniedError = function(...args) {
            this.generateError({ code: 400, message: 'Вам отказано в доступе. Возможно Ваша учетная запись не обладает достаточным уровнем привелегий для выполнения запрошенной операции', data: { class: this.constructor.name }});
        };

        method = super.checkSecurity(name, method);

        if(name === 'save') {
            method = method || (this.auth.group !== 'admins' && accessDeniedError);
        }

        return method;
    }

    async default() {
        //let news = await db.find('news', { member: this.member });
        //let news = await db.Info._findAll();
        //let news = await db.Message._query('MATCH (:`Участник` {_id: {id}})-[:кому]-(node:Информация)', { id: this.member });
        let news = await db.News._findAll();

        let result = model({
            account: { 
                _id: this.member,
                news
            }
        });

        return result;
    }

    defaults() {
        let {value, percent = 99} = super.defaults();

        return {
            caption: 'Заголовок' + new Date(),
            text: 'Текст новости',
            tags: ['новость'],
            date: Date.now()
        }
    }

    /* async youtube() {
        //8qrECfnHr5QD1uXJNMsfZBypRSE5z1wTeClLXsxeqDaeZFT8S7mV1Dznx8t4
        let res = await axios.get('https://randomyoutube.net/api/getvid?api_token=8qrECfnHr5QD1uXJNMsfZBypRSE5z1wTeClLXsxeqDaeZFT8S7mV1Dznx8t4');
        return res.data.vid;
    } */

    accessGranted(payload) {
        return (payload._id && parseInt(payload.author) === this.member) || !!!payload._id;
        //return false;
    }

    async beforeInsert(payload, req) {
        payload.author = { _id: this.member };
        payload.date = Date.now();
        return payload;
    }

    async beforeUpdate(payload, req) {
        payload.author = { _id: payload.author };
        return payload;
    }

    async transformData(data, req) {
        return {
            account: {
                _id: this.member,
                news: [data]
            }
        }
    }
} 

class Payment extends SecuredAPI { //LAYOUT
    constructor(...args) {
        super(...args);
    }

    async default(params) {
        /* let member = await db.Member._findOne({ _id: this.member });

        let result = model({
            account: {
                _id: member._id,
                wallet: member.wallet
            }
        });

        return result; */
    }
}

class Structure extends SecuredAPI { //LAYOUT
    constructor(...args) {
        super(...args);
    }

    async defaults(params) {

    }

    async default(params) {
        let member = await db.Member._findOne({ _id: this.member });

        
        member.list.members = member.list.members.map(member => {
            !member._rel.номер && (member._rel.номер = 0);
            return member;
        });
        
        
        member.list.members = member.list.members.sort((a, b) => a._rel.номер - b._rel.номер);

        member.list.members.every((member, inx, arr) => {
            member._rel.номер !== inx && (arr[0]._rel.номер = inx);
            return member._rel.номер === inx;
        });
        
        let { name, email, ref } = member;

        member.list = member.list.members;
        member.referals = [
            {
                _id: member._id,
                name, 
                email, 
                ref,
                referals: member.referals
            }
        ];

        delete member.wallet;

        let result = model({
            account: member
        });

        return result;
    }
}

class Hierarchy extends DBAccess { //WIDGET
    constructor(...args) {
        super(...args);
    }

    async referals(params) {
        let member = await db.Member._findOne({ _id: parseInt(params.id) });

        if(member.referals) {
            delete member.list;
            
            member.referals = [
                {
                    _id: member._id,
                    name: member.name,
                    referals: member.referals
                }
            ];

            delete member.wallet;

            let result = model({
                account: member
            });

            return result;
        }
    }

    async default(params) {
        
    }
}

class Wallet extends DBAccess { //WIDGET
    constructor(...args) {
        super(...args);
    }

    async default() {
        let member = await db.Member._findOne({ _id: this.member });

        delete member.list;
        delete member.referals;

        let { _id } = member;
        let { club_address, wallet_address } = member.wallet;

        let result = model({
            account: {
                _id, 
                wallet: {
                    club_address, 
                    wallet_address
                }
            }
        });

        return result;
    }

}

class Order extends DBAccess { //WIDGET
    constructor(...args) {
        super(...args);
    }

    async default() {
        let orders = await db.Order._query('MATCH (node:Заказ)--(:Участник {_id:{id}}) ', { id: this.member }, { orderBy: 'node.date DESC' });
        
        orders = orders.map(order => {
            delete order.member;

            return order;
        });

        let result = model({
            account: { 
                _id: this.member,
                orders
            }
        });

        return result;
    }
}

class Donate extends DBAccess { // DIALOG
    constructor(...args) {
        super(...args);
    }

    default() {

    }

    async defaults() {

        let donate = await db.Product._findOne({ group: 'donate' });

        let member = await db.Member._findOne({ _id: this.member });
        //let price = await db.findOne('price', { product: donate._id });
        //let sum = price.delivery.reduce((sum, item) => sum + item.sum, 0);
        let sum = donate.price.amount;

        //let txs = await btc.adHoc('getbalance');
        //console.log(txs);
        let converted = await db.btc.convertToBtc(sum);

        return {
            address: member.wallet.club_address,
            items: [
                {
                    product: donate,
                    count: 1,
                    cost: converted.btc
                }
            ],
            sum: converted.btc
        }
    }

    accessGranted(payload) {
        return (payload._id && payload.member && payload.member === this.member) || !!!payload._id;
    }

    async insert(payload) {
        let member = await db.Member._findOne({ _id: this.member });
        if(!member.referer) {
            this.generateError({ code: 400, message: 'Вы не можете сделать взнос.'});
            return;
        }

        payload.member = member;
        payload.state = 'ожидание';
        payload.name = 'Взнос';
        payload.group = 'donate';
        payload.number = await this.createPassword(10);
        payload.date = Date.now();

        this.order = JSON.parse(JSON.stringify(payload));


        //let order = await db.Order._findOne({ member: this.member, group: 'donate' }, { orderBy: 'node.date DESC' });
        let order = await db.Order._query('MATCH (node:Заказ {group:"donate"})--(:Участник {_id:{id}}) ', { id: this.member }, { orderBy: 'node.date DESC' });
        order = order.length ? order[0] : void 0;
        //let news = await db.Message._query('MATCH (:`Участник` {_id: {id}})-[:кому]-(node:Информация)', { id: this.member });

        let donate = await db.Product._findOne({ group: 'donate' });
        donate.minPeriod = '10s';
        db.Product._update({ donate });

        let period = ms(donate.minPeriod);

        let difference = period;

        let now = Date.now();// / 1;
        let allowed = !!order ? (order.date + period) < now : true;

        if(!allowed) {
            this.generateError({ code: 400, message: 'Взнос уже сделан. Следующий взнос возможен через ' + ms((order.date + period) - now, { long: true }) + ' период: ' + ms(period, { long: true }) });
            return;
        }

        payload.items = payload.items.map(product => {
            product.product = donate

            return product;
        });

        let club = await db.Club._findAll();
        club = club[0];
        club.address = club.wallet.wallet_address;

        let referer = await db.Member._findOne({ _id: member.referer._id });
        referer.list.members = referer.list.members.map(async member => {
            member = await db.Member._findOne({ _id: member._id });

            return member;
        });

        referer.list.members = await Promise.all(referer.list.members);
        referer.list.members = referer.list.members.map(member => {
            member.address = member.wallet.wallet_address;

            return member;
        })

        let delivery_roots = {
            club,
            referer
        };

        let price = donate.price;

        let $path = function(object, path) {
            let splitted = path.split('.');
            let res = splitted.reduce((obj, key) => {
                return obj[key];
        
            }, object);
        
            return res;
        }

        payload.sum = payload.items.reduce((sum, item) => {
            return item.cost * item.count;
        }, 0);

        let destinations = price.destinations.map((item, inx) => {
            let path = item.to.split('.');
            let start = path.splice(0, 1).pop();
            let result = {
                line: inx,
                percent: item.percent,
                address: $path(delivery_roots[start], path.join('.')),
                amount: payload.sum * item.percent / 100
            };
            
            return result;
        });

        destinations = {
            type: 'donate',
            amount: payload.sum,
            address: payload.address,
            destinations 
        }

        order = await db.Order._save(payload);

        return order;
    }

    async transformData(data, req) {
        //data.products = await db.find('product', { _id: { $in: data.products.map(product => product.product) }});
        //this.order._id = data._id;

        if(data) {
            let _id = data.member._id;

            data.member = {
                _id
            };

            let orders = [data];

            return data ? {
                account: {
                    _id,
                    orders
                }
            } : {}
        }

        
    }

    afterSave(data, normalized, req) {
        let result = data && {
            account: {
                _id: data.member,
                orders: []
            }
        };

        //console.log('EVENT:', `${data.member}:update:${this.class_name}`);

        data && setTimeout(async () => {
            let order = await db.Order._update({ _id: data._id, state: 'регистрация' });
            order = await db.Order._findOne({ _id: data._id });

            result.account.orders = [order];
            this.io.emit(`${data.member._id}:update:${this.class_name}`,  model(result));

            order && setTimeout(async () => {
                let order = await db.Order._update({ _id: data._id, state: 'подтверждение' });
                order = await db.Order._findOne({ _id: data._id });
                
                result.account.orders = [order];
                this.io.emit(`${data.member._id}:update:${this.class_name}`,  model(result));

                order && setTimeout(async () => {
                    let order = await db.Order._update({ _id: data._id, state: 'распределение' });
                    order = await db.Order._findOne({ _id: data._id });
                    
                    result.account.orders = [order];
                    this.io.emit(`${data.member._id}:update:${this.class_name}`,  model(result));

                    order && setTimeout(async () => {
                        let order = await db.Order._update({ _id: data._id, state: 'выполнен' });
                        order = await db.Order._findOne({ _id: data._id });
                        
                        result.account.orders = [order];
                        this.io.emit(`${data.member._id}:update:${this.class_name}`,  model(result));
                    }, 1000 * 5);
                }, 1000 * 5);
            }, 1000 * 5);
        }, 1000 * 5);
    }
} 

class Pricing extends DBAccess {
    constructor(...args) {
        super(...args);
    }
}

class Product extends DBAccess {
    constructor(...args) {
        super(...args);
    }
}

module.exports = {
    NewsLayout,
    News, //AS WIDGET & DIALOG
    Payment,
    Wallet,
    Donate,
    Order,
    Hierarchy,
    Structure
};