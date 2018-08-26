<template>
    <widget name="содержание">
        <v-card>
            <v-card-title>
                <h2 class="widget-caption"><v-icon color="primary" class="mr-2 shadow">far fa-list-alt</v-icon>Содержание:</h2>
            </v-card-title>
            <v-divider/>
            <tree :model="filter" :selection="selection" @selected="false" field="sections" :storage="entities.section" :controls="true" class="ma-2"/>
        </v-card>
    </widget>
</template>

<script>
    import Widget from './class_widget';

    import tree from "./tree";

    export default {
        extends: Widget,
        components: {
            //network: Network
            tree
        },
        data: () => ({
            selection: {},
            entity: 'section'
        }),
        computed: {
            filter() {
                debugger
                //let model = this.raw_data.filter(member => member._id === this.auth.member)[0] || {};
                
                return this.raw_data.length ? this.raw_data[0] : {};
            }
        },
    }
</script>

<style>

    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

