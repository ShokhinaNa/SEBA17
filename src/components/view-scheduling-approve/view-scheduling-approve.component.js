
'use strict';

import './view-scheduling-approve.style.css';
import template from './view-scheduling-approve.template.html';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';


class ViewSchedulingApproveComponent {
    constructor(){
        this.controller = ViewSchedulingApproveComponentController;
        this.template = template;
        this.bindings = {
            meeting: '<'
        };
    }

    static get name() {
        return 'viewSchedulingApprove';
    }


}

class ViewSchedulingApproveComponentController{
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
        if (this.meeting.dayRange[0])
            this.morning = this.meeting.dayRange[0];
        if (this.meeting.dayRange[1])
            this.evening = this.meeting.dayRange[1];
        this.choosableHours = range(this.morning, this.evening, 1);
        this.eventHeightY = (this.meeting.duration / 60 * 48) + 'px';
        this.eventHalfHeightY = (parseInt(this.eventHeightY, 10) / 2) + 'px';
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

                const days = this.getMeetingDaysInRange();
                // first map then filter to keep correct indices
                this.slotsForDay[$index] = this.meeting.bestSlots.map((slot, i) => ({
                    startY: this.timeToOffsetY(days[$index], slot.range[0]) + 'px',
                    heightY: (this.timeToOffsetY(days[$index], slot.range[1])
                    - this.timeToOffsetY(days[$index], slot.range[0])) + 'px',
                    index: i,
                    range: slot.range
                })).filter(slot =>
                    (slot.range[0].getTime() >= days[$index].getTime()
                        && (!days[$index + 1] || slot.range[0].getTime() < days[$index + 1].getTime()))
                    || (slot.range[0].getTime() < days[$index].getTime()
                        && slot.range[1].getTime() >= days[$index].getTime())
                );
        }

        return this.slotsForDay[$index]
    }

    offsetYtoTime(baseDate, offset) {
        let hours = this.morning + (offset - 64) / 48; // see style
        let newDate = new Date(baseDate);
        newDate.setHours(hours, (hours * 60) % 60);
        return newDate;
    }

    timeToOffsetY(baseDate, date) {
        let differenceHours = (date.getTime() - baseDate.getTime()) / 1000 / 60 / 60;
        let hoursOffset = differenceHours - this.morning;
        let pxOffset = 64 + hoursOffset * 48;
        pxOffset = Math.max(pxOffset, 64);
        pxOffset = Math.min(pxOffset, 64 + 48 * (this.evening - this.morning));
        return pxOffset;
    }

    move(event, index) {
        let day = this.getMeetingDaysInRange()[index];
        this.mouseY = event.offsetY - (this.meeting.duration / 2 / 60 * 48) + 'px';
        this.validStart = this.isValidEventStart(day, this.mouseY);
    }

    isValidEventStart(baseDate, mouseY) {
        let startDate = this.offsetYtoTime(baseDate, parseInt(mouseY, 10));
        let endDate = new Date(startDate.getTime() + this.meeting.duration * 60 * 1000);

        return startDate.getHours() >= this.morning && endDate.getHours() < this.evening &&
            this.meeting.bestSlots.some(bestSlot =>
                startDate >= bestSlot.range[0] && endDate <= bestSlot.range[1]
            );
    }

    stop(index) {
        let day = this.getMeetingDaysInRange()[index];
        if (this.isValidEventStart(day, this.mouseY)) {
            this.meeting.arranged_timeslot = this.offsetYtoTime(day, parseInt(this.mouseY, 10));
            // TODO: send to backend
            this.arrangedY = this.mouseY;
            this.arrangedIndex = index;
        }
    }

    cancel() {
            this.$state.go('meeting',{ meetingId:this.meeting['_id']});
    }

    saveArrangedTimeSlot() {
        const arranged = this.meeting.arranged_timeslot;
        if (!arranged || isNaN(arranged.getTime())) {
            return;
        }
        this.MeetingsService.saveArrangedTimeSlot(this.meeting).then(data => {
            let _id = data['_id'];
            this.$state.go('successTimeslot', {meetingId: _id});
        });
    }

    static get $inject(){
        return ['$state', MeetingsService.name, UserService.name];
    }

}


function range(start, stop, step){
    let a=[start], b=start;
    while(b<stop){b+=step;a.push(b)}
    return a;
}

export default ViewSchedulingApproveComponent;