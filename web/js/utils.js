Vue.component('inicio' , {
    data: function () {
        return {
            categoriesResult: []
        }
    },

    template: ` <div class="container_button_play">
                    <div class="button_play"><b-button pill variant="warning" v-b-modal="'modalSelectCategory'">PLAY</b-button></div>
                    <b-modal id="modalSelectCategory" title="BootstrapVue">
                        <template #modal-title>
                            Select
                        </template>
                        <p>Difficulty</p>
                        <b-form-select class="mb-3">
                            <b-form-select-option value="Easy">Easy</b-form-select-option>
                            <b-form-select-option value="Medium">Medium</b-form-select-option>
                            <b-form-select-option value="Hard">Hard</b-form-select-option>
                        </b-form-select>
                        <br>
                        <p>Category</p>
                        <b-form-select class="mb-3" :options="categoriesResult">
                        </b-form-select>
                    </b-modal>
                </div>`,
    methods: {
        getCategories: function () { 

            fetch("https://the-trivia-api.com/api/categories")
            .then(res => res.json())
            .then(data => {
                           
                let categories = Object.values(data);
                // console.log(categories); 
                for (let i = 0; i < categories.length; i++) {
                   
                    // console.log(categories[i]);
                    for (let j = 0; j < categories[i].length; j++) {
                        // console.log(categories[i][j])
                        this.categoriesResult.push = " { value: '" + categories[i][j] + "', text: '" + categories[i][j] + "'}"
                    }
                    console.log(this.categoriesResult);
                }
            });

        }
    }
    
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
