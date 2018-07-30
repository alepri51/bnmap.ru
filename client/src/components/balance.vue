<template>
  <div class="widget">
      <v-card>
            <v-card-text style="overflow: auto">
                <h2><v-icon color="primary" class="mr-2">fas fa-dollar-sign</v-icon>Ваш баланс:</h2>
                <v-layout wrap v-if="entities.member && Object.keys(balance).length">
                    <v-flex class="" v-for="(sum, key) in balance" :key="key" >
                        <v-icon small class="mr-1" color="green darken-2">fas fa-money-bill-alt</v-icon>
                        {{sum}} {{key}}
                    </v-flex>
                </v-layout>
                <v-layout wrap v-else>по нолям</v-layout>            
            </v-card-text>
      </v-card>
      <div style="position: absolute; bottom: 4px; right: 8px; font-size: 10px" class="grey--text">баланс</div>
  </div>
</template>

<script>
    export default {
        computed: {
            balance() {
                //debugger;
                return this.auth.member ? this.entities.member[this.auth.member].balance : {}
            }
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

