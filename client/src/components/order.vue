<template>
    <widget name="заказы">
        <v-card width="100%">
            <v-card-title>
                <h2><v-icon color="primary" class="mr-2 shadow">fas fa-exclamation-circle</v-icon>Транзакции:</h2>
            </v-card-title>
            
            <v-divider/>

            <scrollable :items="filter" xs12 sm6 md4 lg3 sort="date" :descending="true">
                <v-card 
                    slot="content"
                    slot-scope="props"
                    hover
                    :height="200"
                    style="min-width: 100px; max-width: 250px; margin: auto; display: flex; flex-direction: column"
                >
                    <v-card-title>
                        <v-icon :color="props.item.items.length === 1 ? entities.product[props.item.items[0]].color : 'primary'" class="mr-2">{{ props.item.items.length === 1 ? entities.product[props.item.items[0]].icon : 'fas fa-file-invoice-dollar' }}</v-icon>   
                        <h4 class="primary--text">{{ props.item.name }}</h4>
                    </v-card-title>

                    <v-divider/>

                    <div class="pt-3 pl-3 pr-3 primary--text" v-show="!details[props.item._id]">№ {{ props.item.number }}</div>

                    <v-card-text v-show="!details[props.item._id]">
                        Состояние: <b>{{ props.item.state }}</b>
                        <!-- ID: <b>{{ props.item._id }}</b> -->
                    </v-card-text>

                    <v-card-text v-show="details[props.item._id]">
                        ОПИСАНИЕ ЗАКАЗА: <b>{{ props.item.state }}</b>
                    </v-card-text>

                    <v-spacer/>

                    <v-card-actions>
                        <small class="">{{ new Date(props.item.date).toLocaleString() }}</small>
                        <v-spacer/>
                        <v-btn icon small flat color="primary" @click="$set(details, props.item._id, !details[props.item._id])">
                            <v-icon small>{{ details[props.item._id] ? 'fas fa-compress' : 'fas fa-expand' }}</v-icon>
                        </v-btn>
                    </v-card-actions>


                </v-card>
            </scrollable>
       </v-card>
    </widget>

</template>

<script>
    
    import Widget from './class_widget';
    import scrollable from './scrollable';
    
    export default {
        props: ['date'],
        extends: Widget,
        components: { scrollable },
        data() {
            return {
                show: false,
                details: {},
                pagination: {
                    rowsPerPage: -1,
                    sortBy: 'date',
                    descending: true
                }
            }

        },
        watch: {
            'details': function(n, o) {
                console.log(o, n);
            }
        },
        computed: {
            filter() {
                let raw_data = this.raw_data;
                this.date ? raw_data = this.raw_data.filter((item) => new Date(item.date).toDateString() === new Date(this.date).toDateString()) : raw_data = this.raw_data

                return raw_data;
            }
        },
        activated() {
            let container = this.$el.querySelector("#scrollable");
            container && (container.scrollTop = this.scroll_position);
        },
        methods: {
            onScroll(e) {
                this.scroll_position = e.target.scrollTop;
            },
            toggle(id) {
                //debugger
                this.$set(this.details, id, !this.details[id]);
                
            }
        }
    }
</script>

<style >
    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
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
</style>

