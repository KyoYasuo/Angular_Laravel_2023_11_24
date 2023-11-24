import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders } from  '@angular/common/http';
import { environment } from './../../environments/environment';
import { UserService } from './user.service';
import { map, catchError } from  'rxjs/operators';
import { AuthService } from "angularx-social-login";

@Injectable({
	providedIn: 'root'
})
export class HttpClientService {

	constructor(private httpClient: HttpClient,
				private _user: UserService,
				private _socialAuthService: AuthService) { }

	postMultipart(url: string, params: any = null) {

		url = environment.BASE_API_URL + url;
		let headers = this.getMultipartRequestHeaders();
		/*let httpOptions = {
			reportProgress: true,
			observe: 'events'
		}*/

		return this.httpClient.post<any>(url, params, {
            headers: headers,
            reportProgress: true,
            observe: 'events'
        });
		/*.pipe(
			map((res) => this.handleResponse(res)),
			catchError((err) => this.handleError(err))
		);*/

		/*return this.httpClient.post<any>(url, params, httpOptions)
		.pipe(map((event) => {

			switch (event.type) {

				case HttpEventType.UploadProgress:
				const progress = Math.round(100 * event.loaded / event.total);
				return { status: 'progress', message: progress };

				case HttpEventType.Response:
				return event.body;
				default:
				return `Unhandled event: ${event.type}`;
			}
		}));*/
	}

	/**
    * Set headers for requesr
    */
    getMultipartRequestHeaders() {
     	let headers = new HttpHeaders({
     		'Accept'        : 'application/json',
     		'Access-Control-Allow-Origin' : '*'
		});

     	if(this._user.isUserLogin()) {
     		let user = this._user.getLoggedInUser();
     		headers = headers.set('Authorization', 'Bearer ' + user['token']);
     	}

     	return headers;
    }

    /**
     * Handle Success Response
     *
     * @param response [API Error Response]
     */
    handleResponse(response: Response) {
        if (response.headers.get('Content-type') !== 'application/json') {
            return response['_body'];
        }

        return response.json();
    }

    /**
     * Handle Error Response
     *
     * @param error [Api Error]
     */
    handleError(error: Response) {
    	console.log(error);

        //check if user is not authorized then logout
        if(error.status === 401) {
        		this.resetUser();
            location.reload(true);
        }

     	return Promise.reject(error.json());
    }

    resetUser() {
    	let user = this._user.getLoggedInUser();
      if (user.provider) {
        this.socialLogout();
      }

      this._user.resetCurrentUser();
    }

    socialLogout(): void {
        this._socialAuthService.signOut();
    }
}
