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
                        <v-file-upload 
                            :disabled="options.remove"
                            label="Картинка" 
                            class="mb-4" 
                            :value="form.picture" 
                            @input="form.picture = arguments[0]" 
                            @form-data="form.blob = arguments[0]"
                            @clear="form.picture = ''"
                        />
                        <v-text-field 
                            autofocus
                            :disabled="options.remove"
                            v-model="form.title"
                            label="Заголовок"
                            hint="Например: Нас уже полмиллиона!"
                            required
                            color="primary"
                            :rules="[
                                () => !!form.title || 'This field is required',
                            ]"
                            @keyup.enter="submit"
                            validate-on-blur
                        />
                        <v-textarea 
                            :disabled="options.remove"
                            v-model="form.text"
                            label="Текст"
                            required
                            color="primary"
                            :rules="[
                                () => !!form.text || 'This field is required',
                            ]"
                            validate-on-blur
                        />
                        <v-combobox
                            :disabled="options.remove"
                            v-model="form.tags"
                            label="Новостные тэги"
                            chips
                            clearable
                            multiple
                            
                        >
                            <template slot="selection" slot-scope="data">
                                <v-chip small
                                    :selected="data.selected"
                                    close
                                    @input="form.tags.splice(form.tags.indexOf(data.item), 1)"
                                    class="accent white--text"
                                >
                                    <span>{{ data.item }}</span>
                                </v-chip>
                            </template>
                        </v-combobox>
                        <!-- <v-text-field 
                            :disabled="options.remove"
                            v-model="form.tags"
                            label="Тэги"
                            required
                            color="primary"
                            :rules="[
                                () => !!form.tags || 'This field is required',
                            ]"
                            @keyup.enter="submit"
                            validate-on-blur
                        /> -->
                    </v-form>
                    <small>*Требуемые для заполнения поля</small>
                </v-card-text>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="inactive" flat @click.native="commit('HIDE_MODAL', { news: void 0 })">{{ options.remove ? 'Не удалять' : 'Не сохранять'}}</v-btn>
                
                <v-btn dark :class="options.remove ? 'red darken-2' : 'green darken-2'" flat @click.native="submit">{{ options.remove ? 'Удалить' : 'Cохранить'}}</v-btn>
            </v-card-actions>

        </v-card>

    </v-dialog>
</template>

<script>
    import Modal from '../class_modal';
    import vFileUpload from '../v-file-upload';
    
    export default {
        extends: Modal,
        inheritAttrs: false,
        components: {
            vFileUpload
        },
        //props: ['options'],
        /* data() {
            return {
                //entity: 'news',
                options: {},
                defaults: {}
            }
        }, */
        
        computed: {
        },
        methods: {
            
        },
    }    
</script>