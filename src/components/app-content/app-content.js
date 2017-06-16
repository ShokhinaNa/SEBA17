'use strict';

import angular from 'angular';

import AppHeader from './../app-header/app-header';

import AppContentComponent from './app-content.component';


export default angular.module('AppView', [
        AppHeader.name,
    ])
    .component(AppContentComponent.name, new AppContentComponent);