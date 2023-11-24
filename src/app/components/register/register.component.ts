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
import { EventService } from './../../services/event.service';
import { URLS } from './../../config/urls.config';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

	registerForm: FormGroup;
	submitted: boolean = false;
	registerAPIRunnning: boolean = false;
	socialServiceSubscriptions: Subscription[] = [];
//	public readonly sitekey = '6LczHcIUAAAAAMeKnsBKrQc--rzG6pPp-WhXsJOj';
//	public readonly sitekey = '6LfrU6kUAAAAAEOWXtOa_ai7jY0c0HXwoFBQruA9';

    public readonly sitekey= "6Ldy-8IUAAAAAONnbLdHFkv3HZFw55O-7EFREYZ3";
	@ViewChild('captchaElem', { static: true}) captchaElem: ReCaptcha2Component;

	public theme: 'light' | 'dark' = 'light';
	public size: 'compact' | 'normal' = 'normal';
	public lang = 'en';
	public type: 'image' | 'audio';
	public useGlobalDomain: boolean = false;

	constructor(private _formBuilder: FormBuilder,
				private _http: HttpService,
				private _router: Router,
				private _user: UserService,
				private _socialAuthService: AuthService,
				private _alert: AlertService,
				private _event: EventService) { }

	ngOnInit() {
		if(this._user.isUserLogin()) {
			this._router.navigate(['/']);
			return;
		}

		this.registerForm = this._formBuilder.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirm_password: ['', Validators.required],
			recaptcha: ['', Validators.required],
			country: [''],
			state: [''],
			city: [''],
		}, {validator: this.checkPasswords });

		this.socialServiceSubscriptions[0] = this._socialAuthService.authState.subscribe((user) => {
	    	if (user) {
	    		this.signupUserWithSocial(user);
	    	}
	    });
	}

	ngOnDestroy() {
		this.socialServiceSubscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.socialServiceSubscriptions = [];
	}

	checkPasswords(group: FormGroup) {
		// here we have the 'passwords' group
	  	let pass = group.controls.password.value;
	  	let confirmPass = group.controls.confirm_password.value;

	  	return pass === confirmPass ? null : { passwordsNotEqual: true }
	}

	get f() { return this.registerForm.controls; }

	onSubmit() {
		this.registerAPIRunnning = true;
		this.submitted = true;

		// stop here if form is invalid
        if (this.registerForm.invalid) {
			this.registerAPIRunnning = false;
			this.captchaElem.resetCaptcha();
            return;
        }
 

		let url = URLS.register;
		let params = this.registerForm.value;
		this.submitted=false;
		this._http.post(url, params)
		.subscribe((res) => {
			this._alert.showAlert('success', res.message);
			setTimeout(() => {
				this._router.navigate(['login'], { queryParams: { afterSingUp: true, email: params.email }});
			}, 1000);

			this.registerAPIRunnning = false;
		}, (err) => {
			console.log(err);
			this.captchaElem.resetCaptcha();
			if(err.errors) {
				Object.values(err.errors).forEach((msg) => {
					this._alert.showAlert('danger', msg[0]);
				});
			}
			else{
				this._alert.showAlert('danger', 'Something went wrong');
			}
			this.registerAPIRunnning = false;
		})
	}

	signInWithFB(): void {
	    this._socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then();
	    // this._socialAuthService.authState.subscribe((user) => {
	    //   	// this.user = user;
	    // });
	}

	signInWithGoogle(): void {
	    this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
	}

	signupUserWithSocial(user) {

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
				let page = '/';
				this._router.navigate([page]);
			}, 1000);

		}, (err) => {
			console.log(err);
		});
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
