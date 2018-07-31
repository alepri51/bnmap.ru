import store from './../store';

let mapStoreActions = () => {
    let actions = Object.keys(store._actions);
    let map = actions.reduce((memo, name) => {
        memo[name] = store._actions[name][0];
        return memo;
    }, {});

    map.commit = store.commit;
    return map;
};

let Base = {
    data() {
        return {
            entity: this.$options._componentTag
        }
    },
    methods: {
        ...mapStoreActions(),
        call(action, ...args) {
            this[action](...args);
        },
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

import widget from './widget';

let Widget = {
    extends: Base,
    components: {
        widget
    },
    computed: {
        row_data() {
            return this.$store.state.entities[this.entity];
        },
        filter() {
            return this.row_data; //переопределить в компоненте если надо фильтровать данные
        }
    }
}

let Modal = {
    extends: Base,
    data() {
        return {
            form_data: {}
        }
    },
    computed: {
        visible: { 
            get() {
                //debugger;
                let modal_data = this.state.modals[this.entity];

                this.form_data && typeof modal_data === 'object' && Object.keys(modal_data).length ? this.form_data = JSON.parse(JSON.stringify(modal_data)) : this.form_data = JSON.parse(JSON.stringify(this.defaults || {}));

                return !!modal_data;
            },
            set: () => {}
        },
    }
}

export default { Base, Widget, Modal}