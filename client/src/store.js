import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import deepmerge from 'deepmerge';
//import MockAdapter from 'axios-mock-adapter';
import { cacheAdapterEnhancer, throttleAdapterEnhancer, Cache } from 'axios-extensions';


Vue.use(Vuex);

let requests_cache = new Cache();

export default new Vuex.Store({
    strict: true,
    state: {
        api: void 0,
        loading: false,
        view: '',
        modals: {},
        dialogs: {
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
        },
        token: void 0,
        auth: void 0,
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
            state.entities = {};
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

                if(error) {
                    if(!error.system) {
                        let vertical = error.message.length > 50;
                        this.commit('SHOW_SNACKBAR', { text: `ОШИБКА: ${error.message}`, vertical });
                        error.code === 403 && this.commit('SHOW_DIALOG', { dialog: 'signin' });
                    }
                    else console.error(error.code, error.message, error.data);
                    //Для упрощения достопа к ошибке
                    response.error = error;
                }

                //!auth && (router.replace('landing'));

                this.commit('SET_AUTH', auth);
                this.commit('SET_TOKEN', token);

                !cached && this.commit('SET_ENTITIES', { entities, map, result, entry, method: response.config.method });

                response.data.cached = !!response.config.cache;
                return response;
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
                async () => import(`./components/${name}`).catch(() => {
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
            debugger;
            let name = Object.keys(params)[0];
            let data = params[name] || {};
            
            Vue.set(state.modals, name, data || true);
        },
        HIDE_MODAL(state, params) {
            let name = Object.keys(params)[0];
            state.modals[name] = false;
        },
        SHOW_DIALOG(state, payload) {
            let {disabled, ...data} = payload.data || {};
            state.dialogs[payload.dialog].disabled = disabled;
            state.dialogs[payload.dialog].defaults = { ...state.dialogs[payload.dialog].defaults, ...data };
            state.dialogs[payload.dialog].visible = true;
        },
        HIDE_DIALOG(state, dialog) {
            state.dialogs[dialog].visible = false;
        },
        SET_TOKEN(state, token) {
            token ? sessionStorage.setItem('token', token) : sessionStorage.removeItem('token');
            state.token = token;
        },
        SET_AUTH(state, auth) {
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
                let merge = deepmerge(state.entities, entities || {}, {
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
                });

                state.entities = merge;
            }
            else !state.auth && (state.entities = {});
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
