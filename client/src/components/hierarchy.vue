<template>
    <widget name="иерархия">
        <v-card>
            <v-layout column fill-height>
                <v-card-title>
                    <h2 class="widget-caption"><v-icon class="mr-1 primary--text">fas fa-sitemap</v-icon>Иерархия:</h2>
                </v-card-title>
                <network style="flex: 1" class="pa-3"
                    ref="network"
                    :nodes="filter.nodes"
                    :edges="network.edges"
                    :options="network.options"
                ></network>
                <!-- <v-card-text >
                    
                </v-card-text> -->
            </v-layout>
        </v-card>
    </widget>

</template>

<script>
    import Widget from './class_widget';
    import '../../public/css/font-awesome.min.css';

    import { Timeline, Graph2d, Network } from 'vue2vis';

    export default {
        extends: Widget,
        components: {
            network: Network
        },
        data()  {
            return {
                network: {
                    nodes: [
                        { id: 1, label: 'Node 1' },
                        { id: 2, label: 'Node 2' },
                        { id: 3, label: 'Node 3' },
                        { id: 4, label: 'Node 4' },
                        { id: 5, label: 'Node 5' },
                    ],
                    edges: [
                        { id: 1, from: 1, to: 3 },
                        { id: 2, from: 1, to: 2 },
                        { id: 3, from: 2, to: 4 },
                        { id: 4, from: 2, to: 5 },
                        { id: 5, from: 3, to: 3 },
                    ],
                    options: {
                        edges: {
                            smooth: {
                                type: 'cubicBezier',
                                forceDirection: 'vertical',
                                roundness: 0.4
                            }
                        },
                        layout: {
                            hierarchical: {
                                direction: 'UD'
                            }
                        },
                        physics:false,
                        nodes: {
                            shape: 'icon', 
                            icon: {
                                face: 'FontAwesome',
                                code: '\uf007',
                                color: '#303F9F'
                            } 
                            
                        },
                    },
                }
            }
        },
        computed: {
            filter() {
                debugger;
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

