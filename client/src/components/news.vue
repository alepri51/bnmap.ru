<template>
    <widget name="новости">
        <v-card >
            <v-card-title style="position: relative">
                <h2><v-icon color="primary" class="mr-2 shadow">fas fa-exclamation-circle</v-icon>Новости платформы:</h2>

                <v-speed-dial class="top-dial" 
                    v-if="auth.group === 'admins'"
                    absolute
                    v-model="append"
                    
                    bottom
                    right

                    direction="bottom"
                    :open-on-hover="true"

                    :transition="transition"
                >
                    <v-btn
                        slot="activator"
                        v-model="append"
                        

                        dark
                        fab
                        color="green darken-2"
                    >
                        <v-icon>fas fa-plus</v-icon>
                        <v-icon>fas fa-times</v-icon>
                    </v-btn>
                    <v-btn
                        fab
                        dark
                        small
                        color="green darken-2"
                        @click="commit('SHOW_MODAL', { news: void 0 })"
                    >
                        <v-tooltip left>
                            <v-icon slot="activator">far fa-newspaper</v-icon>
                            <span>Добавить новость</span>
                        </v-tooltip>
                    </v-btn>
                    <v-btn
                        fab
                        dark
                        small
                        color="green darken-2"
                        @click="commit('SHOW_MODAL', { news: void 0 })"
                    >
                        <v-tooltip left>
                            <v-icon slot="activator">far fa-calendar-alt</v-icon>
                            <span>Добавить событие</span>
                        </v-tooltip>
                    </v-btn>
                </v-speed-dial>

            </v-card-title>
            <v-divider/>

            <scrollable :items="filter" xs12 sm6 md6 lg4 sort="date" :descending="true">
                
                <v-subheader slot="header" slot-scope="{ index }" v-if="date && ($vuetify.breakpoint.lgAndUp ? index < 3 : $vuetify.breakpoint.smAndUp ? index < 2 : index < 1)" >
                    {{ index === 0 ? 'Отфильтровано: ' + new Date(date).toLocaleDateString() : '' }}
                </v-subheader>

                <v-card 
                    slot="content"
                    slot-scope="{ item }"
                    @mouseover="onHover(item._id)" 
                    @mouseout="value[item._id] = false" 
                    hover 
                    :height="300"
                    
                    style="margin: auto"
                >

                    <v-layout column>
                        <v-flex xs5 class="">
                            <!-- 8qrECfnHr5QD1uXJNMsfZBypRSE5z1wTeClLXsxeqDaeZFT8S7mV1Dznx8t4 -->
                            <!-- <v-card-media>
                                <youtube :video-id="youtube_src" :width="'100%'" :height="'100%'"></youtube>
                            </v-card-media> -->

                            <!-- <v-card-media
                                :src="`https://placeimg.com/1000/${item._id + 600}/nature`"
                                height="150px"
                                
                            /> -->
                            <v-card-media
                                :src="`https://localhost:8000/${item._id}/files/${item.compressed}`"
                                height="150px"
                                
                            />
                            <!-- <v-card-media
                                :src="props.item.media || (props.item._id % 3 === 0) ? 'https://cdn.vuetifyjs.com/images/cards/desert.jpg' : 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'"
                                height="100%"  
                            /> -->
                        </v-flex>
                        <v-flex xs7 :class="{'pt-0': true,'pb-0':auth.group === 'admins'}" style="display:flex; flex-direction: column; flex:1" justify-space-between>
                                <v-card-title class="primary--text pb-0 pt-0" >
                                    <h3 style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{item.caption}}</h3>
                                </v-card-title>

                                <v-card-text class="pt-1 pb-1" style="overflow: hidden;white-space: nowrap; text-overflow: ellipsis;">
                                    {{item.text}}
                                </v-card-text>

                                <v-spacer/>

                                <v-card-actions>
                                    <v-icon small class="mr-1 accent--text" style="font-size: 14px">fas fa-tags</v-icon>
                                    <small v-for="(tag, inx) in item.tags" :key="inx" style="overflow: hidden;white-space: nowrap; text-overflow: ellipsis;">{{tag}}{{ inx === item.tags.length - 1 ? '' : ', '}}</small>
                                </v-card-actions>

                                <v-card-actions>
                                    <small>
                                        {{ new Date(item.date).toLocaleString() }}
                                    </small>

                                    <v-spacer></v-spacer>
                                    <v-btn icon small flat color="primary">
                                        <v-icon small>fas fa-expand</v-icon>
                                        <!-- <v-icon small>{{ details[props.item._id] ? 'fas fa-compress' : 'fas fa-expand' }}</v-icon> -->
                                    </v-btn>
                                </v-card-actions>
                        </v-flex>
                    </v-layout>

                    <v-speed-dial class="card-dial"
                        v-if="auth.group === 'admins'"
                        absolute
                        v-model="fab[item._id]"
                        
                        :bottom="bottom"
                        :right="right"
                        :left="left"
                        :direction="direction"
                        :open-on-hover="hover"
                        :transition="transition"
                        v-show="item._id === active"
                    >
                        <v-btn
                            slot="activator"
                            v-model="fab[item._id]"
                            :style="fab[item._id] ? 'background-color: rgb(48, 63, 159)' : 'background-color: rgb(96, 125, 139, 0.5)'"
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
                            @click="commit('SHOW_MODAL', { news: item })"
                        >
                            <v-tooltip left>
                                <v-icon slot="activator">fas fa-pen</v-icon>
                                <span>Редактировать</span>
                            </v-tooltip>
                        </v-btn>
                        <v-btn
                            fab
                            dark
                            small
                            color="red darken-2"
                            @click.native="commit('SHOW_MODAL', { news: item, options: { remove: true }})"
                        >
                            <v-tooltip left>
                                <v-icon slot="activator">fas fa-times</v-icon>
                                <span>Удалить</span>
                            </v-tooltip>
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
    import { Youtube } from 'vue-youtube'

    //Vue.use(VueYoutube);

    export default {
        props: ['date'],
        extends: Widget,
        components: {
            news: () => import('./modals/news'),
            scrollable,
            Youtube
        },
        activated() {
            let container = this.$el.querySelector("#scrollable");
            container && (container.scrollTop = this.scroll_position);
        },
        computed: {
            filter() {
                let raw_data = this.raw_data;
                this.date ? raw_data = this.raw_data.filter((item) => new Date(item.date).toDateString() === new Date(this.date).toDateString()) : raw_data = this.raw_data

                return raw_data;
            },
            youtube_src: {
                get() {
                    //debugger;
                    //let res = await this.execute({ endpoint: 'news.youtube' });
                    let size = Math.floor(Math.random() * (400 - 300 + 1)) + 300;
                    let res = this.getRandomVideoId(size);
                    return res;
                },
                cache: true
            },
            img_src: {
                get() {
                    debugger;
                    //let res = await this.execute({ endpoint: 'news.youtube' });
                    let size = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
                    return `https://picsum.photos/${size}/${size}?random`
                },
                cache: false
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
            },
            getRandomVideoId() {
                let vids = ['MyFOkOacn9o', '06FIcXpZiSU', 'e5PSiVpJxYc', 'eNPns1e6THI'];
                /* let result = ''
                const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz_'
                for (let i = 0; i < 10; i++) {
                    result += str[Math.ceil(Math.random() * str.length)]
                } */
                let inx = Math.floor(Math.random() * (0 - 4 + 1)) + 3;
                let result = vids[inx];
                return result
            }
        },
        watch: {
            'append': function(val) {
                val && this.onHover(0);
            }
        },
        data() {
            return {
                append: false,

                active: false,
                value: {},
                direction: 'bottom',
                fab: {},
                hover: true,
                top: true,
                right: true,
                bottom: false,
                left: false,
                transition: 'slide-y-reverse-transition',
            }
        }
    }
</script>

<style scoped>
    .card-dial {
        margin-top: 16px;
        padding-bottom: 6px;
        z-index: 1;
        /* margin-right: 16px; */
    }

    .top-dial {
        margin-bottom: -28px;
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