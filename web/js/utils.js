/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

Vue.component('routes', {
    template: ` <div class="nav-container">
                    <nav class="navbar">
                        <b-nav-item v-show="this.isLogged" to="/ranking">Ranking</b-nav-item>
                        <b-nav-item active to="/">Play</b-nav-item>
                        <b-nav-item active to="/start">Start</b-nav-item>
                        <b-nav-item v-show="this.isLogged" to="/profile">Profile</b-nav-item>
                        <b-nav-item v-show="!this.isLogged" to="/join">Login</b-nav-item>
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

Vue.component('record', {
    data: function(){
        return{
            gamesPlayed: [],
        }
    },
    template: ` <div class="nav-container">
                    <div v-for="(game, index) in gamesPlayed">
                        <b-card class="mb-3">
                            <b-card-text class="fa fa-trophy"  style="font-size:56px; float:left" ></b-card-text>
                            <b-card-text>
                                {{game.idUser}}
                            </b-card-text>
                        </b-card>
                    
                    </div>
                </div>`,
    methods: {
        
    },
    mounted() {
        console.log("hola id " + this.userLogged.idUser);
        fetch("../trivial5/public/record/"+ this.userLogged.idUser +"")
            .then(res => res.json())
            .then(data => {
                console.log("json" + data);
                this.gamesPlayed = data;
        });
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
    },
});

Vue.component('challenges', {
    template: ` <div class="nav-container">
                    <b-card>
                        <b-card-text>
                            challenges
                        </b-card-text>

                        <b-button href="#" variant="primary">Go somewhere</b-button>
                    </b-card>
                </div>`,
    methods: {
    }
});

Vue.component('list_friends', {
    data: function(){
        return{
            friends: [],
            withFriends: false,
        }
    },
    template:`  <div class="nav-container">
                    <div v-if="withFriends === true" v-for="(friend, index) in friends">
                        <b-card class="mb-3">
                            <b-card-text>
                                <RouterLink :to="'/profile/'+friend.id"> {{friend.name}} </RouterLink>
                                <b-button variant="danger" @click="deleteFriend">Delete</b-button>
                            </b-card-text>
                        </b-card>
                    </div>
                    <div v-if="withFriends === false">
                        <b-card class="mb-3">
                            <b-card-text>
                                No friends
                            </b-card-text>
                        </b-card>
                    </div>
                </div>`,
    // methods: {
        // showUser(userId){
        //     fetch('../trivial5/public/indexPerfil/'+this.friend.id)
        //     .then(res=>res.json())
        //     .then(data=>{
        //         console.log(data);
                
        //     })
        // }
    // },
    beforeMount() {
        fetch('../trivial5/public/listfriends/' + userStore().loginInfo.idUser,{
            headers:{"Accept":"application/json"},
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data != "sin amigos") {
                console.log("tiene amigos");
                this.friends = data;
                this.withFriends = true;
            }else{
                this.withFriends = false;
                console.log(this.withFriends);
            }
        }); 
    }

});

Vue.component('pending_requests', {
    data: function(){
        return{
            requests: [],
            withRequests: false,
        }
    },
    template:`  <div class="nav-container">
                    <div v-if="withRequests" v-for="(request, index) in requests">
                        <b-card class="mb-3">
                            <b-card-text>
                                {{request.name}} 
                                <i class="fa fa-times-circle" style="font-size:24px;color:red" @click="changeStatusRequest('rejected', request.idUserRequest)"></i> 
                                <i class="fa fa-check-circle" style="font-size:24px;color:green" @click="changeStatusRequest('accepted', request.idUserRequest)"></i>
                            </b-card-text>
                            
                        </b-card>
                    </div>
                    <div v-if="!withRequests">
                        <b-card class="mb-3">
                            <b-card-text>
                                No pending requests
                            </b-card-text>
                        </b-card>
                    </div>
                </div>`,
    methods: {
        changeStatusRequest: function (status, idUserRequested) {

            console.log(status + " " + idUserRequested);
            console.log("entra fetch");
            changeRequestStatus = new FormData();
            changeRequestStatus.append('idUserRequested', userStore().loginInfo.idUser);
            changeRequestStatus.append('idUserRequest', idUserRequested);
            changeRequestStatus.append('status', status);

            fetch('../trivial5/public/changerequeststatus', {
                method: 'POST',
                headers: {"Accept": "application/json"},
                body: changeRequestStatus
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let borrar = 0;
                for (let i = 0; i < this.requests.length; i++) {
                    console.log(this.requests[i].idUserRequested + " idUserRequested");
                    if(this.requests[i].idUserRequested == idUserRequested) {
                        borrar = i;
                    }
                }
                console.log("antes de " + borrar + " " + this.requests);
                this.requests.splice(borrar, 1); 
                console.log("despues de " + borrar + " " + this.requests);
            }); 

        },
    },
    beforeMount() {
        fetch('../trivial5/public/pendingrequest/' + userStore().loginInfo.idUser)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data != "no existing requests") {
                this.requests = data;
                console.log("hay peticiones")
                this.withRequests = true;
            }
            else {
                console.log("no hay peticiones")
                this.withRequests = false;
            }
            
        }); 
    }

});

Vue.component('send_friend_request', {
    data: function(){
        return{
            email: "",
            mailValido: true,
            mssgIncorrecto: "",
            sendRequestAccepted: 2,
            emailRegex: new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
        }
    },
    //hacer verificacion mail para agregar
    template: ` <div class="nav-container">
                    <br>
                    
                    <b-input-group class="mt-3">
                        <b-form-input placeholder="Write your friend Email" v-model="email"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="danger" @click="validarEmail">Send</b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <p v-if="!mailValido" style="color:red;">*Email address incorrect</p>
                    <p v-if="sendRequestAccepted == 0" style="color:red;">*{{mssgIncorrecto}}</p>
                    <p v-if="sendRequestAccepted == 1" style="color:green;">Friend request correctly sent</p>
                </div>`,
    methods: {
        validarEmail: function() {

            if(this.emailRegex.test(this.email)) {
                this.mailValido = true;
                this.sendRequest();
            }
            else {
                this.mailValido = false;
            }
            
        },
        sendRequest: function() {
                        
            //hacer fetch al back enviandole el email para que se cree la peticion

            friendRequest = new FormData();
            friendRequest.append('id', userStore().loginInfo.idUser);
            friendRequest.append('email', this.email);

            fetch('../trivial5/public/sendfriend', {
                method: 'POST',
                headers: {"Accept": "application/json"},
                body: friendRequest
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.data);
                this.sendRequestAccepted = data.data;
                this.mssgIncorrecto = data.message;

                console.log("accepted " +this.sendRequestAccepted );
            }); 

        }
    }
});

Vue.component('friends', {
    template: ` <div class="nav-container">
                    <b-tabs content-class="mt-3" align="center" active-nav-item-class="font-weight-bold text-danger">
                        <b-tab title="List" active><list_friends></list_friends></b-tab>
                        <b-tab title="Send"><send_friend_request></send_friend_request></b-tab>
                        <b-tab title="Pending"><pending_requests></pending_requests></b-tab>
                    </b-tabs>
                </div>`,
    methods: {
    }
});

Vue.component('profile', {
    data: function(){
        return{
        }
    },
    template: ` <div v-show="this.isLogged">
                    <p style="color:white">Estas logueado</p>
                    <b-button @click="logoutUser">Logout</b-button>
                    <b-button @click="editProfile">Edit my profile</b-button>
                    <b-tabs content-class="mt-3" align="center" active-nav-item-class="font-weight-bold text-danger">
                        <b-tab title="Record" active><record :games=this.record></record></b-tab>
                        <b-tab title="Challenges"><challenges></challenges></b-tab>
                        <b-tab title="Friends"><friends></friends></b-tab>
                    </b-tabs>
                </div>`, 
    methods: {
        logoutUser: function() {
            userStore().logged = false;
        },
        editProfile:function(){}
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
    },
    mounted() {
       
        // let userStatistics = new CharacterData("userStatistics",{
        //     type:'doughnut',
        //     data:statisticsData,
        //     options:{}
        // })
        // router.push("/");
                
    },
});

Vue.component('daily', {
    template: ` <div>
                    <p style="color:white">Esta es la partida diaria</p>
                </div>`, 
});

Vue.component('start', {
    template: ` <div>
                    <h1 class="start__tituloPrincipal"> <br> League <br> of <br> Trivial</h1>
                </div>`, 
});

Vue.component('join', {
    template: ` <div class="nav-container">
                    <br><br>
                    <b-tabs pills cardcontent-class="mt-3" align="center">
                        <b-tab title="Login" active active title-item-class="w-25 login__tab"><br><login></login></b-tab>
                        <b-tab title="Register" title-item-class="w-25 register__tab"><br><register></register></b-tab>
                    </b-tabs>
                </div>`,
})

Vue.component('register', {
    data: function(){
        return{
            form: {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
            registerCorrect: false,
            everythingValids: false,
            fetchReceivedMessage:"",
            emailRegex : new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}'),
        }
    },
    template:`
            <div>
                <br>
                <h1 style="color:white; text-align:center">Register</h1>
                <br>
                <b-input-group class="mb-2" size="sm">
                    <b-input-group-prepend is-text>
                        <b-icon icon="person-fill"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input class="form__control" v-model="form.username" placeholder="Username" required></b-form-input>
                </b-input-group>
                <p v-if = "form.username === ''" class="errorsFields">Username{{form.username}} null</p>
                
                <b-input-group class="mb-2" size="sm">
                    <b-input-group-prepend is-text>
                        <b-icon icon="envelope"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input class="form__control" v-model="form.email" placeholder="Email" required></b-form-input>
                </b-input-group>
                <p v-if = "form.email === ''" class="errorsFields">Email{{form.email}} null</p>
                <p v-if = "(this.emailRegex.test(form.email)) === false" class="errorsFields">Email should contains @ with a domain </p>
                
                <b-input-group class="mb-2" size="sm">
                    <b-input-group-prepend is-text>
                        <b-icon icon="lock"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input type="password" class="form__control" v-model="form.password" placeholder="Password" required></b-form-input>
                </b-input-group>
                <p v-if = "form.password === ''" class="errorsFields">Password{{form.password}} null</p>
                
                <b-input-group class="mb-2" size="sm">
                    <b-input-group-prepend is-text>
                        <b-icon icon="shield-lock"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input type="password" class="form__control" v-model="form.confirmPassword" placeholder="Comfirm password" required></b-form-input>
                </b-input-group>

                <p v-if = "form.confirmPassword ===''" class="errorsFields">Paswword confirmation  null</p>
                <p v-if = "form.confirmPassword !== form.password" class="errorsFields">Confirm password is not the same as password</p>
                <br>
                <b-button @click="submitRegister">Register</b-button>

                <p v-if="this.registerCorrect === true"  style="color:green;">Thank you for your registration {{this.form.username}}</p>
                <p v-if="this.registerCorrect === false" style="color:red;">{{this.fetchReceivedMessage}}</p>
            </div>`
            ,
    methods: {
        submitRegister: function(){
            console.log("hola register");
            console.log("valido");
            let userRegister = new FormData();
            userRegister.append('name', this.form.username);
            userRegister.append('email', this.form.email);
            userRegister.append('password', this.form.password);
            userRegister.append('password_confirmation', this.form.confirmPassword);

            fetch('../trivial5/public/api/register2', {
                method: 'POST',
                headers: {"Accept": "application/json"},
                body: userRegister
            })
            .then(res=>res.json())
            .then(data=>{
                console.log(data.value);
                console.log(data.message);
                if(data.value == 1) {
                    this.fetchReceivedMessage = "";
                    this.registerCorrect = true;
                }
                else {
                    console.log("no deberia")
                    this.registerCorrect = false;
                    this.fetchReceivedMessage = "*" + data.message;
                }
                console.log(data.value);
                console.log(this.fetchReceivedMessage);
            });
            
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
        },

    },
});

Vue.component('login', {
    data: function(){
        return{
            form: {
                email: '',
                password: ''
            },
            emailRegex : new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}'),
            processing:false,
            credentialsIncorrect: false,
        }
    },
    template:`
        <div>
            <br>
            <h1 style="color:white; text-align:center">Log in</h1>
            <br>
            <b-input-group class="mb-2" size="sm">
                <b-input-group-prepend is-text>
                    <b-icon icon="envelope"></b-icon>
                </b-input-group-prepend>
                <b-form-input type="email" class="form__control" v-model="form.email" placeholder="Email" required></b-form-input>
            </b-input-group>

            <p v-if = "form.email === ''" class="errorsFields">Email{{form.email}} null</p>
            <p v-if = "(this.emailRegex.test(form.email)) === false" class="errorsFields">Email should contains @ with a domain </p>
            
            <b-input-group class="mb-2" size="sm">
                <b-input-group-prepend is-text>
                    <b-icon icon="lock"></b-icon>
                </b-input-group-prepend>
                <b-form-input type="password" class="form__control" v-model="form.password" placeholder="Password" required></b-form-input>
            </b-input-group>
            <p v-if = "form.password === ''" class="errorsFields">Password{{form.password}} null</p>
            <b-button @click="submitLogin">Join</b-button>
            <p v-if="credentialsIncorrect" style="color:red;">*Credentials incorrect</p>

        </div>`,
    methods: {
        submitLogin: function(){
            this.processing=true;
            if(this.form.email != '' && this.form.password != '' ) {
                console.log("valido");
                let userLogin = new FormData();
                userLogin.append('email', this.form.email);
                userLogin.append('password', this.form.password);

                fetch('../trivial5/public/api/login2', {
                    method: 'POST',
                    headers: {"Accept": "application/json"},
                    body: userLogin
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if(data.message == "Credentials valid"){
                        userStore().logged = true;
                        userStore().loginInfo.idUser = data.user_id;
                        userStore().loginInfo.nombre = data.username;
                        console.log("valid");
                        router.push("/")
                    }
                    else {
                        this.credentialsIncorrect = true;
                    }
                }); 
                console.log("fetch funciona");
            }else {
                console.log("falta algun campo por rellenar");
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
                    }
                }
            }
        }
    }
});

Vue.component('ranking', {

    template: ` <div class="nav-container">
                    <br><br>
                    <b-tabs pills cardcontent-class="mt-3" align="center">
                        <b-tab title="Global" active active title-item-class="w-25 login__tab"><globalranking></globalranking></b-tab>
                        <b-tab title="Daily" title-item-class="w-25 register__tab"><dailyranking></dailyranking></b-tab>
                    </b-tabs>
                </div>`,

});

Vue.component('dailyranking', {
    data: function () {
        return {
            players: [],
        }
    },
    mounted() {

        fetch('../trivial5/public/dailyranking')
        .then(res => res.json())
        .then(data => {
            console.log("length " + data);
            for (let i = 0; i < data.length; i++) {
                console.log("Ranking " + data[i].name);
                this.players.push(data[i]);
                
            }
            console.log(JSON.stringify(this.players));
        });
    },
    template: ` <div class="ranking__list">
                    <br>
                    <b-row class="mb-3">
                        <b-col cols="1" md="3" class="p-3 ranking__text"></b-col>
                        <b-col cols="2" md="3" class="p-3 ranking__text">Rank</b-col>
                        <b-col cols="5" md="3" class="p-3 ranking__text">Name</b-col>
                        <b-col cols="4" md="3" class="p-3 ranking__text">Score</b-col>
                    </b-row>
                    <b-row class="mb-3" v-for="(player, index) in this.players">
                        <b-col cols="1" md="3" class="p-3 ranking__text"></b-col>
                        <b-col cols="2" md="3" class="p-3 ranking__text">{{index + 1}}</b-col>
                        <b-col cols="5" md="3" class="p-3 ranking__text">{{player.name}}</b-col>
                        <b-col cols="4" md="3" class="p-3 ranking__text">{{player.score}}</b-col>
                    </b-row>
                </div>`,
});

Vue.component('globalranking', {
    data: function () {
        return {
            players: [],
        }
    },
    mounted() {

        fetch('../trivial5/public/rankingglobal')
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
                    <br>
                    <b-row class="mb-3">
                        <b-col cols="1" md="3" class="p-3 ranking__text"></b-col>
                        <b-col cols="2" md="3" class="p-3 ranking__text">Rank</b-col>
                        <b-col cols="5" md="3" class="p-3 ranking__text">Name</b-col>
                        <b-col cols="4" md="3" class="p-3 ranking__text">Score</b-col>
                    </b-row>
                    <b-row class="mb-3" v-for="(player, index) in this.players">
                        <b-col cols="1" md="3" class="p-3 ranking__text"></b-col>
                        <b-col cols="2" md="3" class="p-3 ranking__text">{{index + 1}}</b-col>
                        <b-col cols="5" md="3" class="p-3 ranking__text">{{player.name}}</b-col>
                        <b-col cols="4" md="3" class="p-3 ranking__text">{{player.total_score}}</b-col>
                    </b-row>
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
    props: ['results', 'timerRestante', 'difficulty', 'daily'],
    template: ` <div class="game__result">
                    <br>
                    <h1>Your result is {{correctAnswers}}/{{results.length}}</h1>
                    <h1 v-show="this.isLogged">Time: {{this.timer}} Puntuacion: {{this.points}}</h1>
                    <b-button to="/start">Lobby</b-button>
                    <b-button v-if="!daily" @click="$emit('playagain')">Play again</b-button>
                </div>`,
    methods: {
        calcularPuntuacion: function() {
            this.points = (this.correctAnswers * 100) + this.timer;
            if(this.difficulty == 'medium') {
                this.points = this.points * 2;
            }
            else if (this.difficulty == 'hard'){
                this.points = this.points * 3;
            }
            else {
                console.log('level easy');
            }
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
        console.log("hola" + this.infoQuestion);
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
        // console.log(this.arrayAnswersDesordenada[0].answer);
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
            showButtonDaily: false,
            questions: [],
            daily: false,
            idGame: null,
            selectedDifficulty: "",
            selectedCategory: "",
            showQuestions: null,
            showResults: null,
            actualQuestion: 0,
            timer: 150,
            userAnswers: [null, null, null, null, null, null, null, null, null, null],
            boxTwo: ''
        }
    },

    template: ` <div class="container_button_play" >
                    <div v-if="showButtonPlay" class="div_button_play">
                        
                        <br>
                        <br>
                        <b-button v-b-modal="'modalSelectGame'" class="button__play"><span>PLAY</span></b-button>
                        <br>
                        <br>
                        <div style="color:white;">
                            <b-button v-if="isLogged && showButtonDaily" class="button__daily" @click="playDaily">DAILY</b-button>
                            <div class="mb-1" v-if="!isLogged">
                                <b-button @click="desplegarModalLogin">DAILY GAME</b-button> 
                            </div>
                            
                        </div>
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
                        <question v-show="actualQuestion == index" :infoQuestion="question" @userAnswer="addUserAnswer">
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
                        <results :results=userAnswers :timerRestante=timer :daily=daily :difficulty=selectedDifficulty @saveData="updateScore" @playagain="playagain"></results>
                    </div>
                </div>`,
    methods: {
        createGame: function(id) {
            this.showButtonPlay = false;
            this.showButtonDaily = false;
            let rutaFetch = "";
            if(!this.daily){
                if(this.isLogged){
                    rutaFetch = "https://the-trivia-api.com/api/questions?categories="+ this.selectedCategory +"&limit=10&region=ES&difficulty=" + this.selectedDifficulty;
                }
                else {
                    console.log(id);
                    rutaFetch = "../trivial5/public/demo/{"+id+"}";
                }
            }
            else {
                rutaFetch = "../trivial5/public/daily";
            }
            console.log(rutaFetch);
            fetch(rutaFetch)
            .then(res => res.json())
            .then(data => {
                if(this.daily) {
                    console.log(data);
                    this.questions = JSON.parse(data.data);
                    this.idGame = data.id;
                    this.selectedDifficulty = data.difficulty;
                    this.selectedCategory = data.category;
                    this.saveData(-300);
                }
                else {
                    this.questions = data;
                    this.$bvModal.hide("modalSelectGame");
                }
                this.showQuestions = true;
                this.countDownTimer();
                if(this.isLogged && !this.daily){
                    this.saveGame();
                }
            });
        },
        playagain: function() {
            this.$bvModal.show("modalSelectGame");
            this.idGame = null;
            this.selectedDifficulty = "";
            this.selectedCategory = "";
            this.showQuestions = null;
            this.showResults = null;
            this.actualQuestion = 0;
            this.timer = 150;
            this.userAnswers = [null, null, null, null, null, null, null, null, null, null];
            
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
        updateScore: function(points) {
            console.log("update score " + points);

            let dataResults = new FormData();
            dataResults.append('idGame', this.idGame);
            dataResults.append('idUser', this.userLogged.idUser);
            dataResults.append('score', points);
            fetch('../trivial5/public/updatescore', {
                method: 'POST',
                body: dataResults
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
        },
        saveData: function(points) {
            console.log("guardarPuntuacion " + points);
            let dateNow = new Date();
            let day = dateNow.getDate();
            let month = dateNow.getMonth()+1;
            let year = dateNow.getFullYear();
            let date = day+"/"+month+"/"+year;
            let dataResults = new FormData();
            dataResults.append('idGame', this.idGame);
            // dataResults.append('idUser', userLogged.loginInfo.idUser);
            dataResults.append('idUser', this.userLogged.idUser);
            dataResults.append('score', points);
            dataResults.append('date', date);
            fetch('../trivial5/public/saveresult', {
                method: 'POST',
                body: dataResults
            })
            .then(res => res.json())
            .then(data => {
                console.log("return " + data);
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
                this.saveData(-300);
            });
        },
        playDaily: function() {
          
            this.daily = true;

            this.createGame();
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

        desplegarModalLogin() {
            this.boxTwo = ''
            this.$bvModal.msgBoxConfirm('Esta funcionalidad solo está disponible si estás logueado. Quieres hacer log in?', {
              title: 'Advertencia',
              size: 'sm',
              buttonSize: 'sm',
              okVariant: 'success',
              okTitle: 'Login',
              cancelVariant: 'danger',
              cancelTitle: 'Cancelar',
              footerClass: 'p-2',
              hideHeaderClose: false,
              centered: true
            })
              .then(value => {
                this.boxTwo = router.push('/join');
              })
              .catch(err => {
                // An error occurred
              })
            // router.push("/login");

          }
    },
    beforeMount () {

        if(this.isLogged) {
            fetch("../trivial5/public/comprobardaily/"+ this.userLogged.idUser +"")
            .then(res => res.json())
            .then(data => {
                console.log("json" + data);
                if(data) {
                    this.showButtonDaily = false;
                }
                else {
                    this.showButtonDaily = true;
                }
                
             });
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

const Start = {
    template: `<start></start>`,
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
const Join = {
    template: `<join></join>`,
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
    path: '/join',
    component: Join
},
{
    path: '/start',
    component: Start
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
            logged: false,
            loginInfo: {
                nombre: '',
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
