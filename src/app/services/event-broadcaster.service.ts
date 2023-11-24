import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';


interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class EventBroadcasterService {

  /**
     * Event Bus
     */
    private _eventBus: Subject<BroadcastEvent>;

    /**
     * Constructor
     */
    constructor() {
        this._eventBus = new Subject<BroadcastEvent>();
    }

    /**
     * Broadcast Event
     */
    broadcast(key: any, data?: any) {
        this._eventBus.next({key, data});
    }

    /**
     * Listen Event
     */
    on<T>(key: any): Observable<T> {
        return this._eventBus.asObservable()
        .filter(event => event.key === key)
        .map(event => <T>event.data);
    }

}
