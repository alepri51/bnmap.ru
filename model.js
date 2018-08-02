const normalizer = require('normalizr');

/* model = (data) => {
    data.api = data.api || 'v1';

    let schema = normalizer.schema;

    const _profile = new schema.Entity('profile', {});

    const _phone = new schema.Entity('phone', {});
    const _post = new schema.Entity('post', {});

    const _feed = new schema.Entity('feed', {
        posts: [_post]
    });

    const _message = new schema.Entity('message', {});

    const _chat = new schema.Entity('chat', {
        messages: [_message],
    });

    const _user = new schema.Entity('user', {
        phones: [_phone],
        profile: _profile,
        chats: [_chat]
    });

    const _scope = new schema.Entity('scope', {});

    const _client = new schema.Entity('client', {
        users: [_user],
        scopes: [_scope]
    });

    _user.define({applications: [_client]});
    _user.define({friends: [_user]});

    _chat.define({users: [_user]});
    _chat.define({owner: _user});

    const _create = new schema.Entity('create', {
        user: _user,
        scope: _scope,
        client: _client
    });

    const _node = new schema.Entity('node', {});
    const _edge = new schema.Entity('edge', {});

    const db = new schema.Entity('database', {
        clients: [_client],
        users: [_user],
        scopes: [_scope],
        create: _create,
        found: [_user],
        feed: [_feed],
        auth: _user,


        nodes: [_node],
        edges: [_edge]
    }, {
        idAttribute: 'api'
    });

    let normalized = normalizer.normalize(data, db);
    normalized = {...normalized, entry: 'database'};

    return normalized;
}; */

model = (data) => {
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

    const _member = new schema.Entity('member', {
        news: [_news],
        transactions: [_transaction],
        wallets: [_wallet],
        orders: [_order]
    }, { 
        idAttribute: '_id',
        processStrategy: (value, parent, key) => {
            //value.entity = 'member';
            return value;
        }
    });

    const db = new schema.Entity('database', {
        account: _member
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