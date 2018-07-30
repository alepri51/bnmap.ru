<template>
  <v-toolbar app class="white" :scroll-threshold="500" scroll-off-screen fixed>
    <v-icon large class="primary--text">fab fa-galactic-senate</v-icon>
        
    <v-toolbar-title class="toolbar-title">
      <span>ATLANT</span>
      <span class="secondary--text">Club</span>
    </v-toolbar-title>

    <v-tabs v-if="$store.state.auth"
        class="ml-2"
        v-model="active"
        slider-color="secondary"
    >
      <v-tab
        class="primary--text"
        v-for="item in menu"
        :key="item.to"
        ripple
        :to="item.to"
      >
        {{ item.name }}

      </v-tab>
    </v-tabs>

    <v-spacer/>

    <v-toolbar-items v-if="!$store.state.auth">
        <v-btn flat @click="commit('SHOW_DIALOG', { dialog: 'signup' })" color="primary">
            <v-icon small class="mr-1">fas fa-user-plus</v-icon>Регистрация
        </v-btn>

        <v-btn flat @click="commit('SHOW_DIALOG', { dialog: 'signin' })" color="primary">
            <v-icon small class="mr-1">fas fa-sign-in-alt</v-icon>вход
        </v-btn>
    </v-toolbar-items>

    <v-toolbar-items v-if="$store.state.auth">
        <v-btn flat replace to="account"  color="primary" >
            <v-icon small class="mr-1">fas fa-user-circle</v-icon>{{$store.state.auth.name}}
        </v-btn>

        <v-btn flat @click="commit('SHOW_DIALOG', { dialog: 'signout' })" color="primary">
            Выход<v-icon small class="ml-1">fas fa-sign-out-alt</v-icon>
        </v-btn>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
    export default {
        props: ['menu'],
        data() {
            return {
                active: void 0,
                actions: []
            }
        },
        created() {
            this.actions
        },
        methods: {
/*             call(action) {
                this[action]();
            }
 */        }
    }
</script>

<style scoped>
    .toolbar-title {
        overflow: unset;
    }
</style>
