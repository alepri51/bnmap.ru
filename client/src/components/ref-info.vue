<template>
    <widget name="реферал" :style="Object.keys(active).length ? 'display:inline-block' : 'display:none'">
        <v-card >
            <v-layout column fill-height >
                <v-card-title>
                    
                    <h2 class="widget-caption"><v-icon class="mr-1 primary--text">fas fa-user</v-icon><span v-html="active.name"></span></h2>
                </v-card-title>
                <v-card-text>
                    <div>email: <b class="accent--text">{{active.email}}</b></div>
                    <div>Реферальный код: <b class="accent--text">{{active.ref}}</b></div>
                </v-card-text>
            
            </v-layout>
        </v-card>
    </widget>

</template>

<script>
    import Widget from './class_widget';
    
    export default {
        extends: Widget,
        computed: {
            active() {
                return this.state.common_data.active_referal || {};
            }
        }
    }
</script>

<style scoped>
    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

