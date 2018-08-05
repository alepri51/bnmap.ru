
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
            events: {},
            entity: this.$options._componentTag
        }
    },
    async created() {
        /* console.log('EVENT:',`${this.auth.member}:update:${this.entity}`);
        this.auth && this.$socket.on(`${this.auth.member}:update:${this.entity}`, (data) => {
            console.log('SOCKET UPDATE DATA:', data);
            
            this.commit('SET_ENTITIES', { method: 'GET', ...data });
        }); */

        console.log('CREATE:', `${this.auth.member}:update:${this.entity}`);

        let response = await this.execute({ endpoint: `${this.entity}.defaults` });
        this.defaults = response.rest_data;

        if(this.auth.member) {
            this.$socket.off(this.events.update);

            let update = this.$socket.on(`${this.auth.member}:update:${this.entity}`, (data) => {
                console.log('SOCKET UPDATE DATA:', data);
                
                this.commit('SET_ENTITIES', { method: 'GET', ...data });
            });

            this.events.update = update.id;
        }

    },
    async activated() {
        //this.state.auth && this.execute({ endpoint: this.entity, method: 'get' });

        /* if(!this.defaults && this.state.auth) {
            let response = await this.execute({ endpoint: `${this.entity}.defaults` });
            this.defaults = response.rest_data;

            this.$socket.off(this.events.update);
            this.events = {};

            let update = this.$socket.on(`${this.auth.member}:update:${this.entity}`, (data) => {
                console.log('SOCKET UPDATE DATA:', data);
                
                this.commit('SET_ENTITIES', { method: 'GET', ...data });
            });

            this.events.update = update.id
        } */
    },
    watch: {
        'state.auth.member': async function (new_val, old_val) {
            console.log('MEMBER:', `${this.auth.member}:update:${this.entity}`);

            let response = await this.execute({ method: 'post', endpoint: `${this.entity}.defaults` });
            this.defaults = response.rest_data;

            if(new_val) {
                this.$socket.off(this.events.update);

                let update = this.$socket.on(`${this.auth.member}:update:${this.entity}`, (data) => {
                    console.log('SOCKET UPDATE DATA:', data);
                    
                    this.commit('SET_ENTITIES', { method: 'GET', ...data });
                });

                this.events.update = update.id;
            }
            /* if(this.defaults) {
                console.log('DEFAULTS:', this.entity);

                let response = await this.execute({ endpoint: `${this.entity}.defaults` });
                this.defaults = response.rest_data;
            }

            if(!this.events.update) {
                console.log('EVENT:', `${this.auth.member}:update:${this.entity}`);

                let update = this.$socket.on(`${this.auth.member}:update:${this.entity}`, (data) => {
                    console.log('SOCKET UPDATE DATA:', data);
                    
                    this.commit('SET_ENTITIES', { method: 'GET', ...data });
                });

                this.events.update = update.id;
            } */
        }
    },
    methods: {
    
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

