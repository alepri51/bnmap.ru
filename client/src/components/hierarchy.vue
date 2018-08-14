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
                    :edges="filter.edges"
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
                    options: {
                        edges: {
                            arrows: {
                                to:     {enabled: true, scaleFactor: 0.5, type: 'arrow'},
                                from:   {enabled: true, scaleFactor: 0.5, type: 'circle'}
                            },
                            arrowStrikethrough: false,
                            smooth: {
                                type: 'discrete',
                                forceDirection: 'vertical',
                                //roundness: 0.1,
                            },
                            color: {
                                color:'#388E3C',
                                highlight:'#388E3C',
                                hover: '#388E3C',
                                inherit: 'both',
                                opacity:1.0
                            },
                            shadow:true,
                        },
                        layout: {
                            hierarchical: {
                                direction: 'UD',
                                sortMethod: 'directed'
                            }
                        },
                        physics:false,
                        nodes: {
                            shadow:true,
                            shape: 'icon', 
                            icon: {
                                face: 'FontAwesome',
                                code: '\uf007',
                                color: '#303F9F'
                            },
                            font: {
                                face: 'Roboto Condensed',
                                color: '#303F9F',
                                multi: 'html'
                            }
                        }
                    }
                }
            }
        },
        computed: {
            filter() {
                debugger;
                let reduce = (arr => {
                    return arr.reduce((memo, item) => {
                        memo.nodes.push({
                            id: item._id,
                            label: '<b>' + item.name + '</b>'
                        });

                        if(item.referals.length) {
                            item.referals.forEach(element => {
                                memo.edges.push({
                                    from: item._id,
                                    to: element._id
                                    
                                });
                            });

                            let reduced = reduce(item.referals);
                            memo.nodes = memo.nodes.concat(reduced.nodes);
                            memo.edges = memo.edges.concat(reduced.edges);
                        }

                        return memo;
                    }, { nodes: [], edges: []})
                });

                let data = reduce(this.raw_data);

                return data || {};
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

