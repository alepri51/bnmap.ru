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
        let allow = super.checkSecurity(name, method);
        if(name === 'save') {
            allow = allow && this.auth.group === 'admins';
        }

        return allow;
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

    accessGranted(payload) {
        return (payload._id && payload.author && payload.author._id === this.member) || !!!payload._id;
        //return false;
    }

    async beforeInsert(payload) {
        payload.author = { _id: this.member };
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

        /* let orders = await db.find('order', { member: this.member });
        orders = orders.map(async order => {
            order.items = order.items.map(async item => {
                item.product = await db.findOne('product', { _id: item.product });

                return item;
            });

            order.items = await Promise.all(order.items);
            return order;
        });

        orders = await Promise.all(orders);

        let result = model({
            account: { 
                _id: this.member,
                orders
            }
        });

        return result; */
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

        order = await db.Order._save(payload);

        /* payload.items = payload.items.map(product => {
            product.product = product.product._id

            return product;
        }); */

        /* let delivery_roots = {
            club: await db.findOne('member', { group: 'club' }),
            referer: await db.findOne('member', { _id: member.referer })
        }
        
        let list = await db.findOne('list', { _id: delivery_roots.referer.list });
        let price = await db.findOne('price', { product: donate._id });
        delivery_roots.referer.list = list;

        let destinations = price.delivery.map(item => {
            let path = item.destination.split('.');
            let start = path.splice(0, 1).pop();
            let result = {
                member: delivery_roots[start].path(path.join('.')),
                sum: item.sum
            };
            
            return result;
        }); */

        //создать список транзакций на какие кошельки сколько рассылать по прайсингу каждого товара

        //order = await db.insert('order', { ...payload });
        //this.order = { ...this.order, ...order };
        return order;
    }

    async transformData(data, req) {
        //data.products = await db.find('product', { _id: { $in: data.products.map(product => product.product) }});
        //this.order._id = data._id;

        return data ? {
            account: {
                _id: data.member,
                orders: [this.order]
            }
        } : {}
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
            let order = await db.update('order', { number: data.number }, { state: 'регистрация' });

            result.account.orders = [order];
            this.io.emit(`${data.member}:update:${this.class_name}`,  model(result));

            order && setTimeout(async () => {
                let order = await db.update('order', { number: data.number }, { state: 'подтверждение' });
                
                result.account.orders = [order];
                this.io.emit(`${data.member}:update:${this.class_name}`,  model(result));

                order && setTimeout(async () => {
                    let order = await db.update('order', { number: data.number }, { state: 'распределение' });
                    
                    result.account.orders = [order];
                    this.io.emit(`${data.member}:update:${this.class_name}`,  model(result));

                    order && setTimeout(async () => {
                        let order = await db.update('order', { number: data.number }, { state: 'выполнен' });
                        
                        result.account.orders = [order];
                        this.io.emit(`${data.member}:update:${this.class_name}`,  model(result));
                    }, 1000 * 10);
                }, 1000 * 10);
            }, 1000 * 10);
        }, 1000 * 10);
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