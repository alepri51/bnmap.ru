<template>
    <v-container text-xs-center mt-2>
        <v-layout>
        <v-flex>
            <h3 class="display-1 product-title mt-1"><span>ВСЕ</span><span class="secondary--text">Новостройки</span> московского региона</h3>
            <p class="mt-3">Самая полная и актуальная информационная платформа.</p>
        </v-flex>
        </v-layout>
        
        <v-layout
        row
        align-center
        justify-center
        class="white--text"
        >
            <v-card hover class="ma-4" :width="400">
                <v-card-text class="text-lg-center">
                    <v-icon style="font-size:72px" color="accent" class="shadow">fas fa-magic</v-icon>
                </v-card-text>

                <v-card-title primary-title >
                    <div>
                        <h3 class="headline mb-0 text-lg-center" >ПО НОВОМУ</h3>
                        <div>What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
                    </div>
                </v-card-title>

                <v-card-media
                    
                    src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                    height="200px"
                ></v-card-media>

            </v-card>

            <v-card hover class="ma-4" :width="400">
                <v-card-text class="text-lg-center">
                    <v-icon style="font-size:72px" color="primary" class="shadow">fas fa-filter</v-icon>
                </v-card-text>

                <v-card-title primary-title >
                    <div>
                        <h3 class="headline mb-0 text-lg-center" >ПО СТАРОМУ</h3>
                        <div>Why do we use it?
    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</div>
                    </div>
                </v-card-title>

                <v-card-media
                    
                    src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
                    height="200px"
                ></v-card-media>

            </v-card>
        </v-layout>
    </v-container>
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
