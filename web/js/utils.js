/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

Vue.component('results' , {
    data: function () {
        return {
            correctAnswers: 0,
            points: 0,
            timer: 0
        }
    },
    props: ['results', 'timerRestante'],
    template: ` <div class="game__result">
                    <h1>Your result is {{correctAnswers}}/{{results.length}}</h1>
                    <h1>Time: {{this.timer}} Puntuacion: {{this.points}}</h1>
                </div>`,
    methods: {
        calcularPuntuacion: function() {
            this.points = this.correctAnswers * this.timer;
        }
    },
    mounted() {
        for (let i = 0; i < this.results.length; i++) {
            if(this.results[i]){
                this.correctAnswers++;
            }
        }

        this.timer = this.timerRestante;
        this.calcularPuntuacion();
    }
});

Vue.component('question' , {
    data: function () {
        return {
            userAnswer: false,
            arrayAnswersDesordenada: [],
            answered: null
        }
    },
    props: ['infoQuestion'],
    template: ` <div class="game__cards">
                    <h3></h3>
                    <b-card
                    :title=infoQuestion.question
                    style="max-width: 20rem;"
                    class="mb-2"
                    >
                        <br>
                        <b-row>
                            <b-col lg="6" class="pb-2">
                                <button @click="getAnswerUser(0)" class="respuestas__body" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(0), respuesta__incorrecta: comprobarRespuestaIncorrecta(0)  }">{{ this.arrayAnswersDesordenada[0].answer }}</button>
                            </b-col>
                            <b-col lg="6" class="pb-2">
                                <button @click="getAnswerUser(1)" class="respuestas__body" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(1), respuesta__incorrecta: comprobarRespuestaIncorrecta(1) }">{{ this.arrayAnswersDesordenada[1].answer }}</button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col lg="6" class="pb-2">
                                <button @click="getAnswerUser(2)" class="respuestas__body" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(2), respuesta__incorrecta: comprobarRespuestaIncorrecta(2) }">{{ this.arrayAnswersDesordenada[2].answer }}</button>
                            </b-col>
                            <b-col lg="6" class="pb-2">
                                <button @click="getAnswerUser(3)" class="respuestas__body" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(3), respuesta__incorrecta: comprobarRespuestaIncorrecta(3) }">{{ this.arrayAnswersDesordenada[3].answer }}</button>
                            </b-col>
                        </b-row>
                        <br>
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
                    setTimeout(() => {
                        for (let i = 0; i < this.arrayAnswersDesordenada.length; i++) {
                            if(this.arrayAnswersDesordenada[i].answer == this.infoQuestion.correctAnswer){
                                this.arrayAnswersDesordenada[i].correcto = true;
                            } 
                        }
                      }, 500);
                }
                this.answered = true;
                this.$emit('userAnswer', this.userAnswer);
            }
        },
        comprobarRespuestaCorrecta: function(index) {
            if(this.arrayAnswersDesordenada[index].correcto) {
                return this.arrayAnswersDesordenada[index].correcto;
            }
            else {
                return false;
            }
            
        },
        comprobarRespuestaIncorrecta: function(index) {
            if(this.arrayAnswersDesordenada[index].incorrecto) {
                return this.arrayAnswersDesordenada[index].incorrecto;
            }
            else {
                return false;
            }
        }
    },
    beforeMount() {
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

Vue.component('game' , {
    data: function () {
        return {
            showButtonPlay: true,
            questions: [],
            selectedDifficulty: "",
            selectedCategory: "",
            showQuestions: null,
            showResults: null,
            actualQuestion: 0,
            timer: 90,
            seconds:90,
            userAnswers: [null, null, null, null, null, null, null, null, null, null]
        }
    },

    template: ` <div class="container_button_play" >
                    <div v-if="showButtonPlay" class="button_play"><b-button pill variant="warning" v-b-modal="'modalSelectCategory'">PLAY</b-button></div>
                    <b-modal id="modalSelectCategory" title="Select your game mode" hide-footer>
                        <p>Difficulty</p>
                        <template>
                            <div>
                                <b-form-select class="mb-3" v-model="selectedDifficulty">
                                    <template #first>
                                        <b-form-select-option :value="null" disabled>-- Please select a difficulty --</b-form-select-option>
                                    </template>
                                    <b-form-select-option value="easy">Easy</b-form-select-option>
                                    <b-form-select-option value="medium">Medium</b-form-select-option>
                                    <b-form-select-option value="hard">Hard</b-form-select-option>
                                </b-form-select>
                            </div>
                        </template>
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
                        <question v-show="actualQuestion == index":infoQuestion="question" @userAnswer="addUserAnswer">
                        <br><br>
                        <div v-for="(answer, index) in userAnswers" class="respuestas__footer">
                            <div v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(index), respuesta__incorrecta: comprobarRespuestaIncorrecta(index)}">{{index+1}}</div>
                        </div>
                        <br><br>
                        <h3>Timer: {{timer}}</h3>
                        </question>
                    </div>
                    <div v-if="showQuestions">
                        
                    </div>
                    <div v-if="showResults">
                        <results :results=userAnswers :timerRestante=timer></results>
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
                this.countDownTimer();
            });
        },
        incrementQuestion: function() {
            if(this.actualQuestion < 9) {
                this.actualQuestion++;
            }
            else {
                this.showQuestions = false;
                this.showResults = true;
            }
            console.log(this.actualQuestion);
        },
        addUserAnswer: function(userAnswer) {

            this.userAnswers[this.actualQuestion] = userAnswer;
            // this.userAnswers.push(userAnswer);

            console.log(this.userAnswers);
            if(userAnswer) {
                setTimeout(() => {
                    this.incrementQuestion();
                  }, "500");
            }
            else {
                setTimeout(() => {
                    this.incrementQuestion();
                  }, "1500");
            }
            
            
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
        },
        countDownTimer () {
            if (this.timer > 0 && this.showQuestions == true) {
                setTimeout(() => {
                    this.timer--;
                    this.countDownTimer()
                }, 1000)
            }
            else {
                this.showQuestions = false;
                this.showResults = true;
            }
        },
    },
 
});

const Inicio = {
    template: ``,
}

const Game = {
    template: ` <div>
                    <game>
                    </game>
                </div>`,
}
const Perfil = {
    template: ``,
}

// 2. Define some routes
// Each route should map to a component.
const routes = [{
    path: '/',
    component: Game
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
