<template>
    <v-container fluid grid-list-xl class="pl-3 pr-3 pt-0 pb-0 mt-3 mb-3" style="overflow-y: auto" id="scrollable">
        <v-data-iterator 
            :items="items"
            :pagination.sync="pagination"
            content-tag="v-layout"

            wrap
            
            justify-center
            align-content-start

            style="height: 100%; width: 100%; padding-top: 3px"
            no-data-text=""
            hide-actions
        >
            <v-flex
                v-scroll:#scrollable="onScroll"
                slot="item"
                slot-scope="props"
                v-bind="$attrs"
            >
                <slot v-bind:item="props.item">
                    {{ props.item }}
                </slot>
            </v-flex>

        </v-data-iterator>
    </v-container>

</template>

<script>
    
    export default {
        props: ['items', 'sort', 'descending'],
        data() {
            return {
                scroll_position: 0,
                pagination: {
                    rowsPerPage: -1,
                    sortBy: this.sort,
                    descending: this.descending
                },
            }

        },
        computed: {
            pages: {
                get() {
                    return {...this.pagination}
                },
                set(val) {

                }
            }
        },
        activated() {
            setTimeout(() => {
                this.$el.scrollTop = this.scroll_position;
            }, 0);
        },
        methods: {
            onScroll(e) {
                //debugger;
                this.scroll_position = e.target.scrollTop;
                //this.$el.scrollTop = this.scroll_position;
            },
        }
    }
</script>

<style >
    .scrollable {
        overflow-y: auto; 
        position: relative; 
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>

