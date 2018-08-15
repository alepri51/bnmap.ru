<template>
	<dashboard class="dashboard" :layout="layout" :components="components" :data={} v-resize="onResize" @REGISTER-COMPONENT="registerComponent" @select-node="onSelectNode"/>
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
            onSelectNode(...args) {
                //debugger;
                console.log(args);
                //this.entities = 
                //this.commit('SET_COMMON_DATA', { active_referal: })
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
                        "y": 8,
                        "w": 2,
                        "h": 7,
                        "text": "qr",
                        "available": false,
                        "comp": "qrcode"
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
                        "id": 5,
                        "x": 7,
                        "y": 3,
                        "w": 2,
                        "h": 3,
                        "text": "info",
                        "available": false,
                        "comp": "ref-info"
                    },
                    {
                        "id": 3,
                        "x": 1,
                        "y": 0,
                        "w": 2,
                        "h": 8,
                        "text": "list",
                        "available": false,
                        "comp": "list"
                    },
                    {
                        "id": 4,
                        "x": 3,
                        "y": 0,
                        "w": 4,
                        "h": 15,
                        "text": "hier",
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
