import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs';
import { AuthService } from "angularx-social-login";

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from './../../environments/environment';
import { UserService } from './user.service';
import { HttpHeaders } from '@angular/common/http';

const API = environment.BACKEND_URL +'/';
const WEB = environment.FRONTEND_URL +'/';

@Injectable({
	providedIn: 'root'
})
export class HttpService {

  getAPI() {
    return API;
  }
  getWEB() {
    return WEB;
  }

	constructor(private http: Http,
              private _user: UserService,
              private _socialAuthService: AuthService) { }

	/**
   	* GET Request
   	*
   	* @param [url] [string]
   	*/
  	get(url: string, params: any = null): Observable<any> {

    	url = environment.BASE_API_URL + url;

  		let headers = this.getRequestHeaders();
  		var options = new RequestOptions({ headers: headers, params:params });

    	return this.http.get(url, options)
        .map((res) => this.handleResponse(res))
        .catch((err) => this.handleError(err));
   }
   get2(url: string, params: any = null): Observable<any> {

    
    let headers = this.getRequestHeaders();
    var options = new RequestOptions({ headers: headers, params:params });

    return this.http.get(url, options)
      .map((res) => this.handleResponse(res))
      .catch((err) => this.handleError(err));
 }

  /**
   * POST Request
   *
   * @param [url] [string]
   * @param [params] [object] [Data that pass to url]
   */
  post(url: string, params = {}): Observable<any> {

      url = environment.BASE_API_URL + url;

      let headers = this.getRequestHeaders();
      var options = new RequestOptions({ headers: headers });

      return this.http.post(url, JSON.stringify(params), options)
      .map((res) => this.handleResponse(res))
      .catch((err) => this.handleError(err));
  }

  /**
   * POST Request
   *
   * @param [url] [string]
   * @param [params] [object] [Data that pass to url]
   */
  put(url: string, params): Observable<any> {

      url = environment.BASE_API_URL + url;

      let headers = this.getRequestHeaders();
      var options = new RequestOptions({ headers: headers });

      return this.http.put(url, JSON.stringify(params), options)
      .map((res) => this.handleResponse(res))
      .catch((err) => this.handleError(err));
  }

  /**
     * DELETE Request
     *
     * @param [url] [string]
     */
    delete(url: string): Observable<any> {

        url = environment.BASE_API_URL + url;

        let headers = this.getRequestHeaders();
        var options = new RequestOptions({ headers: headers });

        /* send request*/
        return this.http.delete(url, options)
        .map((res) => this.handleResponse(res))
        .catch((err) => this.handleError(err));
    }

    /**
     * Set headers for requesr
     */
    getRequestHeaders() {
      var headers = new Headers({
         'Content-Type'  : 'application/json',
         'Accept'        : 'application/json',
         'Access-Control-Allow-Origin' : '*',
         'api-key': '64EA089F-9D9E-41F3-864A-790C2658EE98'
      });

      if(this._user.isUserLogin()) {
        let user = this._user.getLoggedInUser();
        headers.append('Authorization', 'Bearer ' + user['token']);
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

        //check if user is not authorized then logout
        if(error.status === 401) {
        		this.resetUser();
            location.reload(true);
        }

     	return Promise.reject(error.json());
    }

    resetUser() {
    	let user = this._user.getLoggedInUser();
      if (user && user.provider) {
        this.socialLogout();
      }

      this._user.resetCurrentUser();
    }

    socialLogout(): void {
        this._socialAuthService.signOut();
    }







}
