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

			}
        },
        methods: {
            registerComponent(name) {
                //debugger;
                this.commit('REGISTER_COMPONENT', name);
            },
            update() {
                this.execute({ 
                    endpoint: 'account:100.default',
                    method: 'get',
                    payload: {hello: 'world'},
                    callback: response => this.commit('ACCOUNT', this.auth.member)
                });
            },
            onResize() {

            }
        },
        activated() {
            //this.update();
        },
        created() {
            //РЕГИСТРАЦИЯ
            /* this.components.forEach(element => {
                this.commit('REGISTER_COMPONENT', element.comp);
            }); */
        },
		data() {
			return {
				layout: {
					cols: 8,
					rows: 8
				},
				components: [
                    {
                        "id": 1,
                        "x": 1,
                        "y": 0,
                        "w": 4,
                        "h": 8,
                        "text": "news",
                        "available": false,
                        "comp": "news-feed"
                    },
                    {
                        "id": 2,
                        "x": 1,
                        "y": 0,
                        "w": 4,
                        "h": 1,
                        "text": "bio",
                        "available": true,
                        "comp": "bio"
                    },
                    {
                        "id": 4,
                        "x": 5,
                        "y": 1,
                        "w": 2,
                        "h": 5,
                        "text": "bio",
                        "available": false,
                        "comp": "calendar"
                    },
                    {
                        "id": 3,
                        "x": 5,
                        "y": 0,
                        "w": 2,
                        "h": 1,
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
