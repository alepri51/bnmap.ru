import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';

const BASE_URL = 'https://localhost:8000';

//debugger;
const socket = io(BASE_URL);

Vue.prototype.$socket = socket;

socket.on('connect', () => {
    console.log(socket.connected); // true
});

/* socket.on('update', (data) => {
    console.log('SOCKET UPDATE DATA:', data);
}); */

socket.on('disconnect', (data) => {
    console.log('SOCKET UPDATE DATA:', data);
});

import axios from 'axios';
import deepmerge from 'deepmerge';
import { cacheAdapterEnhancer, throttleAdapterEnhancer, Cache } from 'axios-extensions';

import router from './router';

Vue.use(Vuex);

let requests_cache = new Cache();
let api = void 0;

/* const socket = io('wss://ws.blockchain.info/inv', {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log(socket.disconnected); // false
}); */


export default new Vuex.Store({
    strict: true,
    state: {
        api: void 0,
        loading: false,
        view: '',
        modals: {},
        /* dialogs: {
            signin: {
                visible: false
            },
            signup: {
                visible: false
            },
            signout: {
                visible: false
            },
            stepper: {
                visible: false
            },
            news: {
                visible: false,
                defaults: {
                    name: 'ooo',
                    percent: 0,
                    value: 0,
                    _id: void 0
                }
            }
        }, */
        token: void 0,
        auth: void 0,
        sign: {
            AUTHORIZED: false,
            EXPIRED: false,
            UNAUTHORIZED: true
        },
        entities: {},
        defaults: {},
        auth_state: void 0,
        scrolls: {},
        snackbar: {
            visible: false,
            color: 'red darken-2',
            timeout: 4000,
            text: '',
            caption: 'Закрыть',
            icon: '',
            vertical: false
        },
        notFound: false,
        menu: [
            {
                icon: 'fas fa-newspaper',
                name: 'Новости',
                to: 'newslayout'
            },
            {
                icon: '',
                name: 'Статьи',
                to: 'articlelayout'
            },
            {
                icon: '',
                name: 'Структура',
                to: 'structure'
            },
            {
                icon: '',
                name: 'Финансы',
                to: 'payment'
            }
        ],
        common_data: {}
    },
    mutations: {
        CLEAR_CACHE(state) {
            requests_cache.reset();
            //!state.signed_id && (state.entities = {});
            //debugger;
            state.entities = {}
        },
        RESET_CACHE(state) {
            requests_cache.reset();
        },
        SET_SCROLL(state, { name, position }) {
            state.scrolls[name] = position;
        },
        INIT(state) {
        
            api = axios.create({ 
                baseURL: `${BASE_URL}/api`,
                headers: { 'Cache-Control': 'no-cache' },
	            adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter))
                /* transformRequest: (data, headers) => {
                    return JSON.stringify(data);
                } */
            });

            state.token = sessionStorage.getItem('token');

/*             socket.on('update', (data) => {
                console.log('SOCKET UPDATE DATA:', data);
                debugger;
                this.commit('SET_ENTITIES', { method: 'GET', ...data });
            });
 */
            let onRequest = (config => {
                //state.token = sessionStorage.getItem('token');
                state.token && (config.headers.common.authorization = state.token);
                return config;
            });

            let onResponse = (response => {

                let {token, auth, error, entities, map, result, entry, cached, ...rest} = response.data;

                //оставшиеся данные
                response.rest_data = { ...rest };

                let sign = {
                    AUTHORIZED: false,
                    EXPIRED: false,
                    UNAUTHORIZED: false
                };

                auth && auth.member ? sign.AUTHORIZED = true : state.token && !token  ? sign.EXPIRED = true : sign.UNAUTHORIZED = true;

                !cached && token && this.commit('SET_TOKEN', token);
                auth && this.commit('SET_AUTH', auth);

                if(error) {
                    let vertical = error.message.length > 50;
                    !error.system ? this.commit('SHOW_SNACKBAR', { text: `ОШИБКА: ${error.message}`, vertical }) : console.error(error.code, error.message, error.data);

                    !error.system && error.code === 403 && !sign.UNAUTHORIZED && this.commit('SHOW_MODAL', { signin: void 0 });

                    response.error = error;
                }

                response.data.cached = !!response.config.cache;
                this.commit('SET_SIGN', sign);
                
                Object.keys(entities || {}).length && this.commit('SET_ENTITIES', { entities, map, result, entry, method: response.config.method });

                return response;
            });

            let onError = (error => {
                //Promise.reject(error);
                this.commit('SHOW_SNACKBAR', { text: `ОШИБКА: ${error.message}` });
            });

            api.interceptors.request.use(onRequest, onError);
            
            api.interceptors.response.use(onResponse, onError);

            //api.get('auth', { params: {timestamp: new Date() / 1 } });
        },
        LOADING(state, value) {
            state.loading = value;
        },
        REGISTER_VIEW(state, name) {
            Vue.component(
                name,
                async () => import(`./views/${name}`).catch(() => {
                    return import(`./views/not-found`);
                })
            );
        },
        REGISTER_COMPONENT(state, name) {
            Vue.component(
                name,
                async () => import(`./components/${name}`).catch((err) => {
                    console.error(err);
                    return import(`./components/stub`);
                })
            );
        },
        REFERER(state, referer) {
            state.referer = referer;
        },
        LOCATION(state, view) {
            !api && this.commit('INIT');
            this.dispatch('execute', { endpoint: view, method: 'get' });

            state.view = view;
            state.notFound = false;
        },
        NOT_FOUND(state) {
            state.notFound = true;
        },
        SHOW_MODAL(state, params) {
            //debugger;
            let [name] = Object.keys(params);
            //let data = params[name] || {};
            let [ data = {}, options ] = Object.values(params);
            
            Vue.set(state.modals, name, { data, options } || {});
        },
        HIDE_MODAL(state, params) {
            let name = Object.keys(params)[0];
            state.modals[name] = false;
        },
        HIDE_MODALS(state) {
            state.modals = {};
        },
        SET_SIGN(state, value) {
            if(JSON.stringify(state.sign) !== JSON.stringify(value)) {
                state.sign = value;

                //ivalue.AUTHORIZED && requests_cache.reset();
            } 
        },
        SET_TOKEN(state, token) {
            token ? sessionStorage.setItem('token', token) : sessionStorage.removeItem('token');
            state.token = token;
        },
        SET_AUTH(state, auth) {
            state.auth && JSON.stringify(state.auth) !== JSON.stringify(auth) && this.commit('CLEAR_CACHE');
            //this.commit('CLEAR_CACHE');
            JSON.stringify(state.auth) !== JSON.stringify(auth) && requests_cache.reset();
            state.auth = auth;
        },
        SHOW_SNACKBAR(state, options) {
            state.snackbar.visible = true;
            Object.assign(state.snackbar, options);
            //console.log(state.snackbar);
        },
        HIDE_SNACKBAR(state) {
            state.snackbar.visible = false;
        },
        SET_ENTITIES(state, { entities, map, result, entry, method }) {
            if(entities) {
                //debugger;
                let merge = Object.keys(entities).length ? deepmerge(state.entities, entities || {}, {
                    arrayMerge: function (destination, source, options) {
                        //debugger;
                        //ALL ARRAYS MUST BE SIMPLE IDs HOLDER AFTER NORMALIZE
                        if(method.toUpperCase() === 'DELETE') {
                            if(destination.length) {
                                return destination.filter(id => source.indexOf(id) === -1);
                            }
                            else {
                                return source;
                            }
                        }

                        let a = new Set(destination);
                        let b = new Set(source);
                        let union = Array.from(new Set([...a, ...b]));

                        return union;
                    }
                })
                :
                {};

                //Object.keys(merge).length && Vue.set(state, 'entities',  merge);
                if(Object.keys(merge).length)
                    Vue.set(state, 'entities',  merge);
            }
            //else !state.auth && (Vue.set(state, 'entities',  {}));

            console.log('NEWS:', state.entities.news);
        },
        SET_COMMON_DATA(state, data) {
            Vue.set(state, 'common_data', data);
        },
        MUTATE_ENTITY(state, payload) {
            debugger;
            let { entity, id, data } = payload;
            //state.entities[entity] && Vue.set(state.entities[entity], id, data);
        },
        //PROJECT SPECIFIC
        ACCOUNT(state, id) {
            state.account = id;
        },
        ENTITY_REMOVE_BY_ID(state, { name, _id}) {
            //debugger;
            //delete state.entities[name][_id];
            Vue.delete(state.entities[name], _id);
            Vue.nextTick();
        }
    },
    actions: {
        async execute({ commit, state }, { method, endpoint, payload, headers, callback }) {
            console.log('REQUEST:', endpoint);

            let response;

            headers = headers || {};

            let config = {
                url: endpoint,
                method: method || 'get',
                headers
            };

            config.cache = config.method === 'get' ? requests_cache : false;

            commit('LOADING', true);

            try {

                config.method === 'get' ? config.params = payload : config.data = payload;

                response = await api(config);
                
            }
            catch(err) {
                console.log('ERROR', err);
            };

            commit('LOADING', false);            

            if(callback) 
                callback(response); 
                else return response;
        }
    }
});
