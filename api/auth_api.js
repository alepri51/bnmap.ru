'use strict';

const db = require('../db');
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

    async submit({name, email, password, referer}) {
        let members = await db.remove('member', { group: 'member' });

        this.error = void 0;

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
            member = await db.update('member', { _id: member._id }, { list: list._id });
            //member = await db.remove('member', { _id: member.id });
            //member = await db.insert('member', { group: "member", referer: referer._id, name, email, hash, address, list: list._id, publicKey, privateKey });

            await this.generateJWT({ member });
        }
        else this.generateError({ code: 404, message: 'Не корректный адрес почтового ящика или пользователь уже зарегистрирован.' });
    }
}

module.exports = { SignIn, SignOut, SignUp };