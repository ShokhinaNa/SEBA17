'use strict';

import angular from 'angular';

import ViewSchedulingComponent from './view-scheduling.component';


export default angular.module('ViewScheduling', [])
    .component(ViewSchedulingComponent.name, new ViewSchedulingComponent);