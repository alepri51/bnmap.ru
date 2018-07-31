<template>
    <v-dialog v-model="visible" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <v-icon class="mr-1 primary--text">fas fa-exclamation</v-icon>
                <span class="headline primary--text">Новость</span>
            </v-card-title>
            <v-card-text>
                <v-card-text>
                    <v-form ref="form" class="form" lazy-validation @submit.prevent>
                        <v-text-field 
                            :disabled="options.disabled"
                            v-model="form.name"
                            label="О чем вы мечтаете"
                            hint="Например: хочу дом на берегу атлантического океана"
                            required
                            autofocus
                            color="primary"
                            :rules="[
                                () => !!form.name || 'This field is required',
                            ]"
                            @keyup.enter="submit"
                            validate-on-blur
                        />
                        <v-text-field 
                            :disabled="options.disabled"
                            v-model="form.value"
                            label="Денежный эквивалент"
                            type="number"
                            required
                            color="primary"
                            :rules="[
                                () => !!form.value || 'This field is required',
                            ]"
                            @keyup.enter="submit"
                            validate-on-blur
                        />
                        <v-text-field 
                            :disabled="options.disabled"
                            v-model="form.percent"
                            label="Выделяемая доля"
                            type="number"
                            required
                            color="primary"
                            :rules="[
                                () => !!form.percent || 'This field is required',
                            ]"
                            @keyup.enter="submit"
                            validate-on-blur
                        />
                    </v-form>
                    <small>*Требуемые для заполнения поля</small>
                </v-card-text>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="inactive" flat @click.native="commit('HIDE_MODAL', { news: void 0 })">Не сохранять</v-btn>
                
                <v-btn dark class="default-action" flat @click.native="submit">Сохранить</v-btn>
            </v-card-actions>

        </v-card>

    </v-dialog>
</template>

<script>
    import components from './../hierarchy';

    export default {
        extends: components.Base,
        inheritAttrs: false,
        //props: ['options'],
        data() {
            return {
                //entity: 'news',
                options: {},
                defaults: {},
                form_data: {}
            }
        },
        async created() {
            //debugger;
            let response = await this.execute({ endpoint: 'news.defaults' });

            this.defaults = response.rest_data;
        },
        computed: {
            form() {
                //debugger;
                return this.form_data;
                //let aaa = this.state.modals['news'];
                //return this.state.modals['news'] && Object.keys(this.state.modals['news']).length ? { ...this.state.modals['news'] } : { ...this.default_values }
            }
        },
        methods: {
            submit() {
                //this.$refs.form.validate() && this.$store.actions.signin({ email: this.email, password: this.password });'
                //debugger;
                this.options.disabled || this.$refs.form.validate() ? 
                    this.execute({ 
                        method: this.options.disabled ? 'delete' : 'post', 
                        endpoint: 'news.save',
                        //payload: this.defaults, 
                        payload: this.form, 
                        callback: (response) => {
                            if(!response.error) {
                                this.commit('HIDE_MODAL', { news: void 0 })
                                this.options.disabled && this.$emit('remove', this.defaults._id);
                            }
                        }
                    })
                    :
                    this.commit('SHOW_SNACKBAR', {text: 'Не корректно введены данные' });
            }
        }
    }    
</script>