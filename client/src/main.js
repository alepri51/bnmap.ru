import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import axios from 'axios';
 
import App from './App.vue';
import router from './router';
import store from './store';

import 'vuetify/dist/vuetify.min.css';

//import 'devextreme/dist/css/dx.common.css';
//import 'devextreme/dist/css/dx.material.blue.light.css';

import './../public/custom.css';

Vue.use(Vuetify, {
    theme: {
        primary: colors.indigo.darken2,
        secondary: colors.amber.darken2,
        accent: colors.green.darken2,
        'primary-light': '#F5F5F5',
        error: colors.red.darken2,
        inactive: colors.blueGrey.base,
        'default-action': colors.green.darken2
    }
});

Vue.config.productionTip = false;

/* let mapStoreActions = () => {
    let actions = Object.keys(store._actions);
    let map = actions.reduce((memo, name) => {
        memo[name] = store._actions[name][0];
        return memo;
    }, {});

    map.commit = store.commit;
    return map;
}; */

Vue.prototype.$colors = colors;

//import widget from './components/widget';

/* Vue.mixin({
    components: {
        //widget
    },
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
        },
        entity_data() {
            //debugger;

            return this.$store.state.entities[this.entity];
        },
        filter() {
            return this.entity_data; //переопределить в компоненте если надо фильтровать данные
        },
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
}); */

new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        //this.$store.commit('INIT');
    }
}).$mount('#app');
