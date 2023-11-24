import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EventBroadcasterService } from './event-broadcaster.service';

import { v4 as uuid } from 'uuid';

@Injectable({
	providedIn: 'root'
})
export class EventService {
	machinUUIDNew: any;
  /**
	 * Constructor
	 */
	constructor(private _eventBroadcaster : EventBroadcasterService) { }

	/**
	 * Fire Event
	 *
	 * @param data [Event Data]
	 */
	fire(key: string, data: any): void {
		this._eventBroadcaster.broadcast(key, data);
	}

	/**
	 * Listen Event
	 */
	on(key: string): Observable<any> {
		return this._eventBroadcaster.on<any>(key);
	}

	getMachinId(){
		if(localStorage.getItem('machinUUID') == null){
			this.machinUUIDNew = uuid.v4();
			localStorage.setItem('machinUUID', this.machinUUIDNew);
		}else{
			this.machinUUIDNew = localStorage.getItem('machinUUID');
		}
		return this.machinUUIDNew;
	}
}
