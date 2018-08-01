import Base from './class_base';

export default {
    extends: Base,
    methods: {
        registerComponent(name) {
            this.commit('REGISTER_COMPONENT', name);
        }
    }
}

