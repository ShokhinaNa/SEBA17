'use strict';

import MeetingComponent from './../components/view-meeting/view-meeting.component';
import MeetingsComponent from './../components/view-meetings/view-meetings.component';
import LoginComponent from './../components/view-login/view-login.component';
import SignupComponent from './../components/view-signup/view-signup.component';
import MeetingCreateComponent from './../components/view-meeting-create/view-meeting-create.component';

import MeetingsService from './../services/meetings/meetings.service';

import meetingCreateBasicTemplate from './../components/view-meeting-create/view-meeting-create-basic.template.html'
import meetingCreateSlotsTemplate from './../components/view-meeting-create/view-meeting-create-slots.template.html'
import meetingCreateParticipantsTemplate from '../components/view-meeting-create/view-meeting-create-participants.template.html'
import meetingCreateSummaryTemplate from './../components/view-meeting-create/view-meeting-create-summary.template.html'


resolveMeeting.$inject = ['$stateParams', MeetingsService.name];
function resolveMeeting($stateParams,meetingService){
    return meetingService.get($stateParams.meetingId);
}

resolveMeetings.$inject = [MeetingsService.name];
function resolveMeetings(meetingService){
    return meetingService.list();
}

config.$inject = ['$stateProvider', '$urlRouterProvider'];
export default function config ($stateProvider, $urlRouterProvider){

    // For any unmatched url, redirect to /home
    $urlRouterProvider.otherwise("/meetings");

    $stateProvider
        .state('meetings', {
            url: '/meetings',
            component: MeetingsComponent.name,
            resolve: {
                meetings : resolveMeetings
            }
        })
        .state('meeting', {
            url: '/meetings/:meetingId',
            component: MeetingComponent.name,
            resolve: {
                meetings : resolveMeeting
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
            url: '/new',
            component: MeetingCreateComponent.name,
            resolve: {
                meetings : resolveMeetings
            }
        })
        .state('meetingCreate.basic', {
            url: '/basic',
            template: meetingCreateBasicTemplate,
        })
        .state('meetingCreate.slots', {
            url: '/slots',
            template: meetingCreateSlotsTemplate,
        })
        .state('meetingCreate.participants', {
            url: '/participants',
            template: meetingCreateParticipantsTemplate,
        })
        .state('meetingCreate.summary', {
            url: '/summary',
            template: meetingCreateSummaryTemplate,
        })

}

