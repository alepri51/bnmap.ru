<template>
    <!-- <v-expansion-panel popout focusable >
        <v-expansion-panel-content class="pa-0 ma-1"
            v-for="(item, inx) in items"
            :key="inx"
        >
            <div slot="header" style="display: flex; flex-direction: row; justify-content: space-between">
                <div>
                    <v-icon small color="primary">fas fa-user</v-icon>
                    {{inx + 1}}. {{item.name}} (email: {{item.email}}) - {{item.ref}}
                </div>
                <div>{{ item.referals && item.referals.length && item.referals.length }}</div>
            </div>

            <tree :items="item.referals"></tree>
        </v-expansion-panel-content>
    </v-expansion-panel> -->
    <v-list>
            <v-list-group
              v-for="(item, inx) in items"
              v-model="item.active"
              :key="item.title"
              :prepend-icon="item.action"
              no-action
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>{{inx + 1}}. {{item.name}} (email: {{item.email}}) - {{item.ref}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              
            </v-list-group>
                <tree :items="item.referals"></tree>
          </v-list>
</template>

<script>
    export default {
        props: ['items'],
        name: 'tree'
    }
</script>

<style scoped>
    .widget {
        width: 100%;
    }

    .widget div:first-child {
        height: 100%;
    }
</style>

