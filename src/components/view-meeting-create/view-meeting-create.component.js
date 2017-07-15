'use strict';

import template from './view-meeting-create.template.html';

import './view-meeting-create.style.css';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';

class ViewMeetingCreateComponent {
    constructor() {
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
    constructor($state, MeetingsService, UserService) {
        this.$state = $state;
        this.meeting = {};
        this.meeting.dayRange = [9, 21];
        this.meeting.participants = []; // array of emails
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
            hours: 1,
            minutes: 0
        };

        this.meeting.processForm = function () {
            alert('Title: ' + this.meeting.name);
        };

        this.createdMeetings = [];

        this.showSelectedItemTooltip = false;

        this.$onInit = () => {
            let user = this.getCurrentUser();
            this.addParticipant(user);
            this.MeetingsService.findByFacilitatorId(user._id).then(data => {
                this.createdMeetings = data.map(m => {
                    m.display = "Meeting: " + m.name;
                    m.tooltip = m.participantEmails.join(", ");
                    return m;
                });
            });
        };
    }

    newParticipantEmail(email) {
        if (email) {
            this.addParticipant({useremail: email, display: email});
            this.searchText = "";
        }
    }

    isValidEmail(email) {
        //NOTE: do NOT make static
        return email && /^\w+(\.\w+)*@\w+(\.\w+)+$/.test(email);
    }

    hasCurrentParticipantWithEmail(email) {
        return email && this.meeting.participants.findIndex(p => p.useremail === email) >= 0;
    }

    querySearch(query) {
        let alternatives = query.replace(/[^\w\s@.]+/g, "#").split(/\s+/).filter(a => a !== "");
        let filteredRegexPattern = alternatives.join("|").replace('.', '\\.');
        let regExp = new RegExp(filteredRegexPattern, 'i');
        let filteredMeetings = this.createdMeetings.filter(m => regExp.test(m.name));
        return this.UserService.searchUsersByNameOrEmail(query).then(data => {
            let foundUsers = data.users.map(u => {
                u.display = `${u.username} (${u.useremail})`;
                u.tooltip = u.useremail;
                return u;
            });
            return filteredMeetings.concat(foundUsers);
        })
    }

    searchTextChange(text) {

    }

    selectedItemChange(selectedItem) {
        if (!selectedItem) {
            return;
        }

        if (selectedItem.useremail) {
            this.addParticipant(selectedItem);
        } else {
            let emails = selectedItem.participantEmails;
            console.log("Adding participants by email: " + JSON.stringify(emails));
            for (var i = 0; i < emails.length; i++) {
                let email = emails[i];
                this.UserService.searchUsersByNameOrEmail(email).then(data => {
                    let foundUsers = data.users.map(u => {
                        u.display = `${u.username} (${u.useremail})`;
                        return u;
                    });
                    if (foundUsers.length > 0) {
                        this.addParticipant(foundUsers[0]);
                    } else {
                        this.addParticipant({useremail: email, display: email});
                    }
                })
            }
        }

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
        if (!userId) {
            return null;
        }
        this.UserService.findUserById(userId).then(data => {
            this.addParticipant(data);
        });
    }

    deleteParticipant(participant) {
        console.log("Deleting participant: " + JSON.stringify(participant));
        let index = this.meeting.participants.findIndex(p => p.useremail === participant.useremail);
        if (index >= 0) {
            this.meeting.participants.splice(index, 1);
        }
    }

    save() {
        let user = this.UserService.getCurrentUser();

        this.meeting.participantEmails = this.meeting.participants.map(p => p.useremail);
        this.meeting.facilitator = user['_id'];
        this.meeting.range = [this.meeting.date.startDate, this.meeting.date.endDate];
        this.meeting.duration = this.meeting.durationParts.minutes + this.meeting.durationParts.hours * 60 + this.meeting.durationParts.days * 24 * 60;
        console.log("Creating new meeting: " + JSON.stringify(this.meeting));
        this.MeetingsService.create(this.meeting).then(data => {
            let _id = data['_id'];
            this.$state.go('success', {meetingId: _id});
        });

    };


    static get $inject() {
        return ['$state', MeetingsService.name, UserService.name];
    }

}


export default ViewMeetingCreateComponent;