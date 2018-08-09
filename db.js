'use strict'

const cluster = require('cluster');
const path = require('path');

const generate = require('nanoid/generate');

const BTC = require('./api/btc');
const btc = new BTC({env: 'dev'});

const bolt_port = 32768;

const neo = require('seraph')({
    bolt: true,
    server: `bolt://localhost:${bolt_port}`,
    user: 'neo4j',
    pass: '123'
});

const neoModel = require('seraph-model');

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
    
    let account = {
        club_address: String,
        wallet_address: String
    }
    
    let Account = neoModel(neo, 'Аккаунт', member);
    
    let Member = neoModel(neo, 'Участник', member);
    let RootMember = neoModel(neo, ['Участник', 'Основатель'], member);
    let Club = neoModel(neo, ['Участник', 'Клуб'], member);
    
    let RootList = neoModel(neo, ['Список', 'Корневой список']);
    RootList.compose(Member, 'members', 'позиция', { orderBy: 'email' });
    
    let List = neoModel(neo, 'Список');
    List.compose(Member, 'members', 'позиция', { orderBy: 'email' });
    
    Club.compose(Account, 'account', 'настройки');
    
    RootMember.compose(RootList, 'list', 'список');
    RootMember.compose(Account, 'account', 'настройки');
    
    Member.compose(List, 'list', 'список');
    Member.compose(Account, 'account', 'настройки');
    Member.compose(Member, 'referer', 'реферер');
    
    (async function() {
        let clubs = await Club._findAll();
        let club = !!!clubs.length && await Club._save({ 
            name: 'Club', 
            email: 'club@email.com', 
            hash: '',
            account: {
                club_address: await btc.getNewAddress(),
                wallet_address: ''
            }
        });
    
        let roots = await RootMember._findAll();
        if(!!!roots.length) {
            let rc = 7;
            while(rc) {
                await RootMember._save({ 
                    name: 'Участник ' + rc, 
                    email: rc + 'r@email.com', 
                    hash: '',
                    ref: generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6),
                    account: {
                        club_address: await btc.getNewAddress(),
                        wallet_address: ''
                    }
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
        Account,
        Member,
        RootMember,
        Club,
        RootList,
        List,
        btc,
        generate
    }
}