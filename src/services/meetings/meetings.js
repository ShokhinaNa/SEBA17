'use strict';

import angular from 'angular';

import MeetingsService from './meetings.service';


export default angular.module('MoviesServiceDefinition', [])
    .service(MeetingsService.name, MeetingsService)