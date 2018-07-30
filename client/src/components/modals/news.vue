<template>
    <v-dialog v-model="visible_modal" persistent max-width="500px">
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
                            v-model="defaults.name"
                            label="О чем вы мечтаете"
                            hint="Например: хочу дом на берегу атлантического океана"
                            required
                            autofocus
                            color="primary"
                            :rules="[
                                () => !!defaults.name || 'This field is required',
                            ]"
                            @keyup.enter="submit"
                        />
                        <v-text-field 
                            :disabled="options.disabled"
                            v-model="defaults.value"
                            label="Денежный эквивалент"
                            required
                            color="primary"
                            :rules="[
                                () => !!defaults.value || 'This field is required',
                            ]"
                            @keyup.enter="submit"
                        />
                        <v-text-field 
                            :disabled="options.disabled"
                            v-model="defaults.percent"
                            label="Выделяемая доля"
                            required
                            color="primary"
                            :rules="[
                                () => !!defaults.percent || 'This field is required',
                            ]"
                            @keyup.enter="submit"
                        />
                    </v-form>
                    <small>*Требуемые для заполнения поля</small>
                </v-card-text>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="inactive" flat @click.native="commit('HIDE_MODAL', { news: void 0 })">Не сохранять</v-btn>
                <!-- <v-btn color="inactive" flat @click.native="commit('HIDE_DIALOG', 'news')">Не сохранять</v-btn> -->
                <v-btn dark class="default-action" flat @click.native="submit">Сохранить</v-btn>
            </v-card-actions>

        </v-card>

    </v-dialog>
</template>

<script>
    export default {
        inheritAttrs: false,
        //props: ['options'],
        data() {
            return {
                options: {},
                default_values: {}
            }
        },
        async created() {
            debugger;
            let response = await this.execute({ endpoint: 'news.defaults' });
            let { token, auth, cached, ...defaults } = response.data;
            this.$set(this.$data, 'default_values', defaults);
        },
        computed: {
            defaults() {
                let aaa = this.state.modals['news'];
                return Object.keys(this.state.modals['news']).length ? { ...this.state.modals['news'] } : { ...this.default_values }
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
                        payload: this.defaults, 
                        callback: (response) => {
                            if(!response.error) {
                                this.commit('HIDE_DIALOG', 'news');
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