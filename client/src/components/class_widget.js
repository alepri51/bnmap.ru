import Base from './class_base';
import widget from './widget';

export default {
    extends: Base,
    components: {
        widget
    },
    computed: {
        raw_data() {
            //debugger;
            return this.$store.state.entities[this.entity];
        },
        filter() {
            //debugger;
            return this.raw_data; //переопределить в компоненте если надо фильтровать данные
        }
    }
}