'use strict';

import angular from 'angular';

import ViewMeetingsComponent from './view-meetings.component';


export default angular.module('ViewMeetings', [])
    .component(ViewMeetingsComponent.name, new ViewMeetingsComponent);