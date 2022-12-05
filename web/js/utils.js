/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

Vue.component('routes', {
    template: ` <div class="nav-container">
                    <nav class="navbar">
                        <b-nav-item v-show="this.isLogged" to="/ranking">Ranking</b-nav-item>
                        <b-nav-item active to="/">Play</b-nav-item>
                        <b-nav-item v-show="this.isLogged" to="/profile">Profile</b-nav-item>
                        <b-nav-item v-show="this.isLogged" to="/dailyGame">Daily game</b-nav-item>
                        <b-nav-item v-show="!this.isLogged" to="/login">Login</b-nav-item>
                    </nav>
                </div>`,
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        }
    }
});

Vue.component('profile', {
    template: ` <div>
                    <p style="color:white">Estas logueado</p>
                </div>`, 
    

});

Vue.component('daily', {
    template: ` <div>
                    <p style="color:white">Esta es la partida diaria</p>
                </div>`, 
    

});

Vue.component('login', {
    template:`
        <div>
            <div v-show="!logged">
                <b-form-input v-model="form.username" placeholder="Username" required></b-form-input>
                <b-form-input v-model="form.password" placeholder="Password" required></b-form-input>
                <b-button @click="submitLogin">Log In</b-button>
            </div>

            <div v-show="logged">
                Estás logueado como: {{infoLogin.name}}
            </div>  
        </div>`,

    data: function(){
        return{
            form: {
                username: '',
                password: ''
            },
            infoLogin:{
                name:'',
                idUser:'',
            },
            
            logged: false,
        }
    },
    methods: {
        submitLogin: function(){
            //AQUI VA EL FETCH PARA EL BACK PARA QUE VALIDE LOS DATOS
        }
    }
        
});


