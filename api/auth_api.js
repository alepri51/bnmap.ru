'use strict';

const { btc, generate, Account, Member, RootMember, Club, RootList, List } = require('../db');

const bcrypt = require('bcryptjs');

const { API } = require('./base_api');

class SignIn extends API {
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

class SignOut extends API {
    constructor(...args) {
        super(...args);
    }

    async submit({email, password}) {
        this.payload && await this.revokeJWT(this.payload.jwtid);

        return {auth: void 0};
    }
}

class SignUp extends API {
    constructor(...args) {
        super(...args);
    }

    async submit({ name, email, password, referer = 'BUWUMD', wallet_address }) {
        
        let member = await Member._findOne({ email });

        //let members = await db.remove('member', { group: 'member' });

        this.error = void 0;

        if(!member) {
            
            referer = await Member._findOne({ ref: referer }) || await RootMember._findOne({ ref: referer });;
            

            member = await Member._save({ 
                name, 
                email, 
                hash: this.hash(`${email}:${password}`),
                referer,
                ref: generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6),
                account: {
                    club_address: await btc.getNewAddress(),
                    wallet_address
                }
            });
    
            //member.referer = referer;
            //member = await Member._update(member); //НЕ НАХОДИТ КОРЕНЬ

            /* let root_list = await List.findOne('list', { default: true });
            
            referer = referer || default_list.members.slice(-1)[0];

            referer = await db.findOne('member', { _id: referer });

            let referer_list = await db.findOne('list', { _id: referer.list });

            let hash = this.hash(`${email}:${password}`);
            let {privateKey, publicKey} = await crypto.createKeyPair();

            let btc = new BTC({env: 'dev'});
            let address = await btc.getNewAddress();
            let member = await db.insert('member', { group: "member", referer: referer._id, name, email, hash, address, list: void 0, publicKey, privateKey });

            let list_members = referer_list.members.slice(1);
            list_members.push(member._id);

            let list = await db.insert('list', { members: list_members });
            member = await db.update('member', { _id: member._id }, { list: list._id }); */
            //member = await db.remove('member', { _id: member.id });
            //member = await db.insert('member', { group: "member", referer: referer._id, name, email, hash, address, list: list._id, publicKey, privateKey });

            await this.generateJWT({ member });
        }
        else this.generateError({ code: 404, message: 'Не корректный адрес почтового ящика или пользователь уже зарегистрирован.' });
    }
}

module.exports = { SignIn, SignOut, SignUp };