'use strict';

import angular from 'angular';

import ViewMeetingSuccessComponent from './view-meeting-success.component';

export default angular.module('ViewMeetingSuccess', [])
    .component(ViewMeetingSuccessComponent.name, new ViewMeetingSuccessComponent);