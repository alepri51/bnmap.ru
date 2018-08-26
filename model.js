'use strict';

const normalizer = require('normalizr');

let model = (data = {}) => {
    data.api = data.api || 'v1';

    let schema = normalizer.schema;

    const _transaction = new schema.Entity('transaction', {}, { idAttribute: '_id' });
    const _wallet = new schema.Entity('wallet', {}, { idAttribute: '_id' });
    const _news = new schema.Entity('news', {}, { idAttribute: '_id' });
    
    const _product = new schema.Entity('product', {}, { idAttribute: '_id' });

    const _item = new schema.Entity('item', {
        product: _product
    }, {
        idAttribute: value => value.product,
        processStrategy: (value, parent, key) => {
            //value.entity = 'member';
            //value._id = value.product;
            return value;
        }
    });

    const _order = new schema.Entity('order', {
        items: [_item]
    }, { idAttribute: '_id' });

    const _hierarchy = new schema.Entity('referal', {}, { idAttribute: '_id' });
    _hierarchy.define({ referals: [_hierarchy] });

    const _list = new schema.Entity('list', {}, { idAttribute: '_id' });
    
    const _referal = new schema.Entity('member', {}, { idAttribute: '_id' });
    const _section = new schema.Entity('section', {}, { idAttribute: '_id' });
    _section.define({ sections: [_section] });

    const _member = new schema.Entity('member', {
        news: [_news],
        transactions: [_transaction],
        wallet: _wallet,
        orders: [_order],
        list: _list,
        referals: [_hierarchy],
        sections: [_section]
    }, { idAttribute: '_id' });

    _news.define({ author: _member });

    //_member.define({ referals: [_member] });
    _list.define({ members: [_member] });

    const _auth = new schema.Entity('auth', {}, { idAttribute: 'id' });
    const _error = new schema.Entity('error', {}, { idAttribute: 'code' });
    const _defaults = new schema.Entity('defaults', {}, { idAttribute: 'entity' });

    const db = new schema.Entity('database', {
        account: _member,
        //auth: _auth,
        error: _error,
        defaults: {_defaults}
    }, { idAttribute: 'api' });

    let map = {};

    /* let mapping = (schema) => {
        let entries = Object.entries(schema);
        entries.forEach(entry => {
            let from = entry[0];
            let to = entry[1];
            to = to instanceof Array ? to[0] : to;
    
            if(to._key) {
                map[from] = to._key;
                mapping(to.schema);        
            }
            else mapping(to);
        });
    }

    mapping(db.schema);
    map.database = 'database'; */

    let normalized = normalizer.normalize(data, db);
    normalized = {...normalized, entry: 'database', map};

    return normalized;
};
module.exports = model;