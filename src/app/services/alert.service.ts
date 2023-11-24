import { Injectable } from '@angular/core';
import { EventService } from './event.service'

@Injectable({
    providedIn: 'root'
})
export class AlertService {

	time: number = 5000;

	constructor(private _event: EventService) {}

	showAlert(type: string, message: string, time=null) {
        if (time) {
            this.time = time;
        }

        let alertObj: object = {};

        switch (type) {
            case "success":
                alertObj = {
                    type: type,
                    message: message,
                    timeout: this.time
                }
                break;
            case "info":
                alertObj = {
                    type: type,
                    message: "<strong>Info!</strong> " + message,
                    timeout: this.time
                }
                break;

            default:
                alertObj = {
                    type: type,
                    message: "<strong>Warning!</strong> " + message,
                    timeout: this.time
                }
                break;
        }

        // fire set alert event
        let data = {
        	alert: alertObj
        }
        this._event.fire('show_alert', data);

    }

}