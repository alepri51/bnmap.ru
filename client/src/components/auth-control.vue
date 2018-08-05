<template>
    <widget name="auth">
        <v-card>
            <v-layout column fill-height justify-space-between>
            <v-card-title>
                
                <h2 class="widget-caption"><v-icon class="mr-1 primary--text">fas fa-user</v-icon>{{auth.name}}</h2>
            </v-card-title>

            <small class="ml-3">{{$store.state.auth_state === 'EXPIRED' ? 'СЕССИЯ ПРОСРОЧЕНА' : 'ВХОД ПРОИЗВЕДЕН'}}</small>
            
            <v-card-text>
                <div class="widget-caption"><v-icon small class="mr-1 green--text">fas fa-dollar-sign</v-icon>Баланс: 0 USD</div>
            </v-card-text>

            <v-card-actions>
                <v-btn flat small><v-icon small class="mr-2" color="primary">fas fa-user-circle</v-icon>Настройки</v-btn>
                <v-btn flat small @click="commit('SHOW_MODAL', { signout: void 0 })">Выход<v-icon small class="ml-2" color="primary">fas fa-sign-out-alt</v-icon></v-btn>
            </v-card-actions>
            </v-layout>
        </v-card>
    </widget>

</template>

<script>
    import Widget from './class_widget';
    
    export default {
        extends: Widget
    }
</script>

<style scoped>
    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

