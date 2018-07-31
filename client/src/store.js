import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import deepmerge from 'deepmerge';
import { cacheAdapterEnhancer, throttleAdapterEnhancer, Cache } from 'axios-extensions';

import router from './router';

Vue.use(Vuex);

let requests_cache = new Cache();

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
                name: 'Магазин',
                to: 'shop'
            },
            {
                icon: '',
                name: 'Настройки',
                to: 'settings'
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
            state.api = axios.create({ 
                baseURL: 'https://localhost:8000/api',
                headers: { 'Cache-Control': 'no-cache' },
	            adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter))
                /* transformRequest: (data, headers) => {
                    return JSON.stringify(data);
                } */
            });

            state.token = sessionStorage.getItem('token');

            let onRequest = (config => {
                state.token && (config.headers.common.authorization = state.token);
                return config;
            });

            let onResponse = (response => {

                let {token, auth, error, entities, map, result, entry, cached, ...rest} = response.data;

                let signed_id = auth ? true : !!state.auth;
                this.commit('SET_SIGNED_IN', signed_id);

                if(error) {
                    if(!error.system) {
                        let vertical = error.message.length > 50;
                        this.commit('SHOW_SNACKBAR', { text: `ОШИБКА: ${error.message}`, vertical });

                        error.code === 403 && signed_id ? this.commit('SHOW_MODAL', { signin: void 0 }) : router.replace('landing');
                        //error.code === 403 && signed_id ? this.commit('SHOW_MODAL', { signin: void 0 }) : void 0;
                    }
                    else console.error(error.code, error.message, error.data);
                    //Для упрощения доступа к ошибке
                    response.error = error;
                }

                //оставшиеся данные
                response.rest_data = { ...rest };

                if(signed_id) {
                    auth && this.commit('SET_AUTH', auth);
                    !cached && this.commit('SET_TOKEN', token);
    
                    entities = entities || {};
    
                    !cached && this.commit('SET_ENTITIES', { entities, map, result, entry, method: response.config.method });
    
                    response.data.cached = !!response.config.cache;
                    return response;
                }
                //else  router.replace('landing');

            });
            
            let onError = (error => {
                //Promise.reject(error);
                this.commit('SHOW_SNACKBAR', { text: `ОШИБКА: ${error.message}` });
            });

            state.api.interceptors.request.use(onRequest, onError);
            
            state.api.interceptors.response.use(onResponse, onError);

            //state.api.get('auth', { params: {timestamp: new Date() / 1 } });
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
            /* if(!state.api) {
                this.commit('INIT');
                this.dispatch('execute', { endpoint: view, method: 'get' });
            } */

            !state.api && this.commit('INIT');
            this.dispatch('execute', { endpoint: view, method: 'get' });

            state.view = view;
            state.notFound = false;
        },
        NOT_FOUND(state) {
            state.notFound = true;
        },
        SHOW_MODAL(state, params) {
            //debugger;
            let name = Object.keys(params)[0];
            let data = params[name] || {};
            
            Vue.set(state.modals, name, data || true);
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
            state.auth = auth;
        },
        SHOW_SNACKBAR(state, options) {
            state.snackbar.visible = true;
            Object.assign(state.snackbar, options);
            console.log(state.snackbar);
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

                Object.keys(merge).length && (state.entities = merge);
            }
            else !state.auth && (state.entities = {});

            console.log('NEWS:', state.entities.news);
        },
        //PROJECT SPECIFIC
        ACCOUNT(state, id) {
            state.account = id;
        }
    },
    actions: {
        async execute({ commit, state }, { method, endpoint, payload, callback }) {
            
            let response;

            let config = {
                url: endpoint,
                method: method || 'get',
            };

            config.cache = config.method === 'get' ? requests_cache : false;

            commit('LOADING', true);

            try {

                config.method === 'get' ? config.params = payload : config.data = payload;

                response = await state.api(config);
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
