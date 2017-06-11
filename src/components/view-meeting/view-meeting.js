'use strict';

import angular from 'angular';

import ViewMeetingComponent from './view-meeting.component';


export default angular.module('ViewMeeting', [])
    .component(ViewMeetingComponent.name, new ViewMeetingComponent);