
'use strict';

import template from './view-meeting-create.template.html';

import './view-meeting-create.style.css';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';

class ViewMeetingCreateComponent {
    constructor(){
        this.controller = ViewMeetingCreateComponentController;
        this.template = template;
    }

    static get name() {
        return 'viewMeetingCreate';
    }
}

class ViewMeetingCreateComponentController {
    constructor($state, MeetingsService,UserService){
        this.$state = $state;
        this.meeting = {};
        this.MeetingsService = MeetingsService;
        this.UserService = UserService;

        this.meeting.date = {startDate: null, endDate: null};

        this.meeting.processForm = function() {
            alert('Title: ' + this.meeting.name);
        };
    }

    cancel() {
        this.$state.go('meetings',{});
    };

    save() {
        let user = this.UserService.getCurrentUser();

        this.meeting['facilitator'] = user['_id'];
        this.MeetingsService.create(this.meeting).then(data => {
            let _id = data['_id'];
            this.$state.go('meeting',{ meetingId:_id});
        });

    };


    static get $inject(){
        return ['$state', MeetingsService.name, UserService.name];
    }

}


export default ViewMeetingCreateComponent;