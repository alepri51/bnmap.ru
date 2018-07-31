import Base from './class_base';

export default {
    extends: Base,
    data() {
        return {
            form: {}
        }
    },
    computed: {
        visible: { 
            get() {
                //debugger;
                let modal_data = this.state.modals[this.entity];

                if(typeof modal_data === 'object') {
                    Object.keys(modal_data).length ? this.form = JSON.parse(JSON.stringify(modal_data)) : this.form = JSON.parse(JSON.stringify(this.defaults || {}));
                }
                //this.form_data && typeof modal_data === 'object' && Object.keys(modal_data).length ? this.form_data = JSON.parse(JSON.stringify(modal_data)) : this.form_data = JSON.parse(JSON.stringify(this.defaults || {}));

                return !!modal_data;
            },
            set: () => {}
        },
    }
}