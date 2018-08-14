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

    const _hierarchy = new schema.Entity('hierarchy', {}, { idAttribute: '_id' });
    const _list = new schema.Entity('list', {}, { idAttribute: '_id' });

    const _member = new schema.Entity('member', {
        news: [_news],
        transactions: [_transaction],
        wallets: [_wallet],
        orders: [_order],
        referals: [_hierarchy],
        list: [_list]
    }, { 
        idAttribute: '_id',
        processStrategy: (value, parent, key) => {
            //value.entity = 'member';
            return value;
        }
    });

    const _auth = new schema.Entity('auth', {}, { idAttribute: 'id' });
    const _error = new schema.Entity('error', {}, { idAttribute: 'code' });
    const _defaults = new schema.Entity('defaults', {}, { idAttribute: 'entity' });

    const db = new schema.Entity('database', {
        account: _member,
        auth: _auth,
        error: _error,
        defaults: {_defaults}
    }, { idAttribute: 'api' });

    let map = {};

    let mapping = (schema) => {
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
    map.database = 'database';

    let normalized = normalizer.normalize(data, db);
    normalized = {...normalized, entry: 'database', map};

    return normalized;
};
module.exports = model;