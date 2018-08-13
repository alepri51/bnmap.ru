<template>
    <widget name="auth">
        <v-card>
            <v-layout column fill-height>
                <v-card-title>
                    <h2 class="widget-caption"><v-icon class="mr-1 primary--text">fas fa-sitemap</v-icon>Иерархия:</h2>
                </v-card-title>
                <v-card-text>
                    <v-expansion-panel inset class="elevation-1" expand>
                        <v-expansion-panel-content
                            v-for="(item, i) in filter"
                            :key="i"
                        >
                            <div slot="header">
                                <v-icon small color="primary">fas fa-user</v-icon>
                                {{item.name}} (email: {{item.email}})
                            </div>

                            <v-expansion-panel inset expand>
                                <v-expansion-panel-content
                                    v-for="(sref, j) in item.referals" :key="j"
                                >
                                    <div slot="header">
                                        <v-icon small color="primary">fas fa-user</v-icon>
                                        {{sref.name}} (email: {{sref.email}})
                                    </div>

                                </v-expansion-panel-content>

                            </v-expansion-panel>

                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    
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
            filter() {
                //debugger;
                return this.raw_data || {};
            }
        },
    }
</script>

<style scoped>
    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

