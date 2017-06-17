
'use strict';

import UserService from './../../services/user/user.service';

import template from './view-login.template.html';
import './view-login.style.css';

class ViewLoginComponent {
    constructor(){
        this.controller = ViewLoginComponentController;
        this.template = template;

    }

    static get name() {
        return 'viewLogin';
    }


}

class ViewLoginComponentController{
    constructor($state,UserService){
        this.$state = $state;
        this.UserService = UserService;
    }

    $onInit() {
        this.login = {};
    }

    submit(){
        let email = this.login.useremail;
        let password = this.login.password;

        this.UserService.login(email,password).then(()=> {
            this.$state.go('meetings',{});
        });
    }

    static get $inject(){
        return ['$state', UserService.name];
    }

}


export default ViewLoginComponent;