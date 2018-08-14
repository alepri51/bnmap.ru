<template>
    <widget name="иерархия">
        <v-card>
            <v-layout column fill-height>
                <v-card-title>
                    <h2 class="widget-caption"><v-icon class="mr-1 primary--text">fas fa-sitemap</v-icon>Иерархия:</h2>
                </v-card-title>
                <v-card-text >
                    <!-- <tree-view :model="model" category="list" :selection="selection" :onSelect="onSelect"></tree-view> -->
                    <tree style="height: 700px" :data="filter" node-text="title" layoutType="euclidean" type="tree" :radius="5" :zoomable="true"></tree>
                                       
                </v-card-text>
            </v-layout>
        </v-card>
    </widget>

</template>

<script>
    import Widget from './class_widget';
    //import Tree from './tree';
    import { tree } from 'vued3tree';
    import { TreeView } from "@bosket/vue"

    export default {
        extends: Widget,
        components: {
            tree,
            "tree-view": TreeView
        },
        data() {
            return {
                selection: [],
                onSelect: function(newSelection) { this.selection = newSelection },
                model: [
                    { name: "One" },
                    { label: "Two" },
                    { label: "Three", list: [
                        { label: "Four" },
                        { label: "Five" }
                    ] }
                ]
            }
        },
        computed: {
            filter() {
                
                debugger;
                let construct = (arr => {
                    return arr.map((element, inx) => {
                        element.children = construct(element.referals);
                        //element.title = `${inx + 1}. ${element.name} (email: ${element.email}) - ${element.ref}`;
                        element.title = `${element.name}\r\n${element.ref}`;
                        element.size = inx * 10;
                        return element;
                    });
                });
                
                let data = construct(this.raw_data);

                return {
                    title: 'Вы',
                    children: data
                };
            }
        },
    }
</script>

<style scoped>
    .widget-caption {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

