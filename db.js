'use strict'

const cluster = require('cluster');
const path = require('path');
const crypto = require('crypto2');

const generate = require('nanoid/generate');

const BTC = require('./api/btc');
const btc = new BTC({env: 'dev'});

const bolt_port = 32768;

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
        ref: String
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
    RootList.compose(Member, 'members', 'позиция', { orderBy: 'email', many: true });
    
    let List = neoModel(neo, 'Список');
    List.compose(Member, 'members', 'позиция', { orderBy: 'email', many: true });
    
    Club.compose(Wallet, 'wallets', 'имеет', { many: true });
    
    RootMember.compose(RootList, 'list', 'список');
    RootMember.compose(Wallet, 'wallets', 'имеет', { many: true });
    RootMember.compose(Member, 'referals', 'реферал', { many: true });
    
    Member.compose(List, 'list', 'список');
    Member.compose(Wallet, 'wallets', 'имеет', { many: true });
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
        date: Date
        //author: Member
    };

    let Info = neoModel(neo, 'Информация', info);
    Info.compose(Member, 'author', 'автор');

    (async function() {

        let prices = await Price._findAll();
        
        let destinations = await Destination._findAll();
        if(!!!prices.length) {
            let rc = 6;
            while(rc !== 1) {

                await Destination._save({ 
                    to: 'referer.list.members.' + rc + '.address',
                    percent: 7
                });
    
                rc--;
            }
    
            await Destination._save({ 
                to: 'referer.list.members.1.address',
                percent: 20
            });

            await Destination._save({ 
                to: 'referer.list.members.7.address',
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
        let club = !!!clubs.length && await Club._save({ 
            name: 'Club', 
            email: 'club@email.com', 
            hash: '',
            wallets: [
                {
                    club_address: await btc.getNewAddress(),
                    wallet_address: ''
                }
            ]
        });
    
        let roots = await RootMember._findAll();
        if(!!!roots.length) {
            let rc = 7;
            while(rc) {
                let {privateKey, publicKey} = await crypto.createKeyPair();

                await RootMember._save({ 
                    name: 'Участник ' + rc, 
                    email: rc + 'r@email.com', 
                    hash: hash(rc + 'r@email.com:123'),
                    ref: generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6),
                    publicKey,
                    privateKey,
                    wallets: [
                        {
                            club_address: await btc.getNewAddress(),
                            wallet_address: ''
                        }
                    ]
                });
    
                rc--;
            }
    
            roots = await RootMember._findAll();
        }
    
        let lists = await RootList._findAll();
        if(!!!lists.length) {
            let list = {
                members: roots.sort((a, b) => a.email > b.email ? 1 : -1).map((member, inx) => {
                    member._rel = { номер: inx + 1 }
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
        Wallet,
        Member,
        RootMember,
        Club,
        RootList,
        List,
        Product,
        Info,
        btc,
        generate
    }
}