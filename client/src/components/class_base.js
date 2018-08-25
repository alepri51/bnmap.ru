
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
            loaded: false,
            events: {},
            entity: this.$options._componentTag
        }
    },
    async created() {
        //debugger;
        //this.load();
        /* console.log('CREATED:', `${this.auth.member}:update:${this.entity}`);
        
        let response = await this.execute({ endpoint: `${this.entity}.defaults` });
        this.defaults = response.rest_data;

        if(this.auth.member) {
            this.$socket.off(this.events.update);

            let update = this.$socket.on(`${this.auth.member}:update:${this.entity}`, (data) => {
                console.log('SOCKET UPDATE DATA:', data);
                
                this.commit('SET_ENTITIES', { method: 'GET', ...data });
            });

            this.events.update = update.id;
        } */

    },
    watch: {
        'state.sign': async function (new_val, old_val) {
            if(this.auth.member) {
                console.log('REGISTER EVENT:', `${this.auth.member}:update:${this.entity}`);

                this.$socket.off(this.events.update);

                let update = this.$socket.on(`${this.auth.member}:update:${this.entity}`, (data) => {
                    console.log('SOCKET UPDATE DATA:', data);
                    
                    this.commit('SET_ENTITIES', { method: 'GET', ...data });
                });

                this.events.update = update.id;
            }
        }
    },
    methods: {
        /* async load() {
            //debugger;
            if(!this.sign.AUTHORIZED) return;

            console.log('MEMBER:', `${this.auth.member}:update:${this.entity}`);

            await this.execute({ endpoint: `${this.entity}` });

            //let response = await this.execute({ method: 'post', endpoint: `${this.entity}.defaults` });
            //this.defaults = response.rest_data;

            if(this.auth.member) {
                this.$socket.off(this.events.update);

                let update = this.$socket.on(`${this.auth.member}:update:${this.entity}`, (data) => {
                    console.log('SOCKET UPDATE DATA:', data);
                    
                    this.commit('SET_ENTITIES', { method: 'GET', ...data });
                });

                this.events.update = update.id;
            }

        }, */
        //...mapStoreActions(),
        execute(...args) {
            return this.$store._actions.execute[0](...args);
        },
        commit(...args) {
            return this.$store.commit(...args);
        },
        registerComponent(name) {
            this.commit('REGISTER_COMPONENT', name);
        }
    },
    computed: {
        sign() {
            return this.$store.state.sign;
        },
        authorized() {
            return !this.sign.UNAUTHORIZED;
        },
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

