<template>
    <widget name="список">
        <v-card>
            <v-card-title>
                <h2 class="widget-caption"><v-icon color="primary" class="mr-2 shadow">fas fa-list-alt</v-icon>Ваш список:</h2>
            </v-card-title>
            <v-divider/>
            <v-card-text>
                <div class="mb-2" v-for="(item, inx) in filter" :key="inx">
                    <v-icon small color="primary" class="mr-1">fas fa-user</v-icon>
                    {{inx + 1}}. {{item.name}} - {{item.ref}}
                </div>
            </v-card-text>
        </v-card>
    </widget>
</template>

<script>
    import Widget from './class_widget';

    export default {
        extends: Widget,
        data: () => ({
                        
        }),
        computed: {
            filter() {
                //debugger
                console.log('LIST:', this.raw_data);
                
                let list = this.raw_data.filter(list => list._id === this.entities.member[this.auth.member].list)[0];
                list = list && list.members && list.members.map(member => this.entities.member[member]);
                return list && list.sort((a, b) => a._rel.номер - b._rel.номер);
                //return this.raw_data;
            }
        },
    }
</script>

<style>

    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

