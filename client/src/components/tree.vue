<template>
    <v-card full-width flat class="ma-0">
        <v-card-title class="pa-1 item" @click="$emit('selected', model)" :class="{ bold: selection._id === model._id, 'elevation-1': hovered, 'elevation-0': !hovered }"
            @mouseover="hovered = true" @mouseleave="hovered = false"
        >
            <v-icon @click="toggle" small style="width: 16px" class="accent--text mr-2">fas {{isFolder ? open ? 'fa-caret-down' : 'fa-caret-right' : isItem ? '' : 'fa-caret-right' }}</v-icon>
            <v-icon small class="primary--text mr-2">fas fa-user</v-icon>
            <div>{{model.name}}{{referals.length ? ' [привлечено: ' + referals.length + ']' : ''}}</div>

            <v-spacer/>

            <div v-show="controls" style="height: 32px">
                <v-btn v-show="hovered" icon small flat class="green lighten-1 ma-0 ml-1">
                    <v-tooltip top>
                        <v-icon slot="activator" :size="14" color="white" style="margin-bottom: 1px">fas fa-plus</v-icon>
                        <span>Добавить раздел</span>
                    </v-tooltip>
                </v-btn>
                <v-btn v-show="hovered" icon small flat class="primary lighten-1 ma-0 ml-1">
                    <v-tooltip top>
                        <v-icon slot="activator" :size="14" color="white" style="margin-bottom: 1px">fas fa-pen-square</v-icon>
                        <span>Редактировать</span>
                    </v-tooltip>
                </v-btn>
                <v-btn v-show="hovered" icon small flat class="red lighten-1 ma-0 ml-1">
                    <v-tooltip top>
                        <v-icon slot="activator" :size="14" color="white" style="margin-bottom: 1px">fas fa-times</v-icon>
                        <span>Удалить</span>
                    </v-tooltip>
                </v-btn>
            </div>
        </v-card-title>

        <v-card-text class="pb-1 pt-1" v-show="open && referals" >
            <tree v-show="open" v-for="(model, inx) in referals" :key="inx" :model="model"
                :selection="selection" 
                v-on="$listeners" 
                :storage="storage" 
                :field="field" 
                :endpoint="endpoint"
                :controls="controls"
            />
        </v-card-text>
    </v-card>
</template>

<script>
import Base from './class_base';

export default {
    extends: Base,
    name: 'tree',
    props: ['selection', 'model', 'field', 'storage', 'endpoint', 'controls'],
    data: () => ({
        hovered: false,
        open: true,
        selected: void 0,
        isItem: false
    }),
    computed: {
        referals() {
            debugger
            return this.model[this.field] ? this.model[this.field].map(ref => this.storage[ref]) : []
        },
        isFolder: function () {
            //debugger;
            return this.model[this.field] && this.model[this.field].length
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

