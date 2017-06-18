'use strict';

import angular from 'angular';

import ViewLandingPageComponent from './view-landing-page.component';


export default angular.module('ViewLandingPage', [])
    .component(ViewLandingPageComponent.name, new ViewLandingPageComponent);