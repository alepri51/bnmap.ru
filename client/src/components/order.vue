<template>
    <widget name="заказы">
        <v-card width="100%">
            <v-card-title style="position: relative">
                <h2><v-icon color="primary" class="mr-2 shadow">fas fa-exclamation-circle</v-icon>Новости платформы:</h2>
            </v-card-title>
            <v-divider/>
    <v-data-iterator class="scrollable"
      :items="filter"
      :pagination.sync="pagination"
      content-tag="v-card-text"
      content-class="content"
      
      
      hide-actions
    >
        <!-- <v-card full-width slot="item"
        slot-scope="props">
          <v-card-title><h4>{{ props.item.number }}</h4></v-card-title>
          <v-divider></v-divider>
        </v-card> -->
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm12
        md6
        lg12
        
      >
        <v-card >
          <v-card-title><h4>{{ props.item.number }}</h4></v-card-title>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-data-iterator>
       </v-card>

        <!-- <v-card>
            <v-card-text class="scrollable">
                <v-data-table
                    :headers="headers"
                    :items="filter"
                    
                    class="elevation-0"
                    item-key="_id"
                    disable-initial-sort
                    :pagination.sync="pagination"
                    hide-actions
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ new Date(props.item.date).toLocaleString() }}</td>
                        <td>{{ props.item.number }}</td>
                        <td>{{ props.item.name }}</td>
                        <td><v-btn v-if="props.item.state === 'ожидание'" small flat color="primary">Отменить</v-btn><span v-if="props.item.state !== 'ожидание'">{{ props.item.state }}</span></td>
                        <td class="text-xs-right">{{ props.item.sum }} BTC</td>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card> -->
    </widget>

</template>

<script>
    
    import Widget from './class_widget';
    
    export default {
        extends: Widget,
        data() {
            return {
                pagination: {
                    rowsPerPage: -1,
                    sortBy: 'date',
                    descending: true
                },
                headers: [
                    { text: 'Дата', value: 'date' },
                    {
                        text: 'Заказ',
                        align: 'left',
                        value: 'number'
                    },
                    { text: 'Наименование', value: 'name' },
                    { text: 'Состояние', value: 'state' },
                    { text: 'Сумма', value: 'sum' },
                ],
            }

        },
        watch: {
            pagination: {
                handler (n, o) {
                    console.log(n, o);
                },
                deep: true
            }
            },
    }
</script>

<style >
    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .scrollable {
        overflow-y: auto; 
        position: relative; 
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        height: 100%;
    }

    .content {
        flex: 1
    }
</style>

