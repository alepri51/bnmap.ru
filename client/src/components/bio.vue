<template>
  <div class="widget">
      <v-card>
            <v-card-text style="overflow: auto" >
                <v-layout column>
                    <h2><v-icon color="primary" class="mr-2">fas fa-user-circle</v-icon>{{auth.name}}</h2>
                    <div class="mt-2"><v-icon small color="secondary" class="mr-1">fas fa-at</v-icon>{{auth.email || 'e-mail'}}</div>
                </v-layout>
            </v-card-text>
      </v-card>
      <div style="position: absolute; bottom: 4px; right: 8px; font-size: 10px" class="grey--text">bio</div>
  </div>
</template>

<script>
    export default {
        computed: {
        }
    }
</script>

<style scoped>
    .widget {
        width: 100%;
    }

    .widget div:first-child {
        height: 100%;
    }
</style>

