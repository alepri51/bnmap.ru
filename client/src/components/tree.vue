<template>
    <v-card full-width flat>
        <v-card-title class="pb-1 pt-1 item" @click="$emit('selected', model)" :class="{ bold: selection._id === model._id }">
            <v-icon @click="toggle" small style="width: 16px" class="accent--text mr-2">fas {{isFolder ? open ? 'fa-caret-down' : 'fa-caret-right' : isItem ? '' : 'fa-caret-right' }}</v-icon>
            <v-icon small class="primary--text mr-2">fas fa-user</v-icon>
            <div>{{model.name}}{{referals.length ? ' [привлечено: ' + referals.length + ']' : ''}}</div>
        </v-card-title>

        <v-card-text class="pb-1 pt-1" v-show="open && model.referals" >
            <tree v-show="open" v-for="(model, inx) in referals" :key="inx" :model="model" :selection="selection" v-on="$listeners"></tree>
        </v-card-text>
    </v-card>
</template>

<script>
import Base from './class_base';

export default {
    extends: Base,
    name: 'tree',
    props: ['selection', 'model'],
    data: () => ({
        open: true,
        selected: void 0,
        isItem: false
    }),
    computed: {
        referals() {
            //debugger
            return this.model.referals ? this.model.referals.map(ref => this.$store.state.entities.hierarchy[ref]) : []
        },
        isFolder: function () {
            //debugger;
            return this.model.referals && this.model.referals.length
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
            else {
                !this.isItem && this.execute({ 
                    endpoint: `hierarchy.referals`,
                    payload: {
                        id: this.model._id
                    }, 
                    callback: (response) => {
                        //debugger;
                        !response.error && !response.data.entities && (this.isItem = true);
                    }
                })
            }
        },
        changeType: function () {
            if (!this.isFolder) {
                this.$set(this.model, 'children', [])
                this.addChild()
                this.open = true
            }
        },
        addChild: function () {
            this.model.children.push({
                label: 'new stuff'
           })
        }
    }
};
</script>

<style scoped>
    .widget {
        width: 100%;
    }

    .widget div:first-child {
        height: 100%;
    }

    .item {
        cursor: pointer;
    }
    .bold {
        font-weight: bold;
    }
    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }
</style>

