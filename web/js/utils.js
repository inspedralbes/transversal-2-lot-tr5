Vue.component('question' , {

    props: ['infoQuestion'],
    template: ` <div>
                    <h3>{{ infoQuestion.question }}</h3>
    
                    <b-button variant="success" @click="$emit('incrementQuestion')">Next</b-button>
                </div>`,

});

Vue.component('start' , {
    data: function () {
        return {
            showButtonPlay: true,
            questions: [],
            selectedDifficulty: "",
            selectedCategory: "",
            showQuestions: null,
            actualQuestion: 0
        }
    },

    template: ` <div class="container_button_play" >
                    <div v-if="showButtonPlay" class="button_play"><b-button pill variant="warning" v-b-modal="'modalSelectCategory'">PLAY</b-button></div>
                    <b-modal id="modalSelectCategory" title="Select" hide-footer>
                        <p>Difficulty</p>
                        <b-form-select class="mb-3" v-model="selectedDifficulty">
                            <template #first>
                                <b-form-select-option :value="null" disabled>-- Please select a difficulty --</b-form-select-option>
                            </template>
                            <b-form-select-option value="easy">Easy</b-form-select-option>
                            <b-form-select-option value="medium">Medium</b-form-select-option>
                            <b-form-select-option value="hard">Hard</b-form-select-option>
                        </b-form-select>
                        <br>
                        <p>Category</p>
                        <b-form-select class="mb-3" v-model="selectedCategory">
                            <template #first>
                                <b-form-select-option :value="null" disabled>-- Please select a category --</b-form-select-option>
                            </template>
                            <b-form-select-option value="arts_and_literature">Arts & Literature</b-form-select-option>
                            <b-form-select-option value="film_and_tv">Film & TV</b-form-select-option>
                            <b-form-select-option value="food_and_drink">Food & Drink</b-form-select-option>
                            <b-form-select-option value="general_knowledge">General Knowledge</b-form-select-option>
                            <b-form-select-option value="geography">Geography</b-form-select-option>
                            <b-form-select-option value="history">History</b-form-select-option>
                            <b-form-select-option value="music">Music</b-form-select-option>
                            <b-form-select-option value="science">Science</b-form-select-option>
                            <b-form-select-option value="society_and_culture">Society & Culture</b-form-select-option>
                            <b-form-select-option value="sport_and_leisure">Sport & Leisure</b-form-select-option>
                        </b-form-select>
                        <br>
                        <br>
                        <b-row>
                            <b-col lg="9" class="pb-2">
                            </b-col>
                            <b-col lg="3" class="pb-2">
                                <b-button variant="success" @click="createGame">Continue</b-button>
                            </b-col>
                        </b-row>
                    </b-modal>

                    <div v-if="showQuestions">
                        <question :infoQuestion="this.questions[actualQuestion]" @incrementQuestion="incrementQuestion"></question>
                    </div>
                </div>`,
    methods: {
        createGame: function() {
            this.showButtonPlay = false;
            let rutaFetch = "https://the-trivia-api.com/api/questions?categories="+ this.selectedCategory +"&limit=10&region=ES&difficulty=" + this.selectedDifficulty;
            console.log(rutaFetch);
            fetch(rutaFetch)
            .then(res => res.json())
            .then(data => {
                this.questions = data;
                this.showQuestions = true;
                console.log(this.questions[0].question);
                this.$bvModal.hide("modalSelectCategory");
            });
            
        },

        incrementQuestion: function() {
            if(this.actualQuestion < 9) {
                this.actualQuestion++;
            }
            else {
                //llevarlo a la pantalla final
            }
            console.log(this.actualQuestion);
        }

    }
                
});

const Start = {
    template: ` <div>
                    <start>
                    </start>
                </div>`,
}
const Perfil = {
    template: ``,
}

// 2. Define some routes
// Each route should map to a component.
const routes = [{
    path: '/',
    component: Start
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
