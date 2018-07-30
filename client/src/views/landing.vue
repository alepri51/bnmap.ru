<template>
    <div>
        <greeting/>
        <painpoint id="earthworks"/>
    </div>
</template>

<script>
    export default {
        components: {
            greeting: () => import('../components/greeting'),
            painpoint: () => import('../components/painpoint'),
        },
        created() {
            //debugger;
            /* this.commit('REGISTER_COMPONENT', 'products'); */
        }

    }
</script>

<style scoped>

</style>
