
'use strict';

import UserService from './../../services/user/user.service';

import template from './view-signup.template.html';
import './view-signup.style.css';

class ViewSignupComponent {
    constructor(){
        this.controller = ViewSignupComponentController;
        this.template = template;

    }

    static get name() {
        return 'viewSignup';
    }


}

class ViewSignupComponentController{
    constructor($state,UserService){
        this.$state = $state;
        this.UserService = UserService;
    }

    $onInit() {
        this.signup = {};
    }

    submit(){
        let useremail = this.signup.useremail;
        let password = this.signup.password;
        let username = this.signup.username;

        this.UserService.signup(useremail,password,username).then(()=> {
            this.$state.go('landingPage',{});
        });
    }

    static get $inject(){
        return ['$state', UserService.name];
    }

}


export default ViewSignupComponent;