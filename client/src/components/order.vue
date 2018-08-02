<template>
    <widget name="auth">
        <v-card>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="filter"
                    
                    class="elevation-0"
                    item-key="_id"
                    disable-initial-sort
                >
                    <template slot="items" slot-scope="props">
                    <td>{{ new Date(props.item.created).toLocaleString() }}</td>
                    <td>{{ props.item._id }}</td>
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-center"><v-btn v-if="props.item.state === 'ожидание'" small flat color="primary">Отменить</v-btn><span v-if="props.item.state !== 'ожидание'">{{ props.item.state }}</span></td>
                    <td class="text-xs-right">{{ props.item.sum }} BTC</td>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </widget>

</template>

<script>
    
    import Widget from './class_widget';
    
    export default {
        extends: Widget,
        data() {
            return {
                headers: [
                    { text: 'Дата', value: 'created' },
                    {
                        text: 'Заказ',
                        align: 'left',
                        value: '_id'
                    },
                    { text: 'Наименование', value: 'name' },
                    { text: 'Состояние', value: 'state' },
                    { text: 'Сумма', value: 'sum' },
                ],
            }

        }
    }
</script>

<style scoped>
    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

