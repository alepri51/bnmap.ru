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
					cols: 15,
					rows: 15
				},
				components: [
                    {
                        "id": 1,
                        "x": 13,
                        "y": 3,
                        "w": 2,
                        "h": 12,
                        "text": "donate",
                        "available": false,
                        "comp": "qrcode"
                    },
                    {
                        "id": 2,
                        "x": 13,
                        "y": 0,
                        "w": 2,
                        "h": 3,
                        "text": "auth",
                        "available": false,
                        "comp": "auth-control"
                    },
                    {
                        "id": 3,
                        "x": 0,
                        "y": 0,
                        "w": 2,
                        "h": 15,
                        "text": "calendar",
                        "available": false,
                        "comp": "list"
                    },
                    {
                        "id": 4,
                        "x": 2,
                        "y": 0,
                        "w": 11,
                        "h": 15,
                        "text": "transactions",
                        "available": false,
                        "comp": "hierarchy"
                    }
                ]
			}
		}
	}

</script>

<style>

</style>
