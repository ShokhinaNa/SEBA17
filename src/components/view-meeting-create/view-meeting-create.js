'use strict';

import angular from 'angular';

import ViewMeetingCreateComponent from './view-meeting-create.component';


export default angular.module('ViewMeetingCreate', [])
    .component(ViewMeetingCreateComponent.name, new ViewMeetingCreateComponent);