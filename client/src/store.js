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
        signed_id: false,
        entities: {},
        defaults: {},
        auth_state: void 0,
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
                icon: '',
                name: 'Новости',
                to: 'newslayout'
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
        ]
    },
    mutations: {
        CLEAR_CACHE(state) {
            requests_cache.reset();
            //!state.signed_id && (state.entities = {});
            //debugger;
            state.entities = {}
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

                let signed_id = auth ? true : !!state.auth;
                

                if(error) {
                    if(!error.system) {
                        let vertical = error.message.length > 50;
                        this.commit('SHOW_SNACKBAR', { text: `ОШИБКА: ${error.message}`, vertical });

                        requests_cache.reset();
                        (error.data && error.data.expired) && (signed_id ? this.commit('SHOW_MODAL', { signin: void 0 }) : router.replace('landing'));
                    }
                    else console.error(error.code, error.message, error.data);
                    //Для упрощения доступа к ошибке
                    response.error = error;
                }
                else this.commit('SET_SIGNED_IN', signed_id);

                //оставшиеся данные
                response.rest_data = { ...rest };

                if(signed_id) {
                    auth && this.commit('SET_AUTH', auth);
                    !cached && this.commit('SET_TOKEN', token);
    
                    entities = entities || {};
    
                    !cached && this.commit('SET_ENTITIES', { entities, map, result, entry, method: response.config.method });
    
                    response.data.cached = !!response.config.cache;
                    //return response;
                }
                //else  router.replace('landing');

                token ? state.auth && state.auth.member ? this.commit('SET_AUTH_STATE', 'AUTHORIZED') : this.commit('SET_AUTH_STATE', 'UNAUTHORIZED') : (error && error.data.expired) ? this.commit('SET_AUTH_STATE', 'EXPIRED') : !state.auth && this.commit('SET_AUTH_STATE', 'UNAUTHORIZED');
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
            /* if(!api) {
                this.commit('INIT');
                this.dispatch('execute', { endpoint: view, method: 'get' });
            } */

            !api && this.commit('INIT');
            //this.dispatch('execute', { endpoint: view, method: 'get' });

            state.view = view;
            state.notFound = false;
        },
        SET_AUTH_STATE(state, value) {
            state.auth_state = value;
            //console.log('CURRENT AUTH STATE:', state.auth_state);
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
        SET_SIGNED_IN(state, signed_id) {
            state.signed_id = signed_id;
            if(!signed_id) {
                this.commit('SET_AUTH', void 0);
                this.commit('HIDE_MODALS');
                this.commit('CLEAR_CACHE');
            }
        },
        SET_TOKEN(state, token) {
            token ? sessionStorage.setItem('token', token) : sessionStorage.removeItem('token');
            state.token = token;
        },
        SET_AUTH(state, auth) {
            state.auth && JSON.stringify(state.auth) !== JSON.stringify(auth) && this.commit('CLEAR_CACHE');
            //this.commit('CLEAR_CACHE');
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
                let merge = Object.keys(entities).length ? deepmerge(state.entities, entities || {}, {
                    arrayMerge: function (destination, source, options) {
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

                Object.keys(merge).length && (Vue.set(state, 'entities',  merge));
            }
            else !state.auth && (Vue.set(state, 'entities',  {}));

            //console.log('NEWS:', state.entities.news);
        },
        //PROJECT SPECIFIC
        ACCOUNT(state, id) {
            state.account = id;
        },
        ENTITY_REMOVE_BY_ID(state, { name, _id}) {
            //debugger;
            //delete state.entities[name][_id];
            Vue.delete(state.entities[name], _id);
        }
    },
    actions: {
        async execute({ commit, state }, { method, endpoint, payload, callback }) {
            console.log('REQUEST:', endpoint);

            let response;

            let config = {
                url: endpoint,
                method: method || 'get',
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
