
'use strict';

import template from './view-meeting-create.template.html';

import './view-meeting-create.style.css';
// import MeetingsService from './../../services/meetings/meetings.service';
// import UserService from './../../services/user/user.service';

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
    constructor($state, $scope){
        this.$state = $state;
        // this.MeetingsService = MeetingsService;
        // this.UserService = UserService;

        $scope.formData = {};

        $scope.processForm = function() {
            alert('Title: ' + $scope.formData.meetingTitle);
        };
    }

    // cancel() {
    //     this.$state.go('meetings',{});
    // };

    // save() {
        // let user = this.UserService.getCurrentUser();
        //
        // this.meeting['user'] = user['_id'];
        // this.MeetingsService.create(this.meeting).then(data => {
        //     let _id = data['_id'];
        //     this.$state.go('meeting',{ meetingId:_id});
        // });

    // };


    static get $inject(){
        return ['$state', '$scope'/*, MeetingsService.name, UserService.name*/];
    }

}


export default ViewMeetingCreateComponent;