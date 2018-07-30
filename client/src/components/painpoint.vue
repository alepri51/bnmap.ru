<template>
  <v-container text-xs-center mt-2>
    <v-layout>
      <v-flex>
        <h3 class="display-1 product-title mt-1"><span>ATLANT</span><span class="secondary--text">Club</span> - платформа взаимопомощи</h3>
        <p class="mt-3">ISLAND Civil's Earthworks platform makes it easy to maintain a database of all your subsurface data.</p>
      </v-flex>
    </v-layout>
    <v-divider/>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg5 offset-md1>
        <h3 class="display-1 product-title text-xs-center mt-3">Earthworks Features</h3>
        <p class="mt-5 demo-text primary--text"><v-icon left class="blue--text text--darken-2 demo-icon">thumb_up</v-icon> Easy to use</p>
        <p>We know it's tough to get people trained on new software, so we made sure the Earthworks line of products are intuitive and easy to use.</p>

        <p class="mt-5 demo-text primary--text"><v-icon left class="blue--text text--darken-2 demo-icon">build</v-icon> Tailored for you</p>
        <p>Every organization is different. We'll work with you to make sure you get a product that meets your needs. If something is missing, we'll build it!</p>

        <p class="mt-5 demo-text primary--text"><v-icon left class="blue--text text--darken-2 demo-icon">trending_up</v-icon> Makes you look good</p>
        <p>Earthworks products help you deliver more professional borehole logs and lab reports.</p><p>Input is checked against standard classifications (USCS) and your own guidelines to ensure a consistent style.</p>

        <v-divider class="hidden-sm-and-up"></v-divider>
      </v-flex>
      <v-flex xs12 sm6 md5 lg4 offset-md1 offset-lg2 xl3>
        <v-card class="blue" dark>
          <v-card-text>
            <v-card>
            <v-card-media :src="require('../assets/bhmap.png')" height=300></v-card-media>
            </v-card>
            </v-card-text>
            <v-card-title primary class="demo-title white--text"><v-icon x-large>pin_drop</v-icon>Visualize</v-card-title>
            <v-card-text class="demo-text">
            <p>All assets with a location are mapped. It's easy to see where your data is.</p>
            <p>Explore the map to see what's near an area of interest, or get a list of results by searching.</p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout>
      <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
        <v-container>
          <h3 class="display-1 mt-3 product-title">IT and Web Services</h3>
          <p class="mt-3 product-text">ISLAND Civil has a unique mix of technology, software and engineering experience.</p>
          <p class="product-text">Let us design and maintain your organization's web presence, a custom project portal, or work with your IT staff to create database and file server solutions that are tailored for engineers. Contact us for more information!</p>
        </v-container>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 offset-md2>
        <v-icon x-large class="info--text mt-2">cloud_queue</v-icon>
        <h3 class="display-1 product-title mt-3">Earthworks <span class="blue--text text--darken-2">Server</span></h3>
        <p class="mt-3">Earthworks Server is a powerful database server that helps your engineers and technical staff organize project data.</p>
        <p>Choose to either deploy on-site on your local network or host on a cloud provider to provide your engineers with 24/7 global access.</p>
        <v-divider class="hidden-sm-and-up mb-4"></v-divider>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-icon x-large class="info--text mt-2">desktop_windows</v-icon>
        <h3  class="display-1 product-title mt-3">Earthworks <span class="blue--text text--darken-2">Desktop</span></h3>
        <p class="mt-3">Earthworks Desktop is a standalone desktop solution that streamlines project management and laboratory testing.</p>
        <p>Suitable for working on either a local computer or an Earthworks Server.</p>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap class="footer-text">
      <v-flex xs12 sm6 md3 offset-md3 class="stacking">
        <p><a href="#earthworks">Products</a></p>
      </v-flex>
      <v-flex xs12 sm6 md3>
        <p><a href="mailto:steve@islandcivil.com">Contact us</a></p>
      </v-flex>
      <v-flex xs12><p>&copy; 2018 Island Civil Solutions</p></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>
</style>
