<template>
	<dashboard class="dashboard" :layout="layout" :components="components" :data={} v-resize="onResize" @REGISTER-COMPONENT="registerComponent"/>
</template>


<script>
    import Base from './../components/class_base';

    export default {
        extends: Base,
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
					rows: 10
				},
				components: [
                    {
                        "id": 1,
                        "x": 1,
                        "y": 0,
                        "w": 6,
                        "h": 3,
                        "text": "donate",
                        "available": false,
                        "comp": "donate"
                    },
                    {
                        "id": 2,
                        "x": 7,
                        "y": 0,
                        "w": 2,
                        "h": 2,
                        "text": "auth",
                        "available": false,
                        "comp": "auth-control"
                    },
                    {
                        "id": 3,
                        "x": 7,
                        "y": 2,
                        "w": 2,
                        "h": 7,
                        "text": "calendar",
                        "available": false,
                        "comp": "calendar"
                    },
                    {
                        "id": 4,
                        "x": 1,
                        "y": 3,
                        "w": 6,
                        "h": 7,
                        "text": "transactions",
                        "available": false,
                        "comp": "donate"
                    }
                ]
			}
		}
	}

</script>

<style>

</style>
