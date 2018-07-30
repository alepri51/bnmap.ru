<template>
    <widget name="новости">
        <v-card width="100%">
            <v-card-title style="position: relative">
                <h2><v-icon color="primary" class="mr-2 shadow">fas fa-exclamation-circle</v-icon>Новости платформы:</h2>
                <v-btn
                    v-if="auth.member"
                    absolute
                    right
                    fab
                    dark
                    top
                    color="green"
                    @click="commit('SHOW_DIALOG', { dialog: 'dream', data: { percent: 50, name: 'hello' }})"
                >
                    <v-icon>fas fa-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider/>

            <v-card-text class="scrollable" id="scrollable">
                <v-card class="ma-2" @mouseover="onHover(data._id)" @mouseout="value[data._id] = false" hover v-scroll:#scrollable="onScroll"
                    v-for="(data, key, inx) in entities.dream"
                    :key="data._id"
                    :width="300"
                    :height="200"
                    
                >
                    <v-card-media
                        :src="(inx % 2 === 0) ? 'https://cdn.vuetifyjs.com/images/cards/desert.jpg' : 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'"
                        
                        height="200px"
                    >
                        <!-- INDEX: {{inx}} -->
                    </v-card-media>
                    <v-card-title class="primary--text">
                        <h3>{{data.name}}</h3>
                    </v-card-title>

                    <v-card-text>
                        {{data.value}}
                    </v-card-text>
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
                            @click="edit(data)"
                        >
                            <v-icon>fas fa-pen</v-icon>
                        </v-btn>
                        <v-btn
                            fab
                            dark
                            small
                            color="red darken-2"
                            @click.native="remove(data)"
                        >
                            <v-icon>fas fa-times</v-icon>
                        </v-btn>
                    </v-speed-dial>
                    
                </v-card>
            </v-card-text> 

            <dream :options="Object.assign({}, dialogs.dream)" @remove="onRemove"/>
        </v-card>
    </widget>
    
         
</template>

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
        overflow: auto; 
        position: relative; 
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>

<script>
    export default {
        components: {
            dream: () => import('./modals/dream')
        },
        created() {
            //debugger;
        },
        mounted() {
            //debugger;
        },
        activated() {
            var container = this.$el.querySelector("#scrollable");
            container && (container.scrollTop = this.inc);
            console.log(this.auth);
        },
        methods: {
            edit(dream) {
                 this.commit('SHOW_DIALOG', { dialog: 'dream', data: { ...dream }})
            },
            remove(dream) {
                 this.commit('SHOW_DIALOG', { dialog: 'dream', data: { disabled: true, ...dream }});
            },
            onRemove(id) {
                //debugger;
                delete this.entities.dream[id];
            },
            onScroll(e) {
                this.inc = e.target.scrollTop;
                //console.log('SCROLL', e.target.scrollTop);
            },
            onHover(id) {
                //debugger;
                this.value[id] = true;
                this.active = id;
                //console.log(JSON.stringify(this.value, null, '\t'));
            },
            chart_title(title, subtitle, percent) {
                let title_config = {...this.gauge.title};
                title_config.text = title + ' (' + percent + '%)';
                title_config.subtitle = {...this.gauge.title.subtitle};
                title_config.subtitle.text = subtitle + '$';

                return title_config;
            }
        },
        data() {
            return {
                inc: 0,

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



