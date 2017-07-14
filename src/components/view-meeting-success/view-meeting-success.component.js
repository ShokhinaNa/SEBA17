'use strict';

import template from './view-meeting-success.template.html';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';

import './view-meeting-success.style.css';

class ViewMeetingSuccessComponent {
    constructor() {
        this.controller = ViewMeetingSuccessComponentController;
        this.template = template;
        this.bindings = {
            meeting: '<',
        }
    }

    static get name() {
        return 'viewMeetingSuccess';
    }
}

class ViewMeetingSuccessComponentController {
    constructor($state, MeetingsService, UserService) {
        this.$state = $state;
        this.MeetingsService = MeetingsService;
        this.UserService = UserService;
    }


    setAvailability() {
        this.$state.go('scheduling', {meetingId: this.meeting['_id']});
    }

    static get $inject(){
        return ['$state', MeetingsService.name, UserService.name];
    }

}


export default ViewMeetingSuccessComponent;