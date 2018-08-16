import Base from './class_base';
import widget from './widget';

export default {
    extends: Base,
    components: {
        widget
    },
    created() {
        //this.state.auth && this.execute({ endpoint: this.entity, method: 'get' });
        this.load();
    },
    methods: {
        removed(_id) {
            //debugger;
            this.commit('ENTITY_REMOVE_BY_ID', { name: this.entity, _id });
        },
        appended(_id) {
            debugger;
            let container = this.$el.querySelector("#scrollable");
            container && (container.scrollTop = container.scrollHeight);
        }
    },
    computed: {
        raw_data() {
            //debugger;
            return this.$store.state.entities[this.entity] ? Object.values(this.$store.state.entities[this.entity]) : [];
        },
        filter() {
            return this.raw_data; //переопределить в компоненте если надо фильтровать данные
        }
    },
    watch: {
        'state.sign': async function (new_val, old_val) {
            await this.execute({ endpoint: `${this.entity}` });
        }
    }

}