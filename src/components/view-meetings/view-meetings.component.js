
'use strict';

import template from './view-meetings.template.html';
import MeetingsService from './../../services/meetings/meetings.service';
import UserService from './../../services/user/user.service';


class ViewMeetingsComponent {
    constructor(){
        this.controller = ViewMeetingsComponentController;
        this.template = template;
        this.bindings = {
            meetings: '<',
        }
    }

    static get name() {
        return 'viewMeetings';
    }


}

class ViewMeetingsComponentController{
    constructor($state,MeetingsService,UserService){
        this.$state = $state;
        this.MeetingsService = MeetingsService;
        this.UserService = UserService;

    }

    details (meeting) {
        let _id = meeting['_id'];
        this.$state.go('meeting',{ meetingId:_id});  // TODO define this state in a view-meeting component
    };

    // edit (movie) {
    //
    //     if (this.UserService.isAuthenticated()) {
    //         let _id = movie['_id'];
    //         this.$state.go('movieEdit',{ movieId:_id});
    //     } else {
    //         this.$state.go('login',{});
    //     }
    // };

    // newMovie(){
    //
    //     if (this.UserService.isAuthenticated()) {
    //         this.$state.go('movieAdd',{});
    //     } else {
    //         this.$state.go('login',{});
    //     }
    //
    // }


    delete(meeting) {
        if (this.UserService.isAuthenticated()) {
            let _id = meeting['_id'];

            this.MeetingsService.delete(_id).then(response => {
                // TODO what are next 2 lines?
                let index = this.meetings.map(x => x['_id']).indexOf(_id);
                this.meetings.splice(index, 1);
            })

        } else {
            this.$state.go('login',{});
        }
    };


    static get $inject(){
        return ['$state', MeetingsService.name, UserService.name];
    }

}

export default ViewMeetingsComponent;