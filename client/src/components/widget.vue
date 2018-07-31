<template>
    <div v-if="signed_id" class="widget">
        <slot/>
        <div style="position: absolute; bottom: 4px; right: 8px; font-size: 10px" class="grey--text">{{name}}</div>
    </div>
    <v-card v-else class="restriction">
        <v-layout column justify-center align-center>
            <h2 class="pa-2"><v-icon class="mr-2 shadow" color="red darken-2">fas fa-minus-circle</v-icon>ДОСТУП ОГРАНИЧЕН</h2>
        </v-layout>
    </v-card>
</template>

<script>
    export default {
        props: {
            condition: {
                //default: this.state.signed_id
                //type: Boolean,
                /* default: function () {
                    console.log('ASAS', this.$store.state.auth)
                    let condition = !!(this.$store.state.auth && this.$store.state.auth.member);
                    return condition;
                },
                validator: function (value) {
                    // Значение должно соответствовать одной из этих строк
                    console.log('VALIDATOR', value);
                    this.condition = value;
                    return true;
                } */
            },
            name: {}
        },
        computed: {
            signed_id() {
                return typeof this.condition !== 'undefined' ? this.condition : this.state.signed_id;
                //return typeof this.condition !== 'undefined' ? this.condition : !!(this.auth && this.auth.member);
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

    .restriction {
        display: flex!important;
        flex-direction: column;
    }
</style>

