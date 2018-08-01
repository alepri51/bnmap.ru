<template>
	<dashboard v-if="signed_id" class="dashboard" :layout="layout" :components="components" :data={} v-resize="onResize" @REGISTER-COMPONENT="registerComponent"/>
    <v-card v-else class="restriction">
        <v-layout column justify-center align-center>
            <h2 class="pa-2"><v-icon class="mr-2 shadow" color="red darken-2">fas fa-minus-circle</v-icon>ДОСТУП ОГРАНИЧЕН</h2>
        </v-layout>
    </v-card>
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
        computed: {
            signed_id() {
                return typeof this.condition !== 'undefined' ? this.condition : this.state.signed_id;
            }
        },
		data() {
			return {
                //condition: false,
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

<style scoped>
    .restriction {
        display: flex!important;
        flex-direction: column;
        height: 100%;
    }
</style>
