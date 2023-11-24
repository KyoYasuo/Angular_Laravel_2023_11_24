import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider} from "angularx-social-login";
import { ReCaptcha2Component } from 'ngx-captcha';

import { HttpService } from './../../services/http.service';
import { UserService } from './../../services/user.service';
import { AlertService } from './../../services/alert.service';
import { environment } from './../../../environments/environment';

import { EventService } from './../../services/event.service';
import { URLS } from './../../config/urls.config';
import { ResourcesService } from 'src/app/services/resources.services';

import Swal from 'sweetalert2';
import { userInfo } from 'os';
declare var $;
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    baseUrl = environment.BASE_API_URL
	loginForm: FormGroup;
	submitted: boolean = false;
	loginAPIRunnning: boolean = false;
	loginFormErros: object = {};
	afterSingUp = 'false';

	socialUser: SocialUser;

	socialServiceSubscriptions: Subscription[] = [];
	showPasswordInput: boolean = false;
//	public readonly sitekey = '6Ld4zcEUAAAAAHnS9Mii1xUCHtZ4Ino-N9LslYUb'; 
//	public readonly sitekey = '6LfrU6kUAAAAAEOWXtOa_ai7jY0c0HXwoFBQruA9';
    public readonly sitekey= "6Ldy-8IUAAAAAONnbLdHFkv3HZFw55O-7EFREYZ3";
	@ViewChild('captchaElem', { static: true}) captchaElem: ReCaptcha2Component;

	// public theme: 'light' | 'dark' = 'light';
	// public size: 'compact' | 'normal' = 'normal';
	// public lang = 'en';
	// public type: 'image' | 'audio';
	// public useGlobalDomain: boolean = false;

	constructor(private _formBuilder: FormBuilder,
				private _http: HttpService,
				private _user: UserService,
				private _router: Router,
				private _activeRoute: ActivatedRoute,
				private _socialAuthService: AuthService,
				private _alert: AlertService,
				private _event: EventService,
				private rs:ResourcesService) { }
				setSelected(id)
				{			
					$(".active1").removeClass("active1");
					 $("#"+id).addClass("active1");
				}
	ngOnInit() {

		 document.getElementById("main2").scrollTo(0,0);
		 
		this.afterSingUp = this._activeRoute.snapshot.queryParamMap.get("afterSingUp");
		if(this.afterSingUp == 'true'){
			Swal.fire('','Thank you for signing up for Khojgurbani! We have sent you account verification link to your email(' + this._activeRoute.snapshot.queryParamMap.get("email")  + '). Please check your email.','success');
		}
		this.setSelected("login");
		$('.navbar-collapse').collapse('hide');
		$("#collapseBasic").hide();
		this.loginForm = this._formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
			recaptcha: ['', Validators.required]
		});
 
		if(this._user.isUserLogin()) {
			this._router.navigate(['/']);
			return;
		}

		this._activeRoute.queryParams.subscribe(params => {
			if (params['message']) {
				this._alert.showAlert('success', params['message']);
			}
	    });

		this.socialServiceSubscriptions[0] = this._socialAuthService.authState.subscribe((user) => {
	    	if (user) {
	    		this.loginUserWithSocial(user);
	    	}
	    });
	}

	ngOnDestroy() {
		this.socialServiceSubscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.socialServiceSubscriptions = [];
	}

	get f() {
		return this.loginForm.controls;
	}

	onLogin() {
		this.loginAPIRunnning = true;
		this.submitted = true;

		// stop here if form is invalid
        if (this.loginForm.invalid) {
			this.loginAPIRunnning = false;
            return;
        }


		let url = URLS.login;
		let params = this.loginForm.value;
		this._http.post(url, params)
		.subscribe((res) => {
			let user = res.data.user;
			user['token'] = res.data.token;

			if(user && user.token) {
				this._user.setCurrentUser(user);
				
				let data = []; this._event.fire('setRoleId', data);
				this._event.fire('set_user_data', {});
			}

			setTimeout(() => {

				let page = '/home';

				this._activeRoute.queryParams.subscribe(params => {
					if (params['page']) {
						page = params['page'];
					}
			    });

			    this._alert.showAlert('success', 'User is successfully logged in');

				window.history.back();
				//this._router.navigate([page]);
				this.loginAPIRunnning = false;
			}, 1000);

		}, (err) => {
			console.log(err);

			Swal.fire('',err.message,'error');
			//this.captchaElem.resetCaptcha();
			//this.captchaElem.
			this.loginAPIRunnning = false;

//			this.submitted = false;
			if (err.status == 'error') {
				this.loginFormErros['email'] = err.message;
			}

			if(!err.validation_errors) {
				return;
			}

			let errors = err.validation_errors;
			Object.keys(errors).forEach((key) => {
				if(key === 'email') {
					this.loginFormErros['email'] = errors['email'][0];
				} else if(key === 'password') {
					this.loginFormErros['password'] = errors['password'][0];
				}
			});


		});
	}

	signInWithFB(): void {
	    this._socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
	    this._socialAuthService.authState.subscribe((user) => {
	    	if (user) {
	    	}
	    });
	}

	signInWithGoogle(): void {
	    this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
	}

	loginUserWithSocial(user) {

		let url = URLS.login_with_social;
		let params = {
			name: user['name'],
			email: user['email'],
			provider: user['provider'],
			photo_url: user['photoUrl'],
			social_account_id: user['id']
		};
		this._http.post(url, params)
		.subscribe((res) => {
			let user = res.data.user;
			user['token'] = res.data.token;

			if(user && user.token) {
				this._user.setCurrentUser(user);
				this._event.fire('set_user_data', {});
			}

			setTimeout(() => {
				let page = '/home';

				this._activeRoute.queryParams.subscribe(params => {
					if (params['page']) {
						page = params['page'];
					}
			    });

				window.history.back();
				//this._router.navigate([page]);
			}, 1000);

		}, (err) => {
			console.log(err);
		});
	}

	apierror;
	continueToPassword() {
		this.apierror=''
		if (this.loginForm.get('email').invalid) {
			this.loginForm.get('email').markAsDirty();
			this.submitted = true;
            return;
		}
		let param=new URLSearchParams();
		param.set("email",this.loginForm.get("email").value);
        this.rs.post("user-check",param).subscribe((res)=>{
			 if(res['data'].result)
			 {              
		             this.submitted = false;
		             this.showPasswordInput = true;
			 }
			 else{
				 this.apierror="Email does not exists";
			 }
		},(err)=>{
			this.apierror="Something went wrong";
		});
	}

	revertToEmailInput() {
		this.showPasswordInput = false;
		this.loginFormErros = {};
	}

	handleReset(): void {

	}

	handleSuccess(captchaResponse: string): void {

	}

	handleLoad(): void {

	}

	handleExpire(): void {

	}
}
