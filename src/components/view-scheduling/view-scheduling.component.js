
'use strict';

import './view-scheduling.style.css';
import template from './view-scheduling.template.html';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';


class ViewSchedulingComponent {
    constructor(){
        this.controller = ViewSchedulingComponentController;
        this.template = template;
        this.bindings = {
            meeting: '<',
            inviteId: '@'
        };
    }

    static get name() {
        return 'viewScheduling';
    }


}

class ViewSchedulingComponentController{
    constructor($state,MeetingsService,UserService){
        this.$state = $state;
        this.MeetingsService = MeetingsService;
        this.UserService = UserService;
        this.morning = 9;
        this.evening = 21;
        this.choosableHours = range(this.morning, this.evening, 1);
        this.slotsForDay = [];
    }

    $onInit() {
        if (!this.UserService.getCurrentUser()._id) {
            this.UserService.setTemporaryUser(this.inviteId);
        }
        console.log("time " + this.meeting.dayRange[0] +" "+ this.meeting.dayRange[1]);
        if (this.meeting.dayRange[0])
            this.morning = this.meeting.dayRange[0];
        if (this.meeting.dayRange[1])
            this.evening = this.meeting.dayRange[1];
        this.choosableHours = range(this.morning, this.evening, 1);
    }


    static get $inject(){
        return ['$state', MeetingsService.name, UserService.name];
    }

    isAuthenticated(){
        return this.UserService.isAuthenticated();
    }

    getMeetingDaysInRange() {
        if (!this.daysInRange) {
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const firstDay = new Date(this.meeting.range[0]);
            const lastDay = new Date(this.meeting.range[1]);
            this.daysInRange = [];

            for (let day = firstDay; day <= lastDay; day = new Date(day.getTime() + millisecondsPerDay)) {
                this.daysInRange.push(day);
            }
        }

        // we need to make sure to return the same object every
        // time this is called, otherwise Angular goes crazy
        return this.daysInRange;
    }

    getHumanMeetingDaysInRange() {
        let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        if (!this.daysInRange) {
            this.getMeetingDaysInRange();
            this.humanDaysInRange = this.daysInRange.map(date =>
                weekdays[date.getDay()] + "\xa0" + date.getDate() + "." + (date.getMonth() + 1) + "." + (date.getFullYear() % 100)
            )
        }

        return this.humanDaysInRange;
    }

    getSlotsForDay($index) {
        if (typeof this.slotsForDay[$index] === "undefined") {
            let availability = this.meeting.availabilities.find(availability =>
                availability.user === this.UserService.getCurrentUser()._id
            );

            if (!availability) {
                this.slotsForDay[$index] = [];
            } else {
                const days = this.getMeetingDaysInRange();
                // first map then filter to keep correct indices
                this.slotsForDay[$index] = availability.slots.map((slot, i) => ({
                    startY: this.timeToOffsetY(slot.range[0]) + 'px',
                    heightY: (this.timeToOffsetY(slot.range[1])
                                - this.timeToOffsetY(slot.range[0])) + 'px',
                    index: i,
                    range: slot.range
                })).filter(slot =>
                    slot.range[0].getTime() >= days[$index].getTime() &&
                    (!days[$index + 1] || slot.range[1].getTime() <= days[$index + 1].getTime())
                );
            }
        }

        return this.slotsForDay[$index]
    }

    start(event) {
        this.mouseY = this.startY = event.offsetY + 'px';
        event.preventDefault();
    }

    move(event) {
        this.mouseY = event.offsetY + 'px';
        if (this.startY) {
            this.heightY = (parseInt(this.mouseY, 10) - parseInt(this.startY, 10)) + 'px';
        }
    }

    stop($index) {
        let day = this.daysInRange[$index];

        let availabilityStart = this.offsetYtoTime(day, parseInt(this.startY, 10));
        let availabilityEnd = this.offsetYtoTime(day, parseInt(this.mouseY, 10));

        if((availabilityEnd - availabilityStart)/1000 <= 5) {
            this.heightY = "0px";
            this.startY = undefined;
            return;
        }

        let availability = this.meeting.availabilities.find(availability =>
            availability.user === this.UserService.getCurrentUser()._id
        );

        if (!availability) {
            availability = {
                user: this.UserService.getCurrentUser()._id,
                slots: []
            };
            this.meeting.availabilities.push(availability);
        }

        availability.slots.push({
            range: [availabilityStart, availabilityEnd],
            priority: 1
        });

        // invalidate slots to display
        this.slotsForDay = [];

        this.heightY = "0px";
        this.startY = undefined;
    }

    removeSlot(slotIndex) {
        let availability = this.meeting.availabilities.find(availability =>
            availability.user === this.UserService.getCurrentUser()._id
        );

        availability.slots.splice(slotIndex, 1);

        // invalidate slots to display
        this.slotsForDay = [];
    }

    offsetYtoTime(baseDate, offset) {
        let hours = this.morning + (offset - 64) / 48; // see style
        let newDate = new Date(baseDate);
        newDate.setHours(hours, (hours * 60) % 60);
        return newDate;
    }

    timeToOffsetY(date) {
        let hoursOffset = date.getHours() + date.getMinutes()/60 - this.morning;
        return hoursOffset * 48 + 64;
    }

    saveTimeslots() {
        this.meeting.availabilities.forEach(function (availability) {
            availability.slots.forEach(function (slot) {
                console.log("Slots: " + slot.range);
            });
        });
        this.MeetingsService.saveTimeslots(this.meeting).then(data => {
            let _id = data['_id'];
            this.$state.go('successTimeslots', {meetingId: _id});
        });
    }

    cancel() {
        this.$state.go('meeting',{ meetingId:this.meeting['_id']});
    }
}

function range(start, stop, step){
    let a=[start], b=start;
    while(b<stop){b+=step;a.push(b)}
    return a;
}

export default ViewSchedulingComponent;