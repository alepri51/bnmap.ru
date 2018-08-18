'use strict';

const { btc, generate, Account, Member, RootMember, Club, RootList, List, Message } = require('../db');

const bcrypt = require('bcryptjs');
const crypto = require('crypto2');

const { API } = require('./base_api');

class SignIn extends API {
    constructor(...args) {
        super(...args);
    }

    async submit({email, password}) {
        //console.log(email, password);
        this.error = void 0;

        let member = await Member._findOne({ email });
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

    async submit({ name, email, password, referer, wallet_address }) {
        
        let member = await Member._findOne({ email });

        //let members = await db.remove('member', { group: 'member' });

        this.error = void 0;

        if(!member) {
            referer = await Member._findOne({ ref: referer });
            
            let root = referer || await Member._query('MATCH (node:Участник)-[pos:позиция {номер: {n}}]-(:`Корневой список`)', { n: 7 });
            Array.isArray(root) && (root = root[0]);

            if(referer) {
            
                let members = referer.list.members.sort((a, b) => a._rel.номер - b._rel.номер);
                members = members.slice(1); 

                let {privateKey, publicKey} = await crypto.createKeyPair();

                member = await Member._save({ 
                    name, 
                    email, 
                    hash: this.hash(`${email}:${password}`),
                    referer,
                    ref: generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6),
                    wallet: {
                            publicKey,
                            privateKey,
                            club_address: await btc.getNewAddress(),
                            wallet_address
                    }
                });

                members.push(member);
                members = members.map((member, inx) => {
                    member._rel = { номер: inx + 1 };
                    return member;
                });

                //СОХРАНЕНИЕ НОВОГО СПИСКА, ЗДЕСТЬ ЧТО ТО НЕ ТАК
                let list = await List._save({members});

                member.list = list;
                await Member._update(member);

                let club = await Club._findAll();
                club = club.pop();

                let message = {
                    caption: `${member.name}, приветствуем в нашем клубе!`,
                    text: 'Добро пожаловать!',
                    date: Date.now(),
                    from: club,
                    to: member
                };

                await Message._save(message);

                referer.referals = referer.referals || [];
                referer.referals.push(member);

                await Member._update(referer);

                await this.generateJWT({ member });
            }
            else this.generateError({ code: 404, message: 'Не корректный номер реферера, проверьте номер и попробуйте еще раз. [' + root.ref + ']' });
        }
        else this.generateError({ code: 404, message: 'Не корректный адрес почтового ящика или пользователь уже зарегистрирован.' });
    }
}

module.exports = { SignIn, SignOut, SignUp };