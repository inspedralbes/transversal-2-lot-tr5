/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

Vue.component('question' , {
    data: function () {
        return {
            userAnswer: false,
            arrayAnswersDesordenada: [],
            answered: null
        }
    },
    props: ['infoQuestion'],
    template: ` <div>
                    <h3></h3>
                    <b-card
                    :title=infoQuestion.question
                    style="max-width: 20rem;"
                    class="mb-2"
                    >
                        <b-row>
                            <b-col lg="6" class="pb-2">
                                <button @click="getAnswerUser(0)" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(0), respuesta__incorrecta: comprobarRespuestaIncorrecta(0)  }">{{ this.arrayAnswersDesordenada[0].answer }}</button>
                            </b-col>
                            <b-col lg="6" class="pb-2">
                                <button @click="getAnswerUser(1)" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(1), respuesta__incorrecta: comprobarRespuestaIncorrecta(1) }">{{ this.arrayAnswersDesordenada[1].answer }}</button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col lg="6" class="pb-2">
                                <button @click="getAnswerUser(2)" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(2), respuesta__incorrecta: comprobarRespuestaIncorrecta(2) }">{{ this.arrayAnswersDesordenada[2].answer }}</button>
                            </b-col>
                            <b-col lg="6" class="pb-2">
                                <button @click="getAnswerUser(3)" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(3), respuesta__incorrecta: comprobarRespuestaIncorrecta(3) }">{{ this.arrayAnswersDesordenada[3].answer }}</button>
                            </b-col>
                        </b-row>
                        <br>
                        <b-button variant="success" @click="isAnswered">Next</b-button>
                        <slot></slot>
                    </b-card>
                   
                </div>`,
    methods: {
        getAnswerUser: function (numero) {

            if(!this.answered){
                console.log(this.arrayAnswersDesordenada[numero]);
                console.log(this.infoQuestion.correctAnswer);
                if(this.arrayAnswersDesordenada[numero].answer == this.infoQuestion.correctAnswer) {
                    this.userAnswer=true;
                    this.arrayAnswersDesordenada[numero].correcto = true;
                }
                else {
                    this.userAnswer = false;
                    this.arrayAnswersDesordenada[numero].incorrecto = true;
                }
                
                this.answered = true;
                this.$emit('userAnswer', this.userAnswer);
            }
        },
        isAnswered: function() {
            if(this.answered) {
                this.$emit('incrementQuestion');
            }
            else {
                alert("Answer the question");
            }
        },
        comprobarRespuestaCorrecta: function(index) {
            if(this.arrayAnswersDesordenada[index].correcto != null) {
                return this.arrayAnswersDesordenada[index].correcto;
            }
            else {
                return false;
            }
            
        },
        comprobarRespuestaIncorrecta: function(index) {
            if(this.arrayAnswersDesordenada[index].incorrecto != null) {
                return this.arrayAnswersDesordenada[index].incorrecto;
            }
            else {
                return false;
            }
        }
    },
    mounted() {

        this.infoQuestion.incorrectAnswers.forEach(element => {
            let a = {
                answer: element,
                correcto: null,
                incorrecto: null
            };
            this.arrayAnswersDesordenada.push(a);
        });

        let a = {
            answer: this.infoQuestion.correctAnswer,
            correcto: null,
            incorrecto: null
        };
        this.arrayAnswersDesordenada.push(a);
        shuffleArray(this.arrayAnswersDesordenada);
        console.log(this.arrayAnswersDesordenada[0].answer);
    }

});

Vue.component('start' , {
    data: function () {
        return {
            showButtonPlay: true,
            questions: [],
            selectedDifficulty: "",
            selectedCategory: "",
            showQuestions: null,
            actualQuestion: 0,
            userAnswers: [null, null, null, null, null, null, null, null, null, null]
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

                    <div v-if="showQuestions" v-for="(question, index) in this.questions">
                        <question v-show="actualQuestion == index":infoQuestion="question" @incrementQuestion="incrementQuestion" @userAnswer="addUserAnswer">
                        <br><br>
                        <div v-for="(answer, index) in userAnswers" class="respuestas__footer">
                            <div v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(index), respuesta__incorrecta: comprobarRespuestaIncorrecta(index)}">{{index+1}}</div>
                        </div>
                        </question>
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
                console.log(this.questions[0]);
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
        },

        addUserAnswer: function(userAnswer) {

            this.userAnswers[this.actualQuestion] = userAnswer;
            // this.userAnswers.push(userAnswer);

            console.log(this.userAnswers);
        },
        comprobarRespuestaCorrecta: function(index) {
            return this.userAnswers[index];
        },
        comprobarRespuestaIncorrecta: function(index) {

            if(this.userAnswers[index] == null) {
                return false;
            }else {
                return !this.userAnswers[index];
            }
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
