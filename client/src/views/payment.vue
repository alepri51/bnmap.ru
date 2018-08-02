<template>
	<dashboard class="dashboard" :layout="layout" :components="components" :data={} v-resize="onResize" @REGISTER-COMPONENT="registerComponent"/>
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
            }
        },
		data() {
			return {
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
                        "id": 2,
                        "x": 7,
                        "y": 0,
                        "w": 2,
                        "h": 3,
                        "text": "auth",
                        "available": false,
                        "comp": "auth-control"
                    },
                    {
                        "id": 3,
                        "x": 7,
                        "y": 3,
                        "w": 2,
                        "h": 7,
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
