<template>
    <widget name="auth">
        <v-card>
            <h2 class="pa-2"><v-icon class="mr-2 shadow" color="primary">fas fa-user</v-icon>{{auth.name}}</h2>
            <div class="pa-2">
                <v-btn flat small><v-icon small class="mr-2" color="primary">fas fa-user-circle</v-icon>Настройки</v-btn>
                <v-btn flat small @click="commit('SHOW_DIALOG', { dialog: 'signout' })">Выход<v-icon small class="ml-2" color="primary">fas fa-sign-out-alt</v-icon></v-btn>
            </div>
        </v-card>
    </widget>

</template>

<script>
    export default {

    }
</script>

<style scoped>

</style>

