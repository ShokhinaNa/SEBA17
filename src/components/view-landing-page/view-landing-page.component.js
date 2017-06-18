
'use strict';

import template from './view-landing-page.template.html';
import './view-landing-page.style.css';

class ViewLandingPageComponent {
    constructor(){
        this.controller = ViewLandingPageComponentController;
        this.template = template;
        this.bindings = {}

    }

    static get name() {
        return 'viewLandingPage';
    }


}

class ViewLandingPageComponentController{
    constructor($state){
        this.$state = $state;
    }

    newMeeting() {
        this.$state.go('meetingCreate.basic')
    }

    static get $inject(){
        return ['$state'];
    }
}


export default ViewLandingPageComponent;