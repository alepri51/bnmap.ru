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

            validated ? 
                this.execute({ 
                    method: this.options.remove ? 'delete' : 'post', 
                    endpoint: `${this.entity}.save`,
                    payload: this.form, 
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
                //debugger;
                let { data: modal_data, options = {} } = this.state.modals[this.entity] || { data: void 0, options: void 0 };
                this.options = options;

                typeof modal_data === 'object' && (Object.keys(modal_data).length ? this.form = JSON.parse(JSON.stringify(modal_data)) : this.form = JSON.parse(JSON.stringify(this.defaults || {})));
                
                return !!modal_data;
            },
            set: () => {}
        },
    }
}