<template>
	<dashboard v-if="!sign.UNAUTHORIZED" class="dashboard" :layout="layout" :components="components" :data={} v-resize="onResize" :date="selected_date" @REGISTER-COMPONENT="registerComponent" @date-changed="onDateChanged"/>
</template>


<script>
    import Layout from './../components/class_layout';

    export default {
        extends: Layout,
		components: { 
             dashboard: () => import('../components/dashboard') 
        },
        methods: {
            onResize() {
                console.log('NEWS LAYOUT RESIZE');
            },
            onDateChanged(date) {
                this.selected_date = date;
            }
        },
		data() {
			return {
                selected_date: void 0,
				layout: {
					cols: 10,
					rows: 15
				},
				components: [
                    {
                        "id": 1,
                        "x": 1,
                        "y": 0,
                        "w": 6,
                        "h": 4,
                        "text": "donate",
                        "available": false,
                        "comp": "wallet"
                    },
                    
                    {
                        "id": 3,
                        "x": 7,
                        "y": 0,
                        "w": 2,
                        "h": 8,
                        "text": "calendar",
                        "available": false,
                        "comp": "calendar"
                    },
                    {
                        "id": 4,
                        "x": 1,
                        "y": 4,
                        "w": 6,
                        "h": 11,
                        "text": "transactions",
                        "available": false,
                        "comp": "order"
                    }
                ]
			}
		}
	}

</script>

<style>

</style>
