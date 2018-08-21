<template>
    <widget name="новости">
        <v-card >
            <v-card-title style="position: relative">
                <h2><v-icon color="primary" class="mr-2 shadow">fas fa-exclamation-circle</v-icon>Новости платформы:</h2>
                <v-btn v-if="auth.group === 'admins'"
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

            <scrollable :items="filter" xs12 sm12 md8 lg6 :pagitation="{
                    rowsPerPage: -1,
                    sortBy: 'date',
                    descending: true
                }">
                <v-card 
                    slot-scope="props"
                    @mouseover="onHover(props.item._id)" 
                    @mouseout="value[props.item._id] = false" 
                    hover 
                    :height="200"
                    style="min-width: 300px;"
                >

                    <div style="display: flex; height: 100%">
                        <v-flex xs5 class="pa-0">
                            <v-card-media
                                height="100%"  
                            >
                                <youtube video-id="XEzx09lIj_0" :player-width="100"></youtube>
                            </v-card-media>
                            <!-- <v-card-media
                                :src="props.item.media || (props.item._id % 3 === 0) ? 'https://cdn.vuetifyjs.com/images/cards/desert.jpg' : 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'"
                                height="100%"  
                            /> -->
                        </v-flex>
                        <v-flex xs7 >
                            <v-layout column d-flex fill-height style="height: 114%">
                                <v-card-title class="primary--text pb-1" >
                                    <h3 style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{props.item.caption}}</h3>
                                </v-card-title>

                                <v-card-text style="overflow: hidden;">
                                    {{props.item.text}}
                                </v-card-text>

                                <div class="pl-2 pt-3 pr-2">
                                    <v-icon small class="mr-1 accent--text">fas fa-tags</v-icon>
                                    <small v-for="(tag, inx) in props.item.tags" :key="inx">{{tag}}{{ inx === props.item.tags.length - 1 ? '' : ', '}}</small>
                                </div>

                                <!-- <v-spacer/> -->

                                <v-card-actions>
                                    <small>
                                        {{ new Date(props.item.date).toLocaleString() }}
                                    </small>

                                    <v-spacer></v-spacer>
                                    <v-btn flat color="secondary">Смотреть</v-btn>
                                </v-card-actions>
                            </v-layout>
                        </v-flex>
                    </div>

                    <v-speed-dial v-if="auth.group === 'admins'"
                        absolute
                        v-model="fab[props.item._id]"
                        
                        :bottom="bottom"
                        :right="right"
                        :left="left"
                        :direction="direction"
                        :open-on-hover="hover"
                        :transition="transition"
                        v-show="props.item._id === active"
                    >
                        <v-btn
                            slot="activator"
                            v-model="fab[props.item._id]"
                            :style="fab[props.item._id] ? 'background-color: rgb(48, 63, 159)' : 'background-color: rgb(96, 125, 139, 0.5)'"
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
                            @click="commit('SHOW_MODAL', { news: props.item })"
                        >
                            <v-icon>fas fa-pen</v-icon>
                        </v-btn>
                        <v-btn
                            fab
                            dark
                            small
                            color="red darken-2"
                            @click.native="commit('SHOW_MODAL', { news: props.item, options: { remove: true }})"
                        >
                            <v-icon>fas fa-times</v-icon>
                        </v-btn>
                    </v-speed-dial>
                    
                </v-card>
            </scrollable>

            <!--  -->   
        </v-card>
        <news @removed="removed" @appended="appended"/>
    </widget>        
</template>

<script>
    import Widget from './class_widget';
    import scrollable from './scrollable';
    
    import Vue from 'vue'
    import VueYoutube from 'vue-youtube'

    Vue.use(VueYoutube);

    export default {
        extends: Widget,
        components: {
            news: () => import('./modals/news'),
            scrollable,
            //youtube
        },
        activated() {
            let container = this.$el.querySelector("#scrollable");
            container && (container.scrollTop = this.scroll_position);
        },
        computed: {
            filter() {
                //debugger;
                return this.raw_data.sort((a, b) => b.date - a.date);
            }
        },
        filters: {
            mine(value) {
                return value;
            }
        },
        methods: {
            appended(_id) {
                debugger;
                //prevent scrolling down by default as in class_widget
                //let container = this.$el.querySelector("#scrollable");
                //container && (container.scrollTop = container.scrollHeight);
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
                pagination: {
                    rowsPerPage: -1
                },

                texts: {},

                scroll_position: 0,

                active: false,
                value: {},
                direction: 'bottom',
                fab: {},
                hover: true,
                tabs: null,
                top: true,
                right: false,
                bottom: false,
                left: true,
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