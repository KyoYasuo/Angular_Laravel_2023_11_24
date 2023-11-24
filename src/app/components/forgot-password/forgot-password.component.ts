import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from './../../services/http.service';
import { AlertService } from './../../services/alert.service';
import { URLS } from './../../config/urls.config';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

	forgotPasswordForm: FormGroup;
	submitted: boolean = false;
	forgotPassAPIRunnning: boolean = false;
	apiErros: object = {};

	constructor(private _formBuilder: FormBuilder,
				private _http: HttpService,
				private _router: Router,
				private _alert: AlertService) { }

	ngOnInit() {
		this.forgotPasswordForm = this._formBuilder.group({
			email: ['', [Validators.required, Validators.email]]
		});
	}

	get f() {
		return this.forgotPasswordForm.controls;
	}

	success;
	err;
	onSubmit() {
		this.forgotPassAPIRunnning = true;
		this.submitted = true;

		this.success='';
		this.err='';
		// stop here if form is invalid
        if (this.forgotPasswordForm.invalid) {
			this.forgotPassAPIRunnning = false;
            return;
        }

		this.submitted=false;

		let url = URLS.forgot_password;
		let params = this.forgotPasswordForm.value;

		this._http.post(url, params)
		.subscribe((res) => {

			setTimeout(() => {

			    this._alert.showAlert('success', res.message);

				this.success=res.message;
				// this._router.navigate([page]);
				this.forgotPassAPIRunnning = false;
				this.submitted = false;

				this.forgotPasswordForm.reset();
			}, 1000);

		}, (err) => {
			console.log(err);

			this.forgotPassAPIRunnning = false;
			if (err.error) {
				this.apiErros['email'] = err.message;
				this.err=err.message;
			
			}
			else{
				this._alert.showAlert('danger', 'Something went wrong');
				this.err='Something went wrong';
			
			}
		});
	}
}
