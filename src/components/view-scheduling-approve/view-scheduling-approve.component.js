
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
    }

    $onInit() {

    }

    cancel() {
            this.$state.go('meeting',{ meetingId:this.meeting['_id']});
    }

    static get $inject(){
        return ['$state', MeetingsService.name, UserService.name];
    }

}

export default ViewSchedulingApproveComponent;