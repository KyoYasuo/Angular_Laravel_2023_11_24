import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpService } from './../../../../services/http.service';
import { AlertService } from './../../../../services/alert.service';
import { URLS } from './../../../../config/urls.config';
import { USER_ROLES_OBJ } from './../../../../config/user.config';

@Component({
	selector: 'app-edit-user',
	templateUrl: './edit-user.component.html',
	styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {


	dis=false;
	checkvalue(event){
		if(event.currentTarget.checked){
				  this.dis2=true;
				  this.dis=false;
		}
		else{
			this.dis2=false;
			this.dis=false;
		}
	}


	checkvalue2(event){
		if(event.currentTarget.checked){
				  this.dis2=false;
				  this.dis=true;
		}
		else{
			this.dis2=false;
			this.dis=false;
		}
	}
	user:object = {};
	userRoles: Array<any> = USER_ROLES_OBJ;

	updateUserForm: FormGroup;
	submitted: boolean = false;
	updateAPIRunnning: boolean = false;

	constructor(private _http: HttpService,
				private _activeRoute: ActivatedRoute,
				private _formBuilder: FormBuilder,
				private _router: Router,
				private _alert: AlertService) {
		this._activeRoute.params.subscribe((params) => {
			let userId = params.id;
			this.getUserDetail(userId);
      	});
	}

	ngOnInit() {
		this.updateUserForm = this._formBuilder.group({
			role_id: ['', Validators.required],
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			country: [''],
			state: [''],
			city: [''],
			is_active: [''],
			auto_approve: [''],
			is_block: [''],
		});
	}


	getUserDetail(id) {
		let url = URLS.get_user + "/" + id;

		this._http.get(url)
		.subscribe((res) => {
			this.user = res.data;
			this.setFormValues();
		}, (error) =>{
			console.log(error);
		});
	}

	dis2=false;
	setFormValues() {
		if(this.user['auto_approve'])
		{
			this.dis2=true;
		}
		if(this.user['is_block'])
		{
			this.dis=true;
		}
		this.updateUserForm.setValue({
			role_id: this.user['role_id'],
			name: this.user['name'],
			email: this.user['email'],
			country: this.user['country'],
			state: this.user['state'],
			city: this.user['city'],
			is_active: (this.user['is_active']) ? 1 : 0,
			auto_approve: (this.user['auto_approve']) ? 1 : 0,
			is_block: (this.user['is_block']) ? 1 : 0
		});
	}

	get f() { return this.updateUserForm.controls; }

	onSubmit() {
		this.updateAPIRunnning = true;
		this.submitted = true;

		// stop here if form is invalid
        if (this.updateUserForm.invalid) {
			this.updateAPIRunnning = false;
            return;
        }


		let url = URLS.get_users + "/" + this.user['id'];
		let params = this.updateUserForm.value;

		this._http.put(url, params)
		.subscribe((res) => {
			this._alert.showAlert('success', res.message);
			setTimeout(() => {
				this._router.navigate(['/my-account/users']);
			}, 1000);

			this.updateAPIRunnning = false;
		}, (err) => {
			console.log(err);
			this.updateAPIRunnning = false;
		});
	}
}
