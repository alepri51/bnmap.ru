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
                        "h": 15,
                        "text": "news",
                        "available": false,
                        "comp": "news-feed"
                    },
                    
                    {
                        "id": 4,
                        "x": 7,
                        "y": 3,
                        "w": 2,
                        "h": 7,
                        "text": "bio",
                        "available": false,
                        "comp": "calendar"
                    },
                    {
                        "id": 3,
                        "x": 7,
                        "y": 0,
                        "w": 2,
                        "h": 3,
                        "text": "balance",
                        "available": false,
                        "comp": "auth-control"
                    }
                ]
			}
		}
	}

</script>

<style>

</style>
