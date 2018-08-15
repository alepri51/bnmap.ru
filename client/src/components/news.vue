<template>
    <widget name="новости">
        <v-card width="100%">
            <v-card-title style="position: relative">
                <h2><v-icon color="primary" class="mr-2 shadow">fas fa-exclamation-circle</v-icon>Новости платформы:</h2>
                <v-btn
                    absolute
                    right
                    fab
                    
                    dark
                    bottom
                    color="green"
                    @click="commit('SHOW_MODAL', { news: void 0 })"
                >
                    <v-icon>fas fa-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider/>

            <v-card-text class="scrollable" id="scrollable">
                <v-card 
                    v-for="(data, inx) in filter"
                    :key="data._id"

                    class="ma-2" 
                    @mouseover="onHover(data._id)" 
                    @mouseout="value[data._id] = false" 
                    hover 
                    v-scroll:#scrollable="onScroll"
                    :width="300"
                    
                    
                >
                    <v-layout column>
                        <v-card-media
                            :src="data.media || (inx % 3 === 0) ? 'https://cdn.vuetifyjs.com/images/cards/desert.jpg' : 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'"
                            height="100px"
                        >
                        </v-card-media>

                        <v-card-title class="primary--text pb-1" >
                            <h3 style="flex: 1; max-height: 160px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{data.caption}}</h3>
                        </v-card-title>

                        <v-card-text style="flex: 1; max-height: 160px; overflow: hidden;">
                            {{data.text}}
                        </v-card-text>

                        <v-spacer/>
                        <div class="pl-2 pt-3 pr-2">
                            <v-icon small class="mr-1 accent--text">fas fa-tags</v-icon>
                            <small v-for="(tag, inx) in data.tags" :key="inx">{{tag}}{{ inx === data.tags.length - 1 ? '' : ', '}}</small>
                        </div>
             

                        <v-card-actions>
                            <small>
                                {{ new Date(data.date).toLocaleString() }}
                            </small>

                            <v-spacer></v-spacer>
                            <v-btn flat color="secondary">Смотреть</v-btn>
                        </v-card-actions>
                    </v-layout>

                    <v-speed-dial 
                        absolute
                        v-model="fab[data._id]"
                        
                        :bottom="bottom"
                        :right="right"
                        :left="left"
                        :direction="direction"
                        :open-on-hover="hover"
                        :transition="transition"
                        v-show="data._id === active"
                    >
                        <v-btn
                            slot="activator"
                            v-model="fab[data._id]"
                            :style="fab[data._id] ? 'background-color: rgb(48, 63, 159)' : 'background-color: rgb(96, 125, 139, 0.5)'"
                            dark
                            fab
                            small
                            
                        >
                            <v-icon>fas fa-chevron-down</v-icon>
                            <v-icon>fas fa-chevron-up</v-icon>
                        </v-btn>
                        <v-btn
                            fab
                            dark
                            small
                            color="green darken-2"
                            @click="commit('SHOW_MODAL', { news: data })"
                        >
                            <v-icon>fas fa-pen</v-icon>
                        </v-btn>
                        <v-btn
                            fab
                            dark
                            small
                            color="red darken-2"
                            @click.native="commit('SHOW_MODAL', { news: data, options: { remove: true }})"
                        >
                            <v-icon>fas fa-times</v-icon>
                        </v-btn>
                    </v-speed-dial>
                    
                </v-card>
            </v-card-text> 

            <!-- <news v-on="$listeners"/> не работает-->
            
        </v-card>
        <news @removed="removed" @appended="appended"/>
    </widget>
    
         
</template>

<script>
    import Widget from './class_widget';

    export default {
        extends: Widget,
        components: {
            news: () => import('./modals/news')
        },
        activated() {
            let container = this.$el.querySelector("#scrollable");
            container && (container.scrollTop = this.scroll_position);
        },
        computed: {
            filter() {
                //debugger;
                return this.raw_data;
            }
        },
        filters: {
            mine(value) {
                return value;
            }
        },
        methods: {
            onRemove(id) { ///////////////////////////
                delete this.entities.news[id];
            },
            onScroll(e) {
                this.scroll_position = e.target.scrollTop;
            },
            onHover(id) {
                this.value[id] = true;
                this.active = id;
            },
            chart_title(title, subtitle, percent) {
                let title_config = {...this.gauge.title};
                title_config.text = title + ' (' + percent + '%)';
                title_config.subtitle = {...this.gauge.title.subtitle};
                title_config.subtitle.text = subtitle + '$';

                return title_config;
            }
        },
        watch: {
            //'fab': (val) => console.log('SHOW:', val)
        },
        data() {
            return {
                texts: {},

                scroll_position: 0,

                active: false,
                value: {},
                direction: 'bottom',
                fab: {},
                hover: true,
                tabs: null,
                top: true,
                right: true,
                bottom: false,
                left: false,
                transition: 'slide-y-reverse-transition',
                
                gauge: {
                    size: {
                        height: 200
                    },
                    title: {
                        font: {
                            family: 'Roboto Condensed'
                        },
                        horizontalAlignment: 'left',
                        //verticalAlignment: 'bottom',
                        margin: {
                            left: 55
                        },
                        text: 'Купить квартиру',
                        subtitle: {
                            font: {
                                family: 'Roboto Condensed'
                            },
                            text: '1000$'
                        }
                    },
                    scale: {
                        startValue: 0,
                        endValue: 100,
                        tickInterval: 10,
                        minorTickInterval: 5,
                        minorTick: {
                            visible: true
                        },
                        orientation: 'inside',
                        label: {
                            useRangeColors: true,
                            format: {
                                type: 'decimal',
                                precision: 0
                            },
                            customizeText: function (arg) {
                                return (arg.value === arg.min || arg.value === arg.max) ? arg.valueText + '%' : arg.valueText;
                            }
                        }
                    },
                    rangeContainer: {
                        //offset: 10,
                        ranges: [
                            { startValue: 0, endValue: 20, color: this.$colors.red.darken2 },
                            { startValue: 20, endValue: 70, color: this.$colors.yellow.darken2 },
                            { startValue: 70, endValue: 100, color: this.$colors.green.darken2 }
                        ]
                    },
                    value: 70,
                    subvalues: [70, 50],
                    valueIndicator: {
                        offset: 10,
                        palette: 'Material',
                        color: this.$colors.green.darken2,
                    },
                    subvalueIndicator: {
                        offset: -25,
                        type: 'textCloud',
                        text: {
                            font: {
                                family: 'Roboto Condensed'
                            },
                            format: {
                                precision: 0
                                
                            },
                            customizeText: (obj) => obj.valueText + ' %'
                        },
                        palette: 'Material'
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .v-speed-dial {
        margin-top: 16px;
        padding-bottom: 6px;
        /* margin-right: 16px; */
    }

    .v-card {
        display: flex;
        flex-direction: column;
    }

    .scrollable {
        overflow-y: auto; 
        position: relative; 
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    /* .v-btn--top.v-btn--absolute {
        top: 16px;
    } */
</style>