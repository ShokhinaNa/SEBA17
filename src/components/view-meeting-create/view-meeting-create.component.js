
'use strict';

import template from './view-meeting-create.template.html';

import './view-meeting-create.style.css';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';

class ViewMeetingCreateComponent {
    constructor(){
        this.controller = ViewMeetingCreateComponentController;
        this.template = template;
        this.bindings = {
        }
    }

    static get name() {
        return 'viewMeetingCreate';
    }
}

class ViewMeetingCreateComponentController {
    constructor($state, MeetingsService, UserService){
        this.$state = $state;
        this.meeting = {};
        this.meeting.participants = [];
        this.MeetingsService = MeetingsService;
        this.UserService = UserService;

        this.meeting.date = {startDate: null, endDate: null};

        this.meeting.processForm = function() {
            alert('Title: ' + this.meeting.name);
        };

        this.$onInit = function() {
            this.addParticipantByUserId(this.getCurrentUser()._id);
        };
    }

    getCurrentUser() {
        return this.UserService.getCurrentUser();
    }

    getCurrentUserEmail() {
        return this.userEmail;
    }

    cancel() {
        this.$state.go('meetings',{});
    }

    addParticipant(participant) {
        console.log("Adding participant: " + participant);
        participant.asText = 'username' in participant ? `${participant.username} (${participant.useremail})` : participant.useremail;
        this.meeting.participants.push(participant);
    }

    addParticipantByUserId(userId) {
        if (typeof userId === "undefined") {
            return undefined;
        }
        this.UserService.getUserPromise(userId).then(data => {
            console.log(data);
            this.addParticipant(data);
        });
    }

    add(chosenMeeting) {
        this.meeting.participants.push(chosenMeeting.participants);
        console.log("chosen: " + chosenMeeting.participants);
        console.log("after: " + this.meeting.participants);
    }

    delete(participant) {

    }

    save() {
        let user = this.UserService.getCurrentUser();
      /*  this.meeting.participants.push([]);*/


        this.meeting.facilitator = user['_id'];
        this.meeting.range = [this.meeting.date.startDate, this.meeting.date.endDate];
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