Vue.component('ranking', {
    data: function () {
        return {
            players: [],
        }
    },
    methods: {

    },
    mounted() {

        fetch('../trivial5/public/ranking')
        .then(res => res.json())
        .then(data => {
            console.log("length " + data.length);
            for (let i = 0; i < data.length; i++) {
                console.log("Ranking " + data[i].name);
                this.players.push(data[i]);
                
            }
            console.log(JSON.stringify(this.players));
        });
    },
    template: ` <div class="ranking__list">
                    <b-row class="mb-3">
                        <b-col cols="1" md="3" class="p-3 ranking__text"></b-col>
                        <b-col cols="2" md="3" class="p-3 ranking__text">Rank</b-col>
                        <b-col cols="5" md="3" class="p-3 ranking__text">Name</b-col>
                        <b-col cols="4" md="3" class="p-3 ranking__text">Score</b-col>
                    </b-row>
                    <b-list-group v-for="(player, index) in this.players">
                        <b-row class="mb-3">
                            <b-col cols="1" md="3" class="p-3 ranking__text"></b-col>
                            <b-col cols="2" md="3" class="p-3 ranking__text">{{index + 1}}</b-col>
                            <b-col cols="5" md="3" class="p-3 ranking__text">{{player.name}}</b-col>
                            <b-col cols="4" md="3" class="p-3 ranking__text">{{player.total_score}}</b-col>
                        </b-row>
                    </b-list-group>
                </div>`,
})



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
                    <br>
                    <h1>Your result is {{correctAnswers}}/{{results.length}}</h1>
                    <h1 v-show="this.isLogged">Time: {{this.timer}} Puntuacion: {{this.points}}</h1>
                </div>`,
    methods: {
        calcularPuntuacion: function() {
            this.points = (this.correctAnswers * 100) + this.timer;
        },
    },
    mounted() {
        for (let i = 0; i < this.results.length; i++) {
            if(this.results[i]){
                this.correctAnswers++;
            }
        }

        this.timer = this.timerRestante;
        this.calcularPuntuacion();

        if(this.isLogged) {
            this.$emit('saveData', this.points);
        }

    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        }
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
                    class="mb-2 question__card"
                    >
                        <br>
                        <div class="game__buttons_selection">
                            <b-row>
                                <b-col lg="6" class="pb-2">
                                    <button v-if="isLogged" @click="getAnswerUser(0)" class="respuestas__body" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(0), respuesta__incorrecta: comprobarRespuestaIncorrecta(0)  }">{{ this.arrayAnswersDesordenada[0].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(0)" class="respuestas__body">{{ this.arrayAnswersDesordenada[0].answer }}</button>
                                </b-col>
                                <b-col lg="6" class="pb-2">
                                    <button v-if="isLogged" @click="getAnswerUser(1)" class="respuestas__body" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(1), respuesta__incorrecta: comprobarRespuestaIncorrecta(1) }">{{ this.arrayAnswersDesordenada[1].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(1)" class="respuestas__body">{{ this.arrayAnswersDesordenada[1].answer }}</button>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col lg="6" class="pb-2">
                                    <button v-if="isLogged" @click="getAnswerUser(2)" class="respuestas__body" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(2), respuesta__incorrecta: comprobarRespuestaIncorrecta(2) }">{{ this.arrayAnswersDesordenada[2].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(2)" class="respuestas__body">{{ this.arrayAnswersDesordenada[2].answer }}</button>
                                </b-col>
                                <b-col lg="6" class="pb-2">
                                    <button v-if="isLogged" @click="getAnswerUser(3)" class="respuestas__body" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(3), respuesta__incorrecta: comprobarRespuestaIncorrecta(3) }">{{ this.arrayAnswersDesordenada[3].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(3)" class="respuestas__body">{{ this.arrayAnswersDesordenada[3].answer }}</button>
                                </b-col>
                            </b-row>
                        </div>
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
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        }
    }
});

Vue.component('game' , {
    data: function () {
        return {
            showButtonPlay: true,
            showButtonDaily: true,
            questions: [],
            idGame: null,
            selectedDifficulty: "",
            selectedCategory: "",
            showQuestions: null,
            showResults: null,
            actualQuestion: 0,
            timer: 150,
            userAnswers: [null, null, null, null, null, null, null, null, null, null]
        }
    },

    template: ` <div class="container_button_play" >
                    <div v-if="showButtonPlay" class="div_button_play">
                        <b-button v-b-modal="'modalSelectGame'" class="button__daily">DAILY</b-button>
                        <br>
                        <br>
                        <b-button v-b-modal="'modalSelectGame'" class="button__play">PLAY</b-button>
                    </div>
                    <b-modal v-if="isLogged" id="modalSelectGame" title="Select your game mode" hide-footer class="game__modal">
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
                    
                    <b-modal v-if="!isLogged" id="modalSelectGame" title="Select a DEMO" hide-footer>
                        <br>
                        <b-row>
                            <b-col cols="8" sm="6">DEMO 1</b-col>
                            <b-col cols="4" sm="6"><b-button @click="createGame(0)">PLAY</b-button></b-col>
                        </b-row>
                        <br>
                        <b-row>
                            <b-col cols="8" sm="6">DEMO 2</b-col>
                            <b-col cols="4" sm="6"><b-button @click="createGame(1)">PLAY</b-button></b-col>
                        </b-row>
                        <br>
                        <b-row>
                            <b-col cols="8" sm="6">DEMO 3</b-col>
                            <b-col cols="4" sm="6"><b-button @click="createGame(2)">PLAY</b-button></b-col>
                        </b-row>
                        <br>
                        <b-row>
                            <b-col cols="8" sm="6">DEMO 4</b-col>
                            <b-col cols="4" sm="6"><b-button @click="createGame(3)">PLAY</b-button></b-col>
                        </b-row>
                        <br>
                        <b-row>
                            <b-col cols="8" sm="6">DEMO 5</b-col>
                            <b-col cols="4" sm="6"><b-button @click="createGame(4)">PLAY</b-button></b-col>
                        </b-row>
                    </b-modal>

                    <div v-if="showQuestions" v-for="(question, index) in this.questions">
                        <question v-show="actualQuestion == index":infoQuestion="question" @userAnswer="addUserAnswer">
                        <br><br>
                        <div v-for="(answer, index) in userAnswers" class="respuestas__footer">
                            <div v-if="isLogged" v-bind:class="{ respuesta__correcta:  comprobarRespuestaCorrecta(index), respuesta__incorrecta: comprobarRespuestaIncorrecta(index)}">{{index+1}}</div>
                        </div>
                        <br><br>
                        <h3>Timer: {{timer}}</h3>
                        </question>
                    </div>
                    <div v-if="showQuestions">
                        
                    </div>
                    <div v-if="showResults">
                        <results :results=userAnswers :timerRestante=timer @saveData="saveData"></results>
                    </div>
                </div>`,
    methods: {
        createGame: function(id) {
            this.showButtonPlay = false;
            this.showButtonDaily = false;
            let rutaFetch = "";
            if(this.isLogged){
                rutaFetch = "https://the-trivia-api.com/api/questions?categories="+ this.selectedCategory +"&limit=10&region=ES&difficulty=" + this.selectedDifficulty;
            }
            else {
                console.log(id);
                rutaFetch = "../trivial5/public/demo/{"+id+"}";
            }

        
            console.log(rutaFetch);
            fetch(rutaFetch)
            .then(res => res.json())
            .then(data => {
                this.questions = data;
                this.showQuestions = true;
                console.log(this.questions[0]);
                this.$bvModal.hide("modalSelectGame");
                this.countDownTimer();
                if(this.isLogged){
                    this.saveGame();
                }
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
            if(this.isLogged){
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
            }
            else {
                setTimeout(() => {
                    this.incrementQuestion();
                }, "500");
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
        saveData: function(points) {
            
            console.log("guardarPuntuacion");

            let dateNow = new Date();
            let day = dateNow.getDate();
            let month = dateNow.getMonth()+1;
            let year = dateNow.getFullYear();
            let date = day+"/"+month+"/"+year;
            let dataResults = new FormData();
            dataResults.append('idGame', this.idGame);
            // dataResults.append('idUser', userLogged.loginInfo.idUser);
            dataResults.append('idUser', 1);
            dataResults.append('score', points);
            dataResults.append('date', dateNow);
            dataResults.append('date', date);
            fetch('../trivial5/public/saveresult', {
                method: 'POST',
                body: dataResults
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });

        },
        saveGame: function() {

            let dateNow = new Date();
            let dataGame = new FormData();
            dataGame.append('data', JSON.stringify(this.questions));
            dataGame.append('category', this.selectedCategory);
            dataGame.append('difficulty', this.selectedDifficulty);
            dataGame.append('type', 'normal_game');
            dataGame.append('date', dateNow);
            fetch('../trivial5/public/savegame', {
                method: 'POST',
                body: dataGame
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.idGame = data;
            });

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
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        }
    }
 
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
    template: `<profile></profile>`,
}

const Ranking = {
    template: `<ranking></ranking>`,
}

const Login = {
    template: `<login></login>`,
}

const Daily = {
    template:`<daily></daily>`
}

// 2. Define some routes
// Each route should map to a component.
const routes = [{
    path: '/',
    component: Game
}, {
    path: '/profile',
    component: Perfil
},
{
    path: '/ranking',
    component: Ranking
},
{
    path: '/login',
    component: Login
},
{
    path: '/dailyGame',
    component: Daily
}, ]

// 3. Create the router instance and pass the `routes` option
const router = new VueRouter({
    routes // short for `routes: routes`
})

const userStore = Pinia.defineStore('usuario', {
    state() {
        return {
            logged: true,
            loginInfo: {
                success: true,
                nombre: 'Nombre del almacen',
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
