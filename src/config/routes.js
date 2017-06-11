'use strict';

import MoviesComponent from './../components/view-movies/view-movies.component';
import MovieComponent from './../components/view-movie/view-movie.component';
import MovieEditComponent from './../components/view-movie-edit/view-movie-edit.component';
import MovieCreateComponent from './../components/view-movie-create/view-movie-create.component';
import LoginComponent from './../components/view-login/view-login.component';
import SignupComponent from './../components/view-signup/view-signup.component';
import MeetingCreateComponent from './../components/view-meeting-create/view-meeting-create.component';

import MoviesService from './../services/movies/movies.service';

import meetingCreateBasicTemplate from './../components/view-meeting-create/view-meeting-create-basic.template.html'
import meetingCreateSlotsTemplate from './../components/view-meeting-create/view-meeting-create-slots.template.html'
import meetingCreatePartyTemplate from './../components/view-meeting-create/view-meeting-create-party.template.html'
import meetingCreateSummaryTemplate from './../components/view-meeting-create/view-meeting-create-summary.template.html'

resolveMovie.$inject = ['$stateParams', MoviesService.name];
function resolveMovie($stateParams,moviesService){
    return moviesService.get($stateParams.movieId);
}

resolveMovies.$inject = [MoviesService.name];
function resolveMovies(moviesService){
    return moviesService.list();
}


config.$inject = ['$stateProvider', '$urlRouterProvider'];
export default function config ($stateProvider, $urlRouterProvider){

    // For any unmatched url, redirect to /home
    $urlRouterProvider.otherwise("/movies");

    $stateProvider
        .state('movies', {
            url: '/movies',
            compbinonent: MoviesComponent.name,
            resolve: {
                movies : resolveMovies
            }
        })
        .state('movieAdd', {
            url: '/movies/new',
            component: MovieCreateComponent.name
        })
        .state('movie', {
            url: '/movies/:movieId',
            component: MovieComponent.name,
            resolve: {
                movie : resolveMovie
            }

        })
        .state('movieEdit', {
            url: '/movies/:movieId/edit',
            component: MovieEditComponent.name,
            resolve: {
                movie : resolveMovie
            }
        })
        .state('login', {
            url: '/login',
            component: LoginComponent.name,
        })
        .state('signup', {
            url: '/signup',
            component: SignupComponent.name,
        })
        .state('meetingCreate', {
            url: '/meetings/new',
            component: MeetingCreateComponent.name,
        })
        .state('meetingCreate.basic', {
            url: '/basic',
            template: meetingCreateBasicTemplate,
        })
        .state('meetingCreate.slots', {
            url: '/slots',
            template: meetingCreateSlotsTemplate,
        })
        .state('meetingCreate.party', {
            url: '/party',
            template: meetingCreatePartyTemplate,
        })
        .state('meetingCreate.summary', {
            url: '/summary',
            template: meetingCreateSummaryTemplate,
        })

}

