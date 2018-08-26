<template>
	<dashboard v-if="!sign.UNAUTHORIZED"  class="dashboard" :layout="layout" :components="components" :data={} :date="selected_date" v-resize="onResize" @REGISTER-COMPONENT="registerComponent" @date-changed="onDateChanged"/>
<!--     <v-card v-else class="restriction">
        <v-layout column justify-center align-center>
            <h2 class="pa-2"><v-icon class="mr-2 shadow" color="red darken-2">fas fa-minus-circle</v-icon>ДОСТУП ОГРАНИЧЕН</h2>
        </v-layout>
    </v-card> -->
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
        computed: {
        },
		data() {
			return {
                //condition: false,
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
                        "h": 15,
                        "text": "news",
                        "available": false,
                        "comp": "news"
                    },
                    
                    {
                        "id": 4,
                        "x": 7,
                        "y": 0,
                        "w": 2,
                        "h": 8,
                        "text": "bio",
                        "available": false,
                        "comp": "calendar"
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
