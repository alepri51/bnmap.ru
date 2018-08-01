<template>
    <widget name="auth">
        <v-card>
            <v-layout column fill-height>
            <v-card-title>
                <div>
                <h2 class="widget-caption"><v-icon class="mr-1 primary--text">fas fa-wallet</v-icon>Ваш счет:</h2>
                </div>
            </v-card-title>

            <v-divider/>

            <v-card-text style="flex: 1">
                <div class="subheading"><v-icon small class="mr-1 green--text">fas fa-dollar-sign</v-icon>Адрес: 0x02390ASDFA09089SDAW</div>
            </v-card-text>

            <v-card-actions>
                <v-btn dark color="red" @click="commit('SHOW_MODAL', { donate: void 0 })"><v-icon small class="mr-2" >fas fa-exclamation-circle</v-icon>Оплатить взнос</v-btn>
                <v-btn dark color="green"><v-icon  small class="mr-2" >fas fa-dollar-sign</v-icon>Пополнить баланс</v-btn>
                <v-spacer/>
                <v-btn dark flat color="primary" @click="false"><v-icon small class="mr-2" >fas fa-hand-holding-usd</v-icon>Вывод средств</v-btn>
            </v-card-actions>
            </v-layout>
        </v-card>
        <donate/>
    </widget>

</template>

<script>
    import Widget from './class_widget';
    
    export default {
        extends: Widget,
        components: {
            donate: () => import('./modals/donate')
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

