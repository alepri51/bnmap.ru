<template>
    <widget name="список">
        <v-card>
            <v-card-title>
                <h2 class="widget-caption"><v-icon color="primary" class="mr-2 shadow">fas fa-list-alt</v-icon>Ваш список:</h2>
            </v-card-title>
            <v-card-text>
                <div v-for="(item, inx) in filter" :key="inx">
                    <div class="mb-1">
                        <v-icon small color="primary" class="mr-1">fas fa-user</v-icon>
                        {{inx + 1}}. {{item.name}} - {{item.ref}}
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </widget>
</template>

<script>
    import Widget from './class_widget';

    export default {
        extends: Widget,
        data: () => ({
            
            
        }),
        computed: {
            filter() {
                return this.raw_data.sort((a, b) => a._rel.номер - b._rel.номер);
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

