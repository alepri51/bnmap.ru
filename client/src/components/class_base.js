
/* let mapStoreActions = () => {
    let actions = Object.keys(store._actions);
    let map = actions.reduce((memo, name) => {
        memo[name] = store._actions[name][0];
        return memo;
    }, {});

    map.commit = store.commit;
    return map;
}; */

export default {
    data() {
        return {
            entity: this.$options._componentTag
        }
    },
    beforeCreate() {
        
    },
    methods: {
        //...mapStoreActions(),
        execute(...args) {
            return this.$store._actions.execute[0](...args);
        },
        commit(...args) {
            return this.$store.commit(...args);
        }
    },
    computed: {
        state() {
            return this.$store.state;
        },
        api() {
            return this.$store.state.api;
        },
        auth() {
            return this.$store.state.auth || {name: 'Аноним'};
        },

        entities() {
            return this.$store.state.entities;
        }        
    }
}

