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

    async default() {
        //let news = await db.find('news', { member: this.member });
        let news = await db.Info._findAll();

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
            caption: 'Новая новость ' + new Date(),
            text: '',
            tags: '#новость'
        }
    }

    accessGranted(payload) {
        return (payload._id && payload.member && payload.member === this.member) || !!!payload._id;
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

class Payment extends SecuredAPI { //LAYOUT
    constructor(...args) {
        super(...args);
    }

    async default(params) {
        
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

        let referals = await db.Member._query('MATCH (:`Участник` {_id: {id}})-[:реферал*]-(node:Участник)', { id: this.member });
        
        referals.forEach((element, inx, arr) => {
            element.referals && (element.referals = element.referals.map(referal => {
                return arr.find(ref => ref._id === referal._id);;
            }));
        })

        referals = referals.filter(ref => ref.referer && ref.referer._id === this.member);

        let shrink = (referals => {
            return referals.map(referal => {
                let { _id, name, ref, email, referals, _rel } = referal;
                referals = shrink(referals || []);

                return { _id, name, ref, email, referals, _rel }
            });
        });

        referals = shrink(referals);
        
        let result = model({
            account: { 
                _id: this.member,
                referals,
                list: shrink(member.list.members)
            }
        });

        return result;
    }
}

class Hierarchy extends DBAccess { //WIDGET
    constructor(...args) {
        super(...args);
    }

    async default(params) {
        /* let referals = await db.Member._query('MATCH (:`Участник` {_id: {id}})-[:реферал*]-(node:Участник)', { id: this.member }, { computeLevels: 100 });
        
        referals.forEach((element, inx, arr) => {
            element.referals && (element.referals = element.referals.map(referal => {
                return arr.find(ref => ref._id === referal._id);;
            }));
        })

        referals = referals.filter(ref => ref.referer._id === this.member);

        let shrink = (referals => {
            return referals.map(referal => {
                let { _id, name, ref, email, referals } = referal;
                referals = shrink(referals || []);

                return { _id, name, ref, email, referals }
            });
        });

        referals = shrink(referals);
        
        let result = model({
            account: { 
                _id: this.member,
                referals
            }
        });

        return result; */
    }
}

class Wallet extends DBAccess { //WIDGET
    constructor(...args) {
        super(...args);
    }

    async default() {
        let member = await db.Member._findOne({ _id: this.member });

        let result = model({
            account: { 
                _id: this.member,
                wallets: member.wallets
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
            address: member.wallets[0].club_address,
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
        payload.member = this.member;
        payload.state = 'ожидание';
        payload.name = 'Взнос';
        payload.group = 'donate';
        payload.number = await this.createPassword(10);

        this.order = JSON.parse(JSON.stringify(payload));

        let member = await db.findOne('member', { _id: this.member });
        if(!member.referer) {
            this.generateError({ code: 403, message: 'Вы не можете сделать взнос.'});
            return;
        }


        let order = await db.findOne('order', { member: this.member, group: 'donate' }, { sort: { created: -1 }});

        let donate = await db.findOne('product', { group: 'donate' });
        let period = ms(donate.minPeriod);

        let difference = period;

        let now = Date.now();// / 1;
        let allowed = !!order ? (order.created + period) < now : true;

        if(!allowed) {
            this.generateError({ code: 403, message: 'Взнос уже сделан. Следующий взнос возможен через ' + ms((order.created + period) - now, { long: true }) + ' период: ' + ms(period, { long: true }) });
            return;
        }

        payload.items = payload.items.map(product => {
            product.product = product.product._id

            return product;
        });

        let delivery_roots = {
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
        });

        //создать список транзакций на какие кошельки сколько рассылать по прайсингу каждого товара

        order = await db.insert('order', { ...payload });
        this.order = { ...this.order, ...order };
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