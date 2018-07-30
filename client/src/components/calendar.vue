<template>
    <widget name="календарь">
        <v-card>
            <v-card-title>
                <h2><v-icon color="primary" class="mr-2 shadow">fas fa-calendar-alt</v-icon>Календарь новостей:</h2>
            </v-card-title>
            <v-card-text >
                <v-date-picker 
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
                />
            </v-card-text>
        </v-card>
    </widget>
</template>

<script>
    export default {
        data: () => ({
            today: new Date().toISOString().slice(0, 10),
            picker: new Date().toISOString().slice(0, 10),
            landscape: false,
            reactive: true,
            events: ['2018-07-10', '2018-07-11', '2018-07-21']
        }),
        created() {
            console.log(new Date().toISOString().slice(0, 10));
        }
    }
</script>

<style>
    .v-date-picker-table__event {
        bottom: 0px!important;
    }

</style>

