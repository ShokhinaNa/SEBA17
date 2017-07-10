
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
            meeting: '<'
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
        this.morning = 6;
        this.evening = 22;
        this.choosableHours = range(this.morning, this.evening, 1);
    }


    static get $inject(){
        return ['$state', MeetingsService.name, UserService.name];
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
                weekdays[date.getDay()] + "\xa0" + date.getDate() + "." + date.getMonth() + "." + (date.getFullYear() % 100)
            )
        }

        return this.humanDaysInRange;
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

        console.log(
            offsetYtoTime(day, parseInt(this.startY, 10), this.morning),
            offsetYtoTime(day, parseInt(this.mouseY, 10), this.morning)
        );

        this.heightY = "0px";
        this.startY = undefined;
    }
}

function range(start, stop, step){
    let a=[start], b=start;
    while(b<stop){b+=step;a.push(b)}
    return a;
}

function offsetYtoTime(baseDate, offset, morning) {
    let hours = morning + (offset - 64) / 48; // see style
    let newDate = new Date(baseDate);
    newDate.setHours(hours, (hours * 60) % 60);
    return newDate;
}

export default ViewSchedulingComponent;