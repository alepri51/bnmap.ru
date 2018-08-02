<template>
    <v-dialog v-model="visible" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <v-icon class="mr-1 primary--text">fas fa-donate</v-icon>
                <span class="headline primary--text">{{defaults.items && defaults.items[0].product.name}}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" class="form" lazy-validation @submit.prevent/>
                Уважаемый пользователь! 
                <br>Для того что бы стать полноценным участником нашего клуба, 
                <br>переведите с вашего кошелька <b class="red--text">{{ defaults.items && defaults.items[0].cost }} BTC (75$)</b> 
                <br>на адрес: <b class="red--text">{{ defaults.address }}</b> 
                <br>в течении <b class="red--text">15</b> минут.
                <br>Если Вы не успеете за это время, то данная операция будет отменена.
                <br>Номер Вашего заказа отобразиться в списке со статусом ожидания.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="inactive" flat @click.native="commit('HIDE_MODAL', { donate: void 0 })">Отменить</v-btn>
                
                <v-btn dark :class="options.remove ? 'red darken-2' : 'green darken-2'" flat @click.native="submit">Продолжить</v-btn>
            </v-card-actions>

        </v-card>

    </v-dialog>
</template>

<script>
    import Modal from '../class_modal';
    
    export default {
        extends: Modal,
        inheritAttrs: false,
        //props: ['options'],
        data() {
            return {
            }
        },
        computed: {
        },
        methods: {
            
        }
    }    
</script>