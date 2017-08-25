
'use strict';

import template from './view-meeting.template.html';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';

class ViewMeetingComponent {
    constructor(){
        this.controller = ViewMeetingComponentController;
        this.template = template;
        this.bindings = {
            meeting: '<',
        }

    }

    static get name() {
        return 'viewMeeting';
    }


}

class ViewMeetingComponentController{
    constructor($state,MeetingsService,UserService){
        this.$state = $state;
        this.MeetingsService = MeetingsService;
        this.UserService = UserService;

    }

    delete() {
        if (this.UserService.isAuthenticated()) {
            let _id = this.meeting['_id'];

            this.MeetingsService.delete(_id).then(response => {
                this.$state.go('meetings',{});
            });
        } else {
            this.$state.go('login',{});
        }
    };

    schedule() {
        this.$state.go('scheduling', { meetingId: this.meeting['_id']})
    }

    scheduleApprove() {
        this.$state.go('schedulingApprove', { meetingId: this.meeting['_id']})
    }

    isTimeslotArranged(){
        if (!this.meeting.arranged_timeslot || isNaN(this.meeting.arranged_timeslot.getTime())) {
            return false;
        }
        return true;
    }

    static get $inject(){
        return ['$state', MeetingsService.name, UserService.name];
    }

}


export default ViewMeetingComponent;