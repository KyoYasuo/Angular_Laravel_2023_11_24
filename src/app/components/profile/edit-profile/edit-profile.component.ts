import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from './../../../services/http.service';
import { AlertService } from './../../../services/alert.service';
import { URLS } from './../../../config/urls.config';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

	@Input() modalRef;
	@Input() user;
	@Output() onEditUser = new EventEmitter();

	editProfileForm: FormGroup;
	submitted: boolean = false;
	editAPIRunnning: boolean = false;

	constructor(private _formBuilder: FormBuilder,
				private _http: HttpService,
				private _alert: AlertService) { }

	ngOnInit() {
		this.editProfileForm = this._formBuilder.group({
			name: [this.user['name'], Validators.required],
			email: [this.user['email'], [Validators.required, Validators.email]],
			country: [this.user['country']],
			state: [this.user['state']],
			city: [this.user['city']]
		});
	}

	get f() { return this.editProfileForm.controls; }

	onSubmit() {
		this.editAPIRunnning = true;
		this.submitted = true;

		// stop here if form is invalid
        if (this.editProfileForm.invalid) {
			this.editAPIRunnning = false;
            return;
        }


		let params = this.editProfileForm.value;

		let url = URLS.get_users + "/" + this.user['id'];
		this._http.put(url, params)
		.subscribe((res) => {
			let user = res.data;
			this.onEditUser.emit(user);

			this.modalRef.hide();
			this._alert.showAlert('success', res.message);

			this.editAPIRunnning = false;
			this.submitted = true;
		}, (err) => {
			console.log(err);
			this.editAPIRunnning = false;
		});
	}
}
