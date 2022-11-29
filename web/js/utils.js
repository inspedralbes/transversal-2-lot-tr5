Vue.component('inicio' , {
    data: function () {
        return {
            
        }
    },
    template: ` <div class="container_button_play">
                    <div class="button_play"><b-button pill variant="warning" v-b-modal="'modalSelectCategory'">PLAY</b-button></div>
                    <b-modal id="modalSelectCategory" title="BootstrapVue">
                        <template #modal-title>
                            Select
                        </template>
                        <sele
                    </b-modal>
                </div>`
    
});

const Inicio = {
    template: ` <div>
                    <inicio></inicio>
                </div>`,
}
const Perfil = {
    template: ``,
}

// 2. Define some routes
// Each route should map to a component.
const routes = [{
    path: '/',
    component: Inicio
}, {
    path: '/perfil',
    component: Perfil
}, ]

// 3. Create the router instance and pass the `routes` option
const router = new VueRouter({
    routes // short for `routes: routes`
})

const userStore = Pinia.defineStore('usuario', {
    state() {
        return {
            logged: false,
            loginInfo: {
                success: true,
                nombre: 'Nombre del almacen',
                imagen: '',
                idUser: ''
            }
        }
    },
    actions: {
        setEstado(i) {
            this.loginInfo = i
        }
    }
})

Vue.use(Pinia.PiniaVuePlugin)
const pinia = Pinia.createPinia()

Vue.use(BootstrapVue)
let app = new Vue({
    el: '#app',
    router,
    pinia,
    data: {

    },
    computed: {
        ...Pinia.mapState(userStore, ['loginInfo', 'logged']),
        isLogged() {
            return userStore().logged;
        }
    },
    methods: {
        ...Pinia.mapActions(userStore, ['setEstado'])
    }
});
