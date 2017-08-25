'use strict';


export default class UserService {

    static get $inject(){
        return ['$http', '$window','API_URL'];
    }

    constructor($http,$window,API_URL) {
        this.$http = $http;
        this.$window = $window;
        this.API_URL = API_URL;

    }

    static get name(){
        return 'UserService';
    }

    signup(email, pass, name) {
        return this.$http.post(`${ this.API_URL }/user/signup`, {
            username: name,
            password: pass,
            useremail: email
        });
    }

    login(email, pass) {
        return this.$http.post(`${ this.API_URL }/user/login`, {
            useremail: email,
            password: pass
        });
    }

    logout(){
        this.$window.localStorage.removeItem('jwtToken');
    }

    getCurrentUser() {
        let token = this.$window.localStorage['jwtToken'];
        if (!token) {
            let tempUserInviteId = this.$window.localStorage['tempUserInviteId'];
            if (tempUserInviteId) {
                return {
                    _id: tempUserInviteId
                }
            } else {
                return {};
            }
        }

        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(this.$window.atob(base64)).user;
    }

    setTemporaryUser(inviteId) {
        this.$window.localStorage['tempUserInviteId'] = inviteId;
    }

    findUserById(userId) {
        return this.$http.get(`${ this.API_URL }/user/${ userId }`).then(response => {
            return new Promise((resolve, reject) => {
                resolve(response.data);
            })
        })
    }

    searchUsersByNameOrEmail(searchText) {
        let query = new Buffer(searchText).toString('base64');
        return this.$http.get(`${ this.API_URL }/user/search/${ query }`).then(response => {
            return new Promise((resolve, reject) => {
                resolve(response.data);
            })
        })
    }

    isAuthenticated() {
        return !!this.$window.localStorage['jwtToken'];
    }

}