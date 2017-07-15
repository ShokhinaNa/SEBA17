'use strict';


export default class MeetingsService {

    static get $inject(){
        return ['$http', 'API_URL'];
    }

    constructor($http,API_URL) {
        this.$http = $http;
        this.resourceUrl = `${ API_URL }/meeting/`;
    }

    static get name(){
        return 'meetingsService';
    }

    list() {
        let url = this.resourceUrl;
        return this.$http.get(url).then(responce => {
            return new Promise((resolve, reject) => {
                resolve(responce.data);
            });
        });
    }

    get(id) {
        let url = `${ this.resourceUrl }${ id }`;
        return this.$http.get(url).then(responce => {
            return new Promise((resolve, reject) => {
                resolve(convertDatesFromStrings(responce.data));
            });
        })
    }


    create(meeting) {
        let url = this.resourceUrl;
        return this.$http.post(url,meeting).then(responce => {
            return new Promise((resolve, reject) => {
                resolve(responce.data);
            });
        })
    }

    delete(id) {
        let url = `${ this.resourceUrl }${ id }`;
        return this.$http.delete(url).then(responce => {
            return new Promise((resolve, reject) => {
                resolve(responce.status);
            });
        })
    }

    findByFacilitatorId(facilitator_id) {
        return this.$http.get(`${ this.resourceUrl }findByFacilitator/${ facilitator_id }`).then(response => {
            return new Promise((resolve, reject) => {
                resolve(response.data);
            });
        })
    }

    saveTimeslots(meeting) {
        let url = `${ this.resourceUrl }${meeting._id}/timeslots`;
        return this.$http.put(url,meeting).then(responce => {
            return new Promise((resolve, reject) => {
                resolve(responce.data);
            });
        })
    }
}

function convertDatesFromStrings(meeting) {
    meeting.range[0] = new Date(meeting.range[0]);
    meeting.range[1] = new Date(meeting.range[1]);
    meeting.arranged_timeslot = new Date(meeting.arranged_timeslot);
    for (let bestSlot of meeting.bestSlots) {
        bestSlot.range[0] = new Date(bestSlot.range[0]);
        bestSlot.range[1] = new Date(bestSlot.range[1]);
    }
    for (let availability of meeting.availabilities) {
        for (let slot of availability.slots) {
            slot.range[0] = new Date(slot.range[0]);
            slot.range[1] = new Date(slot.range[1]);
        }
    }
    return meeting;
}