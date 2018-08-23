'use strict'

const cluster = require('cluster');
const path = require('path');
const crypto = require('crypto2');

const generate = require('nanoid/generate');

const BTC = require('./api/btc');
const btc = new BTC({env: 'dev'});

//const bolt_port = 32768;
const bolt_port = 32774;

const neo = require('seraph')({
    bolt: true,
    server: `bolt://localhost:${bolt_port}`,
    user: 'neo4j',
    pass: '123',
    id: '_id'
});

const neoModel = require('seraph-model');

const bcrypt = require('bcryptjs');

let hash = value => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(value, salt);
}

if(cluster.isMaster) { 

    //let db = module.exports;

    //FIELDS
    let member = {
        name: String,
        email: String,
        hash: String,
        referer: String,
        ref: String,
        group: String
    };
    
    let wallet = {
        club_address: String,
        wallet_address: String
    };
    
    let Wallet = neoModel(neo, 'Кошелек', wallet);
    
    let Member = neoModel(neo, 'Участник', member);
    let RootMember = neoModel(neo, ['Участник', 'Основатель'], member);
    let Club = neoModel(neo, ['Участник', 'Клуб'], member);
    
    let RootList = neoModel(neo, ['Список', 'Корневой список']);
    RootList.compose(RootMember, 'members', 'позиция', { orderBy: 'email', many: true });
    
    let List = neoModel(neo, 'Список');
    List.compose(Member, 'members', 'позиция', { orderBy: 'email', many: true });
    
    Club.compose(Wallet, 'wallet', 'имеет');
    
    RootMember.compose(RootList, 'list', 'список');
    RootMember.compose(Wallet, 'wallet', 'имеет');
    RootMember.compose(Member, 'referals', 'реферал', { many: true });
    
    Member.compose(List, 'list', 'список');
    Member.compose(Wallet, 'wallet', 'имеет');
    Member.compose(Member, 'referer', 'реферер');
    Member.compose(Member, 'referals', 'реферал', { many: true });

    let product = {
        name: String,
        icon: String,
        color: String,
        maxQty: Number,
        group: String,
        minPeriod: String
    };

    let price = {
        //'product': Link,
        amount: Number
    };

    let destination = {
        to: String,
        sum: Number,
        percent: Number
    };
    
    let Product = neoModel(neo, 'Продукт', product);
    let Price = neoModel(neo, 'Цена', price);
    let Destination = neoModel(neo, 'Распределение', destination);

    Product.compose(Price, 'price', 'ценообразование');
    Price.compose(Destination, 'destinations', 'распределение');

    let info = {
        caption: String,
        media: String,
        text: String,
        date: Number
        //author: Member
    };

    let Info = neoModel(neo, 'Информация', info);

    let news = {
        tags: Array,
        ...info
    };

    let News = neoModel(neo, ['Информация', 'Новость'], news);
    News.compose(Member, 'author', 'автор');

    let event = {
        event_date: Date,
        ...info
    };

    let Event = neoModel(neo, ['Информация', 'Событие'], event);

    let Message = neoModel(neo, ['Информация', 'Сообщение'], info);
    Message.compose(Member, 'from', 'от');
    Message.compose(Member, 'to', 'кому');

    let orderItem = {
    };

    let OrderItem = neoModel(neo, 'Элемент', orderItem);

    let order = {
        state: String,
        name: String,
        group: String,
        number: String,
        date: Date
    };

    let Order = neoModel(neo, ['Документ', 'Заказ'], order);
    Order.compose(OrderItem, 'items', 'состоит', { many: true });
    Order.compose(Member, 'member', 'участник');

    OrderItem.compose(Order, 'order', 'принадлежит');
    OrderItem.compose(Product, 'product', 'продукт');

    (async function() {

        let prices = await Price._findAll();
        
        let destinations = await Destination._findAll();
        if(!!!prices.length) {
            let rc = 5;
            while(rc !== 0) {

                await Destination._save({ 
                    to: 'referer.list.members.' + rc + '.address',
                    percent: 7
                });
    
                rc--;
            }
    
            await Destination._save({ 
                to: 'referer.list.members.0.address',
                percent: 20
            });

            await Destination._save({ 
                to: 'referer.list.members.6.address',
                percent: 15
            });

            await Destination._save({ 
                to: 'club.address',
                percent: 30
            });

            destinations = await Destination._findAll();
        }

        let price = !!!prices.length && await Price._save({ 
            amount: 75,
            destinations
        });

        let products = await Product._findAll();
        let product = !!!products.length && await Product._save({ 
            name: 'взнос',
            icon: 'fas fa-donate',
            color: 'red darken-2',
            maxQty: 1,
            group: 'donate',
            minPeriod: '1m',
            price
        });



        let clubs = await Club._findAll();
        if(!!!clubs.length) {
            let club_address = generate('1234567890abcdef', 32);

            try {
                club_address = await btc.getNewAddress();
            }
            catch(err) {}

            let club = await Club._save({ 
                name: 'Club', 
                email: 'club@email.com', 
                hash: '',
                wallet: {
                        club_address,
                        wallet_address: generate('1234567890abcdef', 32)
                    }
            });
        }
    
        let roots = await RootMember._findAll();
        if(!!!roots.length) {
            let rc = 7;
            while(rc) {
                let {privateKey, publicKey} = await crypto.createKeyPair();

                let club_address = generate('1234567890abcdef', 32);

                try {
                    club_address = await btc.getNewAddress();
                }
                catch(err) {}

                await RootMember._save({ 
                    name: 'Участник ' + rc, 
                    email: rc + 'r@email.com', 
                    hash: hash(rc + 'r@email.com:123'),
                    ref: generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6),
                    wallet: {
                            publicKey,
                            privateKey,
                            club_address,
                            wallet_address: generate('1234567890abcdef', 32)
                    },
                    group: 'admins'
                });
    
                rc--;
            }
    
            roots = await RootMember._findAll();
        }
    
        let lists = await RootList._findAll();
        if(!!!lists.length) {
            let list = {
                members: roots.sort((a, b) => a.email > b.email ? 1 : 0).map((member, inx) => {
                    member._rel = { номер: inx + 1 };
                    return member;
                })
            };
            
            list = await RootList._save(list);
    
            let last = list.members.pop();
            last.list = list;
            await RootMember._update(last);
        }
        
    })();

    module.exports = {
        btc,
        generate,
        Wallet,
        Member,
        RootMember,
        Club,
        RootList,
        List,
        Product,
        Info,
        Message,
        News,
        Event,
        Order,
        OrderItem
    }
}