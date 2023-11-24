import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from './../../services/http.service';
import { AlertService } from './../../services/alert.service';
import { URLS } from './../../config/urls.config';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

	resetPasswordToken: string = null;
	userEmail: string = null;

	resetPasswordForm: FormGroup;
	submitted: boolean = false;
	resetPassAPIRunnning: boolean = false;

	constructor(private _activeRoute: ActivatedRoute,
				private _http: HttpService,
				private _alert: AlertService,
				private _router: Router,
				private _formBuilder: FormBuilder) {
		this._activeRoute.params.subscribe((params) => {
			if (params.token) {
				this.resetPasswordToken = params.token;
				this.getEmailByToken();
			}
      	});
	}

	ngOnInit() {
		this.resetPasswordForm = this._formBuilder.group({
			password: ['', [Validators.required, Validators.minLength(6)]],
			password_confirmation: ['', Validators.required],
		}, {validator: this.checkPasswords });
	}

	checkPasswords(group: FormGroup) {
		// here we have the 'passwords' group
	  	let pass = group.controls.password.value;
	  	let confirmPass = group.controls.password_confirmation.value;

	  	return pass === confirmPass ? null : { passwordsNotEqual: true }
	}

	get f() { return this.resetPasswordForm.controls; }

	getEmailByToken() {
		let url = URLS.reset_password;

		if (this.resetPasswordToken) {
			url += '/' + this.resetPasswordToken;
		}

		this._http.get(url)
		.subscribe((res) => {
			this.userEmail = res.data.email;
		}, (err) => {
			this._alert.showAlert('danger', err.message, 3000);
			setTimeout(() => {
				this._router.navigate(['/login'])
			},3000);
		});
	}

	onResetPassword() {
		this.resetPassAPIRunnning = true;
		this.submitted = true;

		// stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
			this.resetPassAPIRunnning = false;
            return;
        }

		let url = URLS.reset_password;
		let params = this.resetPasswordForm.value;
		params['email'] = this.userEmail;
		params['token'] = this.resetPasswordToken;

		this._http.post(url, params)
		.subscribe((res) => {
			this.resetPassAPIRunnning = false;
			this.submitted = false;
			this.resetPasswordForm.reset();
		}, (err) => {
			this._alert.showAlert('danger', err.message, 3000);

			this.resetPassAPIRunnning = false;
		}, () => {
			this._alert.showAlert('success', 'Your Password is successfully changed.', 3000);
			setTimeout(() => {
				this._router.navigate(['/login'])
			},3000);
		});

	}

}
