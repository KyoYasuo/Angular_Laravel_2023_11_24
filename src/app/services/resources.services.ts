import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from  '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ResourcesService {

	constructor(private http: HttpClient,
				) { }

	
    get(url: string, params: any = null): Observable<any> {

    	url = environment.URL + url;

    	return this.http.get(url);
	}
	get2(url: string, params: any = null): Observable<any> {

    	url = environment.URL + url;

    	return this.http.get(url,{params:params});
	
	}
	get3(url: string, params: any = null): Observable<any> {

    	
    	return this.http.get(url);
	}
	postJson(url: string, params: {}): Observable<any> {

		url = environment.URL + url;
		// let options = {
		// 	headers: new HttpHeaders().set('Content-Type', 'application/json')
		// };
		return this.http.post(url,params);
	}
  post(url: string, params: URLSearchParams): Observable<any> {

	url = environment.URL + url;
	// var param =new URLSearchParams();
	// param.set("machine_id",params['machine_id']);
	// param.set("media_id",params['media_id']);
	// param.set("view_date",params['view_date']);
	// param.set("user_id",params['user_id']);
	let options = {
		headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
	};
	return this.http.post(url,params.toString(),options);
}

// postjson(url: string,params): Observable<any> {

// 	url = environment.URL + url;
// 	// var param =new URLSearchParams();
// 	// param.set("machine_id",params['machine_id']);
// 	// param.set("media_id",params['media_id']);
// 	// param.set("view_date",params['view_date']);
// 	// param.set("user_id",params['user_id']);
	
// 	return this.http.post(url,params);
// }



postMultipart(url: string, params: FormData): Observable<any> {

	url = environment.URL + url;
	return this.http.post(url,params,{
		reportProgress:true,
		observe: 'events'
	});
}

}
