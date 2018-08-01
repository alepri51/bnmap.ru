<template>
    <widget name="календарь">
        <v-card>
            <v-card-title>
                <h2 class="widget-caption"><v-icon color="primary" class="mr-2 shadow">fas fa-calendar-alt</v-icon>Календарь новостей:</h2>
            </v-card-title>
            <v-card-text >
                <v-date-picker 
                    color="secondary"
                    full-width
                    locale="ru-ru"
                    v-model="picker" 
                    :show-current="today" 
                    :landscape="landscape" 
                    :reactive="reactive" 
                    flat 
                    style="width:100%" class="elevation-0"
                    :event-color="date => date[9] % 2 ? 'red' : 'blue'"
                    :events="events"
                    :allowed-dates="allowedDates"
                />
            </v-card-text>
        </v-card>
    </widget>
</template>

<script>
    import Widget from './class_widget';

    export default {
        extends: Widget,
        data: () => ({
            today: new Date().toISOString().slice(0, 10),
            picker: new Date().toISOString().slice(0, 10),
            landscape: false,
            reactive: true,
            events: ['2018-07-10', '2018-07-11', '2018-07-21'],
            
        }),
        created() {
            console.log(new Date().toISOString().slice(0, 10));
        },
        methods: {
            allowedDates: val => ['2018-07-10', '2018-07-11', '2018-07-21'].indexOf(val) !== -1
        }
    }
</script>

<style>
    .v-date-picker-table__event {
        bottom: 0px!important;
    }

    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

