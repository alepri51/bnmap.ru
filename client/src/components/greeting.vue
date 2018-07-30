<template>
  <v-parallax :src="require('../assets/150289557589.jpg')">
    <v-layout
      column
      align-center
      justify-center
      class="white--text"
    >
      <div class="subheading mb-1 hero-text-sub text-xs-center">Жизнь | Квартира | Счастье</div>
      <p class="white--text hero-text-header mb-2 display-2 text-xs-center">Купи квартиру - стань счастливым!</p>
      <div class="subheading mb-3 hero-text-sub text-xs-center">Узнайте как <span>ВСЕ</span><span class="secondary--text">Новостройки</span> помогают выбрать квартиру</div>
      <v-btn class="mt-3 green darken-1 accented-text" dark @click="commit('SHOW_DIALOG', { dialog: 'signup' })">НАЙТИ МНЕ КВАРТИРУ</v-btn>
      <div class="mt-2">ИЛИ</div>
      <v-btn class="mt-3 green darken-1 accented-text" dark @click="commit('SHOW_DIALOG', { dialog: 'signup' })">Я САМ СПРАВЛЮСЬ</v-btn>
    </v-layout>
    
  </v-parallax>
</template>

<script>
    export default {
        data() {
            return {
                search_string: ''
            }
        },
        methods: {
            search() {
                console.log(this.search_string);
                this.search_string = this.search_string || 'Москва';
                this.commit('SHOW_SNACKBAR', {text: this.search_string});
                this.search_string = '';
            }
        }
    }
</script>


<style>
/* .hero-text-header {
  font-family: 'Zilla Slab', serif;
}
.hero-text-sub {
  font-family: 'Raleway', sans-serif;
}
.brand-text {
  font-weight: bold;
} */
</style>
