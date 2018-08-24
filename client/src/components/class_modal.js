import Base from './class_base';

export default {
    extends: Base,
    data() {
        return {
            form: {},
            options: {},
            defaults: {}
        }
    },
    methods: {
        submit() {
            let validated = this.options.remove || this.$refs.form.validate();

            //validated && !this.options.remove && this.commit('MUTATE_ENTITY', { entity: this.entity, id: this.form._id, data: {...this.form} });

            let headers = {};
            let data = void 0;

            if(this.form.blob instanceof FormData) {
                headers = {
                    'content-type': 'multipart/form-data'
                };

                data = Object.keys(this.form).reduce((memo, key) => {
                    key !== 'blob' && memo.has(key) ? memo.set(key, this.form[key]) : memo.append(key, this.form[key]);

                    return memo;
                }, this.form.blob);
            }

            validated ? 
                this.execute({ 
                    method: this.options.remove ? 'delete' : 'post',
                    headers,
                    endpoint: `${this.entity}.save`,
                    payload: data || this.form, 
                    callback: (response) => {
                        if(!response.error) {
                            this.commit('HIDE_MODAL', { [this.entity]: void 0 });
                            this.options.remove && this.$emit('removed', this.form._id);
                            !this.form._id && this.$emit('appended', this.form._id);

                            !this.options.remove && this.form._id && this.commit('MUTATE_ENTITY', { entity: this.entity, id: this.form._id, data: {...this.form} });
                        }
                    }
                })
                :
                this.commit('SHOW_SNACKBAR', {text: 'Не корректно введены данные' });
        }
    },
    computed: {
        visible: { 
            get() {
                let { data: modal_data, options = {} } = this.state.modals[this.entity] || { data: void 0, options: void 0 };
                this.options = options;

                typeof modal_data === 'object' && (Object.keys(modal_data).length ? this.form = JSON.parse(JSON.stringify(modal_data)) : this.form = JSON.parse(JSON.stringify(this.defaults || {})));
                
                return !!modal_data;
            },
            set: () => {}
        },
    },
    watch: {
        'state.sign': async function (new_val, old_val) {
            /* if(this.visible && new_val.AUTHORIZED) {
                debugger
                let response = await this.execute({ method: 'post', endpoint: `${this.entity}.defaults` });
                !response.error && (this.defaults = response.rest_data);
            } */
    },
        'visible': async function (new_val, old_val) {
            //debugger;

            if(this.sign.AUTHORIZED && new_val) {
                let response = await this.execute({ method: 'post', endpoint: `${this.entity}.defaults` });
                !response.error && (this.defaults = response.rest_data);
            }
        }
    }
}