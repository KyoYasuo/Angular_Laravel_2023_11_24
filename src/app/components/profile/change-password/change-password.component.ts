import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from './../../../services/http.service';
import { AlertService } from './../../../services/alert.service';
import { URLS } from './../../../config/urls.config';

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

	changePasswordForm: FormGroup;
	submitted: boolean = false;
	changePassAPIRunnning: boolean = false;

	constructor(private _formBuilder: FormBuilder,
				private _http: HttpService,
				private _alert: AlertService,
				private _router: Router) { }

	ngOnInit() {
		this.changePasswordForm = this._formBuilder.group({
			old_password: ['', Validators.required],
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirm_password: ['', Validators.required],
		}, {validator: this.checkPasswords });
	}

	checkPasswords(group: FormGroup) {
		// here we have the 'passwords' group
	  	let pass = group.controls.password.value;
	  	let confirmPass = group.controls.confirm_password.value;

	  	return pass === confirmPass ? null : { passwordsNotEqual: true }
	}

	get f() { return this.changePasswordForm.controls; }

	onSubmit() {
		this.changePassAPIRunnning = true;
		this.submitted = true;

		// stop here if form is invalid
        if (this.changePasswordForm.invalid) {
			this.changePassAPIRunnning = false;
            return;
        }

		let url = URLS.change_password;
		let params = this.changePasswordForm.value;

		this._http.post(url, params)
		.subscribe((res) => {
			this._alert.showAlert('success', res.message);

			setTimeout(() => {
				this._router.navigate(['/my-account'])
			},2000);

			this.changePassAPIRunnning = false;
			this.submitted = false;
			this.changePasswordForm.reset();
		}, (err) => {
			this._alert.showAlert('danger', err.message);
			this.changePassAPIRunnning = false;
		});
	}
}
