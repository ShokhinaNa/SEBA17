'use strict';

import angular from 'angular';

import ViewSchedulingApproveComponent from './view-scheduling-approve.component';


export default angular.module('ViewSchedulingApprove', [])
    .component(ViewSchedulingApproveComponent.name, new ViewSchedulingApproveComponent);