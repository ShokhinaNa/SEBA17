
'use strict';

import template from './view-scheduling.template.html';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';


class ViewSchedulingComponent {
    constructor(){
        this.controller = ViewSchedulingComponentController;
        this.template = template;
        this.bindings = {
            meeting: '<'
        }
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

    }


    static get $inject(){
        return ['$state', MeetingsService.name, UserService.name];
    }

}

export default ViewSchedulingComponent;