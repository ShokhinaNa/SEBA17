'use strict';

import template from './view-meeting-create.template.html';

import './view-meeting-create.style.css';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';

class ViewMeetingCreateComponent {
    constructor() {
        this.controller = ViewMeetingCreateComponentController;
        this.template = template;
        this.bindings = {}
    }

    static get name() {
        return 'viewMeetingCreate';
    }
}

class ViewMeetingCreateComponentController {
    constructor($state, MeetingsService, UserService) {
        this.$state = $state;
        this.meeting = {};
        this.meeting.participants = [];
        this.MeetingsService = MeetingsService;
        this.UserService = UserService;

        this.meeting.date = {
            startDate: null,
            endDate: null,
            selectedTemplate: null,
            selectedTemplateName: null,
            onePanel: false,
            isDisabledDate: function ($date) {
                return $date < new Date();
            }
        };

        this.meeting.durationParts = {
            days: 0,
            hours: 0,
            minutes: 0
        };

        this.meeting.processForm = function () {
            alert('Title: ' + this.meeting.name);
        };

        this.$onInit = () => {
            console.log("onInit");
            this.addParticipant(this.getCurrentUser());
        };
    }

    newParticipantEmail(email) {
        //TODO verify email with regex
        if (email) {
            this.addParticipant({useremail: email});
            this.searchText = "";
        }
    }

    hasCurrentParticipantWithEmail(email) {
        return email && this.meeting.participants.findIndex(p => p.useremail === email) >= 0;
    }

    querySearch(query) {
        return this.UserService.searchUsersByNameOrEmail(query).then(data => {
            return data.users.map(u => {
                u.display = `${u.username} (${u.useremail})`;
                return u;
            }).filter(u => !this.hasCurrentParticipantWithEmail(u.useremail));
        })
    }

    searchTextChange(text) {

    }

    selectedItemChange(participant) {
        this.addParticipant(participant);
        this.searchText = "";
    }

    getCurrentUser() {
        return this.UserService.getCurrentUser();
    }

    cancel() {
        this.$state.go('meetings', {});
    }

    addParticipant(participant) {
        if (!participant || this.hasCurrentParticipantWithEmail(participant.useremail)) {
            return;
        }
        participant.display = 'username' in participant ? `${participant.username} (${participant.useremail})` : participant.useremail;
        this.meeting.participants.push(participant);
    }

    addParticipantByUserId(userId) {
        if (typeof userId === "undefined") {
            return undefined;
        }
        this.UserService.findUserById(userId).then(data => {
            this.addParticipant(data);
        });
    }

    add(chosenMeeting) {
        this.meeting.participants.push(chosenMeeting.participants);
        console.log("chosen: " + chosenMeeting.participants);
        console.log("after: " + this.meeting.participants);
    }

    deleteParticipant(participant) {
        let index = this.meeting.participants.indexOf(participant);
        if (index >= 0) {
            this.meeting.participants.splice(index, 1);
        }
    }

    save() {
        let user = this.UserService.getCurrentUser();
        /*  this.meeting.participants.push([]);*/


        this.meeting.facilitator = user['_id'];
        this.meeting.range = [this.meeting.date.startDate, this.meeting.date.endDate];
        this.meeting.duration = this.meeting.durationParts.minutes + this.meeting.durationParts.hours * 60 + this.meeting.durationParts.days * 24 * 60;
        this.MeetingsService.create(this.meeting).then(data => {
            let _id = data['_id'];
            this.$state.go('meeting', {meetingId: _id});
        });

    };


    static get $inject() {
        return ['$state', MeetingsService.name, UserService.name];
    }

}


export default ViewMeetingCreateComponent;