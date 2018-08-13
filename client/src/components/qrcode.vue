<template>
    <widget name="auth">
        <v-card>
            <v-layout column fill-height>
                <v-card-title>
                    <h2 class="widget-caption"><v-icon class="mr-1 primary--text">fas fa-qrcode</v-icon>ссылка для друзей:</h2>
                </v-card-title>
                <v-card-text>
                    <qrcode :value="`https://atlantclub.com/?ref=${this.auth.ref}`" :options="{ size: 100 }"></qrcode>
                    <div>
                        <v-btn color="primary" flat small :href="`http://localhost:8080/landing?ref=${this.auth.ref}`" target="_blank">
                            <v-icon small class="mr-1">fas fa-link</v-icon>Атлант.Клуб
                        </v-btn>
                    </div>
                    
                </v-card-text>
            </v-layout>
        </v-card>
    </widget>

</template>

<script>
    import Widget from './class_widget';
    import qrcode from '@xkeshi/vue-qrcode';
    
    //Vue.component(VueQrcode.name, VueQrcode);

    export default {
        extends: Widget,
        components: {
            qrcode
        },
        computed: {
        },
    }
</script>

<style scoped>
    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

