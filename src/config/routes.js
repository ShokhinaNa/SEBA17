'use strict';

import MeetingComponent from './../components/view-meeting/view-meeting.component';
import MeetingsComponent from './../components/view-meetings/view-meetings.component';
import LoginComponent from './../components/view-login/view-login.component';
import SignupComponent from './../components/view-signup/view-signup.component';
import MeetingCreateComponent from './../components/view-meeting-create/view-meeting-create.component';
import SchedulingComponent from './../components/view-scheduling/view-scheduling.component';
import SchedulingApproveComponent from './../components/view-scheduling-approve/view-scheduling-approve.component';
import MeetingSuccessComponent from './../components/view-meeting-success/view-meeting-success.component';

import MeetingsService from './../services/meetings/meetings.service';
import UserService from './../services/user/user.service';

import MeetingCreateBasicTemplate from './../components/view-meeting-create/view-meeting-create-basic.template.html'
import MeetingCreateSlotsTemplate from './../components/view-meeting-create/view-meeting-create-slots.template.html'
import MeetingCreateParticipantsTemplate from '../components/view-meeting-create/view-meeting-create-participants.template.html'
import MeetingCreateSummaryTemplate from './../components/view-meeting-create/view-meeting-create-summary.template.html'

import ViewLandingPageComponent from './../components/view-landing-page/view-landing-page.component';
import meetingSuccessTimeslotsTemplate from './../components/view-scheduling/view-scheduling-success.template.html'
import meetingSuccessApproveTimeslotTemplate from './../components/view-scheduling-approve/view-scheduling-approve-success.template.html'

resolveMeeting.$inject = ['$stateParams', MeetingsService.name];
function resolveMeeting($stateParams,meetingService){
    return meetingService.get($stateParams.meetingId);
}

resolveInviteId.$inject = ['$stateParams'];
function resolveInviteId($stateParams){
    return $stateParams.inviteId;
}

resolveUserMeetings.$inject = ['$stateParams', MeetingsService.name, UserService.name];
function resolveUserMeetings($stateParams,meetingService, userService){
    var user = userService.getCurrentUser();
    return meetingService.findByFacilitatorId(user._id);
}

resolveUserEmail.$inject = [UserService.name];
function resolveUserEmail(userService) {
    return userService.getCurrentUserEmail();
}

resolveMeetings.$inject = [MeetingsService.name];
function resolveMeetings(meetingService){
    return meetingService.list();
}

config.$inject = ['$stateProvider', '$urlRouterProvider'];
export default function config ($stateProvider, $urlRouterProvider){

    // For any unmatched url, redirect to /home
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('landingPage', {
            url: '/',
            component: ViewLandingPageComponent.name
        })
        .state('meetings', {
            url: '/meetings',
            component: MeetingsComponent.name,
            resolve: {
                meetings : resolveUserMeetings
            }
        })
        .state('meeting', {
            url: '/meetings/:meetingId',
            component: MeetingComponent.name,
            resolve: {
                meeting : resolveMeeting
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
            component: MeetingCreateComponent.name
        })
        .state('meetingCreate.basic', {
            url: '/basic',
            template: MeetingCreateBasicTemplate
        })
        .state('meetingCreate.slots', {
            url: '/slots',
            template: MeetingCreateSlotsTemplate
        })
        .state('meetingCreate.participants', {
            url: '/participants',
            template: MeetingCreateParticipantsTemplate,
        })
        .state('meetingCreate.summary', {
            url: '/summary',
            template: MeetingCreateSummaryTemplate,
        })
        .state('success', {
            url: '/new/:meetingId',
            component: MeetingSuccessComponent.name,
            resolve: {
                meeting : resolveMeeting
            }
        })
        .state('scheduling', {
            url: '/scheduling/:meetingId/:inviteId',
            component: SchedulingComponent.name,
            resolve: {
                meeting : resolveMeeting,
                inviteId: resolveInviteId
            },
            params: {inviteId: null}
        })
        .state('schedulingApprove', {
            url: '/schedulingApprove/:meetingId',
            component: SchedulingApproveComponent.name,
            resolve: {
                meeting : resolveMeeting
            }
        })
        .state('successTimeslots', {
            url: '/successTimeslots',
            template: meetingSuccessTimeslotsTemplate,
        })
        .state('successTimeslot', {
            url: '/meetingArranged',
            template: meetingSuccessApproveTimeslotTemplate,
        })
        .state('error', {
            url: '/error',
            template: '<h1>Unexpected Error</h1>'
        });

}

