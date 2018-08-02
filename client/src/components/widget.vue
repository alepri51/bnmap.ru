<template>
    <div class="widget">
        <div class="slot">
            <slot/>
        </div>
        <div style="position: absolute; bottom: 6px; right: 10px; font-size: 10px" class="grey--text">{{name}}</div>
    </div>
    <!-- <v-card v-else class="restriction">
        <v-layout column justify-center align-center>
            <h2 class="pa-2"><v-icon class="mr-2 shadow" color="red darken-2">fas fa-minus-circle</v-icon>ДОСТУП ОГРАНИЧЕН</h2>
        </v-layout>
    </v-card> -->
</template>

<script>
    import Base from './class_base';

    export default {
        props: ['name'],
        extends: Base,
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
        overflow: auto;
    }

    .slot {
        padding: 2px;        
    }
    .widget div:first-child {
        height: 100%;
    }

    .restriction {
        display: flex!important;
        flex-direction: column;
    }

</style>

