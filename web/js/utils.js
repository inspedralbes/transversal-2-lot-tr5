/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const buttonAudio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
function play(){
    buttonAudio.play();
}

Vue.component('routes', {
    template: ` <div class="nav-container">
                    <b-nav class="navbar">
                        <b-nav-item v-show="this.isLogged" to="/ranking">Ranking</b-nav-item>
                        <b-nav-item active to="/">LOGO</b-nav-item>
                        <b-nav-item v-show="this.isLogged" :to="'/profile/' + this.userLogged.idUser">Profile</b-nav-item>
                        <b-nav-item v-show="!this.isLogged" to="/join">Login</b-nav-item>
                    </b-nav>
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
    props: ['id'],
    data: function(){
        return{
            gamesPlayed: [],
        }
    },
    template: ` <div class="nav-container">
                    <b-card header="Results" class="record__header">
                        <div v-for="(game, index) in gamesPlayed">
                            <b-card-text class="record_cardTexts">
                                Game: {{index+1}}
                                Difficulty: {{game.difficulty}}
                                Category: {{game.category}}
                                Score: {{game.score}}
                                <br>
                                Date: {{game.created_at}}
                                <b-button v-if="!this.id == this.userLogged.idUser" variant="success" @click="playChallenge(game.id)">Play same game</b-button>
                            </b-card-text>
                            <hr>
                        </div>
                    </b-card>
                </div>`,
    methods: {
        chargeRecord: function() {
            console.log("hola id " + this.id);
            fetch("../trivial5/public/record/"+ this.id +"")
                .then(res => res.json())
                .then(data => {
                    console.log("json" + data[0]);
                    console.log(data);
                    this.gamesPlayed = data;
            });
        },
        playChallenge: function(id) {
            userStore().idChallenge = id;
            userStore().playChallenge = true;

            router.push("/");
        }
    },
    mounted() {
       this.chargeRecord();
    },
    watch: {
        // whenever question changes, this function will run
        id(newID, oldID) {
          console.log("change id record");
          this.chargeRecord();
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
                        <b-card class="mb-3 friend__list">
                            <b-card-text class="friends__cardtext">
                                <b-avatar variant="primary" class="mr-3" size="4rem" src="https://placekitten.com/300/300"></b-avatar>
                                <RouterLink :to="'/profile/'+friend.id"> {{friend.name}} </RouterLink>
                                <b-button variant="danger" class="button__delete" @click="deleteFriend(friend.idUserRequested, friend.idUserRequest)">Delete</b-button>
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
    methods: {
        deleteFriend: function(idUserRequested, idUserRequest) {
            deleteF = new FormData();
            deleteF.append('idUserRequest', idUserRequest);
            deleteF.append('idUserRequested', idUserRequested);

            fetch('../trivial5/public/deletefriend', {
                method: 'POST',
                headers: {"Accept": "application/json"},
                body: deleteF
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let borrar = 0;
                for (let i = 0; i < this.friends.length; i++) {
                    console.log(this.friends[i].idUserRequested + " idUserRequested");
                    if(this.friends[i].idUserRequested == idUserRequested) {
                        borrar = i;
                    }
                }
                console.log("antes de " + borrar + " " + this.friends);
                this.friends.splice(borrar, 1); 
                console.log("despues de " + borrar + " " + this.friends);
            }); 
            
        }
        // showUser(userId){
        //     fetch('../trivial5/public/indexPerfil/'+this.friend.id)
        //     .then(res=>res.json())
        //     .then(data=>{
        //         console.log(data);
                
        //     })
        // }
    },
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
            infoUser: "",
            id: this.$route.params.id,
        }
    },
    template: ` <div v-show="this.isLogged">
                    <br>
                    <b-container class="bv-example-row">
                        <b-row>
                            <b-col><b-button to="/" class="profile__backButton"><b-icon icon="arrow-left"></b-icon></b-button></b-col>
                            <b-col><b-button @click="logoutUser" class="profile__logoutButton">Logout</b-button></b-col>
                        </b-row>
                    </b-container>
                    <br>
                    <div class="profile__div">
                        <div class="profile__picture">
                            <b-avatar badge-variant="info" badge-offset="-0.5em" size="6rem" src="https://placekitten.com/300/300">
                                <template #badge>
                                    <div class="profile__editOptions">
                                        <b-button @onclick="editProfile" class="rounded-circle profile__editButton" size="sm">
                                            <b-icon icon="pencil"></b-icon>
                                        </b-button>
                                    </div>
                                </template>
                            </b-avatar>
                        </div>
                        <br>
                        <p class="profile__userName">{{infoUser.name}}</p>
                        <p class="profile__userScore">Total Score -> {{infoUser.total_score}}</p>
                    </div>
                    <br>
                    <b-tabs pills card content-class="mt-3" align="center" active-nav-item-class="font-weight-bold text-danger">
                        <b-tab active >
                            <template slot="title">
                                <b-icon icon="trophy"></b-icon> Record
                            </template>
                            <record :id=this.id></record>
                        </b-tab>
                        <b-tab v-if="this.id == this.userLogged.idUser" >
                            <template slot="title">
                                <b-icon icon="award"></b-icon> Challenges
                            </template>
                            <challenges></challenges>
                        </b-tab>
                        <b-tab v-if="this.id == this.userLogged.idUser">
                            <template slot="title">
                                <b-icon icon="person-lines-fill"></b-icon> Friends
                            </template>
                            <friends></friends>
                        </b-tab>
                    </b-tabs>
                </div>`, 
    methods: {
        editProfile:function(){
            alert("edit clicked")
        },
        logoutUser: function() {
            userStore().logged = false;
        },
        chargeProfile: function() {
            console.log("id ruta " + this.$route.params.id + " | id " + this.id);

            this.id = this.$route.params.id;

            fetch('../trivial5/public/indexPerfil/' + this.id)
            .then(res=>res.json())
            .then(data=>{
                console.log(data[0]);
                this.infoUser = data[0];
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
    },
    // beforeUpdate() {
    //     console.log("id ruta update " + this.$route.params.id + " | id " + this.id);

    //     this.id = this.$route.params.id;

    //     fetch('../trivial5/public/indexPerfil/' + this.id)
    //     .then(res=>res.json())
    //     .then(data=>{
    //         console.log(data[0]);
    //         this.infoUser = data[0];
    //     });
    // },
    mounted() {

        this.chargeProfile();

        // console.log("id ruta " + this.$route.params.id + " | id " + this.id);

        // this.id = this.$route.params.id;

        // fetch('../trivial5/public/indexPerfil/' + this.id)
        // .then(res=>res.json())
        // .then(data=>{
        //     console.log(data[0]);
        //     this.infoUser = data[0];
        // });

       
        // let userStatistics = new CharacterData("userStatistics",{
        //     type:'doughnut',
        //     data:statisticsData,
        //     options:{}
        // })
        // router.push("/");
                
    },
    watch:{
        
        $route (to, from){
            console.log("ruta cambiada");
            this.chargeProfile();
            this.show = false;
        }
    },
});

Vue.component('user-profile', {
    data: function(){
        return{
            infoUser: "",
            id: this.$route.params.id,
        }
    },
    template: ` <div v-show="this.isLogged">
                    <br>
                    <b-container class="bv-example-row">
                        <b-row>
                            <b-col><b-button to="/" class="profile__backButton"><b-icon icon="arrow-left"></b-icon></b-button></b-col>
                            <b-col><b-button @click="logoutUser" class="profile__logoutButton">Logout</b-button></b-col>
                        </b-row>
                    </b-container>
                    <br>
                    <div class="profile__div">
                        <div class="profile__picture">
                            <b-avatar badge-variant="info" badge-offset="-0.5em" size="6rem" src="https://placekitten.com/300/300">
                                <template #badge>
                                    <div class="profile__editOptions">
                                        <b-button @onclick="editProfile" class="rounded-circle profile__editButton" size="sm">
                                            <b-icon icon="pencil"></b-icon>
                                        </b-button>
                                    </div>
                                </template>
                            </b-avatar>
                        </div>
                        <br>
                        <p class="profile__userName">{{infoUser.name}}</p>
                        <p class="profile__userScore">Total Score -> {{infoUser.total_score}}</p>
                    </div>
                    <br>
                    <b-tabs pills card content-class="mt-3" align="center" active-nav-item-class="font-weight-bold text-danger">
                        <b-tab active class="profile__tabsSelection">
                            <template slot="title">
                                <b-icon icon="trophy"></b-icon> Record
                            </template>
                            <record :id=this.id ></record>
                        </b-tab>
                    </b-tabs>
                </div>`, 
    methods: {
        editProfile:function(){
            alert("edit clicked")
        },
        logoutUser: function() {
            userStore().logged = false;
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
    },
    mounted() {

        fetch('../trivial5/public/indexPerfil/' + this.id)
        .then(res=>res.json())
        .then(data=>{
            console.log(data[0]);
            this.infoUser = data[0];
        });

       
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
                    <b-tabs pills card content-class="mt-3" align="center">
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
            fetchReceivedMessage:"",
            emailRegex : new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}'),
            validEmail:true,
            validUsername:true,
            validPassword:true,
            validConfirmPassword:true,
            samePassword:true
        }
    },
    template:`
            <div class="register__center">
                <div class="register__card">
                    <br><br><h3 class="form__title">Register</h3>
                    <div class="register__content">
                            <div class="register__innerContent">
                                <div @keyup.enter="submitRegister">
                                    <div class="input__field">
                                        <b-icon icon="person-fill" class="input__icon"></b-icon>
                                        <input type="text" class="input__text" v-model="form.username" placeholder="Username" required>
                                        <p v-if = "validUsername===false" class="errorsFields">*Username null</p>
                                    </div>
                                    
                                    <div class="input__field">
                                        <b-icon icon="envelope" class="input__icon"></b-icon>
                                        <input type="email" class="input__text" v-model="form.email" placeholder="Email" required></input>
                                        <p v-if = "validEmail===false" class="errorsFields">*Email should contains @ with a domain</p>
                                    </div>
                                    
                                    <div class="input__field">
                                        <b-icon icon="lock" class="input__icon"></b-icon>
                                        <input type="password" class="input__text" v-model="form.password" placeholder="Password" required></input>
                                        <p v-if = "validPassword===false" class="errorsFields">*Password null</p>
                                    </div>
                                    
                                    <div class="input__field">
                                        <b-icon icon="shield-lock" class="input__icon"></b-icon>
                                        <input type="password" class="input__text" v-model="form.confirmPassword" placeholder="Comfirm password" required></input>
                                        <p v-if = "validConfirmPassword === false" class="errorsFields">*Pasword confirmation null</p><br>
                                        <p v-if = "samePassword ===false" class="errorsFields">*Confirm password is not the same as password</p>
                                    </div>

                                    <b-button @click="everythingValids" class="register__button">Register <b-icon icon="arrow-right"></b-icon></b-button><br><br>

                                    <p v-if="this.registerCorrect === true"  style="color:green;">Thank you for your registration {{this.form.username}}</p>
                                    <p v-if="this.registerCorrect === false" style="color:red;">{{this.fetchReceivedMessage}}</p>
                                </div>
                            </div>
                    </div>
                </div>
                
            </div>`
            ,
    methods: {
        everythingValids:function(){
            this.emailRegex.test(this.form.email)?this.validEmail = true:this.validEmail=false;
            this.form.username!=""?this.validUsername=true:this.validUsername=false;
            this.form.password != ""?this.validPassword=true:this.validPassword=false;
            this.form.confirmPassword != ""?this.validConfirmPassword = true:this.validConfirmPassword=false;
            this.form.confirmPassword === this.form.password?this.samePassword=true:this.samePassword=false;
            if(this.validEmail==true&&this.validUsername==true&&this.validPassword==true&&this.validConfirmPassword == true&&this.samePassoword==true){
                this.submitRegister();
            }
        },
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
            validLoginEmail:true,
            validLoginEmailDomain:true,
            validLoginPassword:true,
        }
    },
    template:`
        <div class="register__center">
            <div class="register__card">
                <br><br><h3 class="form__title">Log in</h3>
                <div class="register__content">
                    <div class="register__innerContent">
                        <div @keyup.enter="submitLogin">
                            <div class="input__field">
                                    <b-icon icon="envelope" class="input__icon"></b-icon>
                                <input type="email" class="input__text" v-model="form.email" placeholder="Email" required></input>
                                <p v-if = "validLoginEmail===false" class="errorsFields">Email null</p>
                                <p v-if = "validLoginEmailDomain===false" class="errorsFields">Email should contains @ with a domain </p>
                            </div>
                            
                            <div class="input__field">
                                    <b-icon icon="lock" class="input__icon"></b-icon>
                                <input type="password" class="input__text" v-model="form.password" placeholder="Password" required></input>
                                <p v-if = "validLoginPassword===false" class="errorsFields">Password null</p>
                            </div>
                        </div>
                        <b-button @click="loginValidation" class="login__button">Join <b-icon icon="arrow-right"></b-icon></b-button><br><br>
                        <p v-if="credentialsIncorrect" style="color:red;">*Credentials incorrect</p>
                    </div>
                </div>
            </div>
        </div>`,
    methods: {
        loginValidation:function(){
            this.emailRegex.test(this.form.email)?this.validLoginEmailDomain = true:this.validLoginEmailDomain=false;
            this.form.email!=""?this.validLoginEmail=true:this.validLoginEmail=false;
            this.form.password != ""?this.validLoginPassword=true:this.validLoginPassword=false;
            if(this.validLoginEmailDomain==true&&this.validLoginEmail==true&&this.validLoginPassword==true){
                this.submitLogin();
            }
        },
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
                    <b-tabs pills cardcontent-class="mt-3" active-nav-item-class="font-weight-bold text-danger">
                        <b-tab title="Global" active active title-item-class="w-50 login__tab"><globalranking></globalranking></b-tab>
                        <b-tab title="Daily" title-item-class="w-50 register__tab"><dailyranking></dailyranking></b-tab>
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
                    <div class="text-center">
                        <div class="ranking__content">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                    <tr v-for="(player, index) in this.players">
                                        <td>{{index + 1}}</td>
                                        <td><RouterLink :to="'/profile/'+player.id"> {{player.name}}</RouterLink></td>
                                        <td>{{player.score}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
                    <div class="text-center">
                        <div class="ranking__content">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                    <tr v-for="(player, index) in this.players">
                                        <td>{{index + 1}}</td>
                                        <td><RouterLink :to="'/profile/'+player.id"> {{player.name}}</RouterLink></td>
                                        <td>{{player.total_score}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
                    <h1 class="game__resultLetter">Your result is {{correctAnswers}}/{{results.length}}</h1>
                    <h1 v-show="this.isLogged" class="game__resultLetter">Time: {{this.timer}} Puntuacion: {{this.points}}</h1>
                    <b-button to="/">Lobby</b-button>
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
    template: ` <div class="game__card">
                    <h3></h3>
                    <b-card
                    :title=infoQuestion.question
                    class="mb-2 game__card"
                    >
                        <hr><br>
                        <div>
                            <b-row>
                                <b-col lg="6" class="pb-3" ml="10">
                                    <button v-if="isLogged" @click="getAnswerUser(0)" class="game__buttons_selection" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(0), game__answerIncorrect: comprobarRespuestaIncorrecta(0)  }">{{ this.arrayAnswersDesordenada[0].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(0)" class="game__buttons_selection">{{ this.arrayAnswersDesordenada[0].answer }}</button>
                                </b-col>
                                <b-col lg="6" class="pb-3" ml="10">
                                    <button v-if="isLogged" @click="getAnswerUser(1)" class="game__buttons_selection" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(1), game__answerIncorrect: comprobarRespuestaIncorrecta(1) }">{{ this.arrayAnswersDesordenada[1].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(1)" class="game__buttons_selection">{{ this.arrayAnswersDesordenada[1].answer }}</button>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col lg="6" class="pb-3" ml="10">
                                    <button v-if="isLogged" @click="getAnswerUser(2)" class="game__buttons_selection" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(2), game__answerIncorrect: comprobarRespuestaIncorrecta(2) }">{{ this.arrayAnswersDesordenada[2].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(2)" class="game__buttons_selection">{{ this.arrayAnswersDesordenada[2].answer }}</button>
                                </b-col>
                                <b-col lg="6" class="pb-3" ml="10">
                                    <button v-if="isLogged" @click="getAnswerUser(3)" class="game__buttons_selection" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(3), game__answerIncorrect: comprobarRespuestaIncorrecta(3) }">{{ this.arrayAnswersDesordenada[3].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(3)" class="game__buttons_selection">{{ this.arrayAnswersDesordenada[3].answer }}</button>
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
            selectedDifficulty: "easy",
            selectedCategory: "arts_and_literature",
            showQuestions: null,
            showResults: null,
            actualQuestion: 0,
            timer: 150,
            userAnswers: [null, null, null, null, null, null, null, null, null, null],
            boxTwo: '',
            page: 0,
        }
    },

    template: ` <div class="container_button_play" >
                    <div v-if="this.page == 0">
                        <div>
                            <img src="img/winner.png" style="width: 100%;height: 100%;"></img>
                        </div>
                        <div v-if="showButtonPlay" class="div_button_play">
                            <div class="start__tituloDiv">
                                <h4>WELCOME TO</h4>
                                <h1 class="start__tituloPrincipal"> LEAGUE OF <br> TRIVIAL</h1>
                            </div>
                            <b-button @click="playButton" class="button__play"><span>PLAY</span></b-button>
                            <b-button v-if="isLogged && showButtonDaily" class="start__buttonDaily" @click="playDaily">DAILY</b-button><br>
                            <div class="mb-1" v-if="!isLogged">
                                <br><b-button @click="desplegarModalLogin" class="start__dailyGameButton">DAILY GAME</b-button> 
                            </div>
                        </div>
                    </div>
                    <div v-if="this.page == 1">
                        <p style="color: white;">Select difficulty</p>
                        <b-button @click="changeDifficulty('easy')">Easy</b-button>
                        <b-button @click="changeDifficulty('medium')">Medium</b-button>
                        <b-button @click="changeDifficulty('hard')">Hard</b-button>

                        <p style="color: white;">Select category</p>

                        <b-row class="justify-content-md-center">
                            <b-col cols="2"><b-button @click="changeCategory('arts_and_literature')">🎨Arts & Literature</b-button></b-col>
                            <b-col cols="2"><b-button @click="changeCategory('film_and_tv')">🎞️Film & TV</b-button></b-col>
                            <b-col cols="2"><b-button @click="changeCategory('food_and_drink')">🥘Food & Drink</b-button></b-col></b-col>
                            <b-col cols="2"><b-button @click="changeCategory('general_knowledge')">🤓General Knowledge</b-button></b-col></b-col>
                            <b-col cols="2"><b-button @click="changeCategory('geography')">🗺️Geography</b-button></b-col></b-col>
                        </b-row>
                        <b-row class="justify-content-md-center">
                            <b-col cols="2"><b-button @click="changeCategory('history')">📜History</b-button></b-col></b-col>
                            <b-col cols="2"><b-button @click="changeCategory('music')">🎼Music</b-button></b-col></b-col>
                            <b-col cols="2"><b-button @click="changeCategory('science')">🔬Science</b-button></b-col></b-col>
                            <b-col cols="2"><b-button @click="changeCategory('society_and_culture')">🧠Society & Culture</b-button></b-col></b-col>
                            <b-col cols="2"><b-button @click="changeCategory('sport_and_leisure')">🤺Sport & Leisure</b-button></b-col></b-col>
                        </b-row>

                        <p style="color: white;">Your selection -> {{this.selectedDifficulty}} && {{this.selectedCategory}}</p>

                        <b-button @click="decreasePage" class="button__play"><span>Back</span></b-button>
                        <b-button @click="startGame" class="button__play"><span>Start</span></b-button>
                    </div>
                    <br><br>
                    <div class="game__outerDiv">
                        <div class="game__div">
                            <div v-if="showQuestions" v-for="(question, index) in this.questions" class="game__body">
                                <question v-show="actualQuestion == index" :infoQuestion="question" @userAnswer="addUserAnswer">
                                <br><br>
                                <div v-for="(answer, index) in userAnswers" class="game__cardFooter">
                                    <div v-if="isLogged" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(index), game__answerIncorrect: comprobarRespuestaIncorrecta(index)}">{{index+1}}</div>
                                </div>
                                <br><br>
                                <h3>Timer: {{timer}}</h3>
                                </question>
                            </div>
                        </div>
                    </div>
                    <div v-if="showQuestions"></div>
                        
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
                if(this.isLogged && !userStore().playChallenge){
                    rutaFetch = "https://the-trivia-api.com/api/questions?categories="+ this.selectedCategory +"&limit=10&region=ES&difficulty=" + this.selectedDifficulty;
                }
                else {
                    console.log(id);
                    rutaFetch = "../trivial5/public/chargegame/"+id;
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
        startGame: function(){
            this.page++;
            this.createGame();
        },
        playButton: function() {
            if(this.isLogged){
                this.page++;
            }
            else {
                let randomID = Math.floor(Math.random() * 5);
                this.createGame(randomID);
            }
            
        },
        decreasePage: function() {
            this.page--;
        },
        changeDifficulty: function(difficulty) {
            console.log("dificultad param " + difficulty);
            this.selectedDifficulty = difficulty;
            console.log("dificultad this.selected " + this.selectedDifficulty);
        },
        changeCategory: function(category){
            this.selectedCategory = category;
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
            this.$bvModal.msgBoxConfirm('This functionality is only available if you are logged in. Do you want to log in?', {
              title: 'Warning',
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
    mounted() {

        if(userStore().playChallenge){
            this.createGame(userStore().idChallenge);
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

const UP = {
    template:`<user-profile></user-profile>`
}
// 2. Define some routes
// Each route should map to a component.
const routes = [{
    path: '/',
    component: Game
}, {
    path: '/profile/:id',
    component: Perfil
},
{
    path: '/userprofile/:id',
    component: UP
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
            },
            playChallenge: false,
            idChallenge: '',
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
