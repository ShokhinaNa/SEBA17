'use strict';

import angular from 'angular';

import MeetingsService from './meetings.service';


export default angular.module('MeetingsServiceDefinition', [])
    .service(MeetingsService.name, MeetingsService)