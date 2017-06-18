'use strict';

import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import angularMaterial from 'angular-material';
import 'angular-material/angular-material.css';

import ngMdIcons from 'angular-material-icons';

import MeetingsService from './services/meetings/meetings';
import UserService from './services/user/user';

import Routes from './config/routes';
import Middlewares from './config/middlewares';

import AppContent from './components/app-content/app-content';
import ViewMeetings from './components/view-meetings/view-meetings';
import ViewMeeting from './components/view-meeting/view-meeting';
import ViewLogin from './components/view-login/view-login';
import ViewSignup from './components/view-signup/view-signup';
import ViewMeetingCreate from './components/view-meeting-create/view-meeting-create';

import 'md-date-range-picker'; // don't ask
import 'md-date-range-picker/dist/md-date-range-picker.css';

let app = angular.module('app', [
    uiRouter,
    angularMaterial,
    ngMdIcons,
    "ngMaterialDateRangePicker", // don't ask
    UserService.name,
    MeetingsService.name,
    AppContent.name,
    ViewMeetings.name,
    ViewMeeting.name,
    ViewLogin.name,
    ViewSignup.name,
    ViewMeetingCreate.name
]);

app.constant('API_URL', 'http://localhost:3000/api');
app.config(Routes);
app.config(Middlewares);

app.run(['$rootScope', '$state', function ($rootScope, $state) {
    console.log('here');
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        console.log('even here: ' + error);
        if (angular.isObject(error) && angular.isString(error.code)) {
            switch (error.code) {
                case 'NOT_AUTHENTICATED':
                    // go to the login page
                    $state.go('login');
                    break;
                default:
                    // set the error object on the error state and go there
                    $state.get('error').error = error;
                    $state.go('error');
            }
        }
        else {
            // unexpected error
            $state.go('error');
        }
    });
}]);

angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [app.name], {
        strictDi: true
    });
});


export default app;