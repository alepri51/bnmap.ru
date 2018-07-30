<template>
    <v-dialog v-model="options.visible" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <v-icon class="mr-1 primary--text">fas fa-cloud</v-icon>
                <span class="headline primary--text">Моя мечта</span>
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
                    <small>*indicates required field</small>
                </v-card-text>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="inactive" flat @click.native="commit('HIDE_DIALOG', 'dream')">Не сохранять</v-btn>
                <v-btn dark class="default-action" flat @click.native="submit">Сохранить</v-btn>
            </v-card-actions>

        </v-card>

    </v-dialog>
</template>

<script>
    export default {
        inheritAttrs: false,
        props: ['options'],
        data() {
            return {
                _options: { ...this.options.defaults }
            }
        },
        created() {
            //debugger;
        },
        computed: {
            defaults() {
                return { ...this.options.defaults }
            }
        },
        methods: {
            submit() {
                //this.$refs.form.validate() && this.$store.actions.signin({ email: this.email, password: this.password });'
                //debugger;
                this.options.disabled || this.$refs.form.validate() ? 
                    this.execute({ 
                        method: this.options.disabled ? 'delete' : 'post', 
                        endpoint: 'dream.submit',
                        payload: this.defaults, 
                        callback: (response) => {
                            if(!response.error) {
                                this.commit('HIDE_DIALOG', 'dream');
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