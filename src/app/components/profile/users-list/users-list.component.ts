import { Component, OnInit } from '@angular/core';
import { URLS } from './../../../config/urls.config';
import { USER_ROLES, USER_ROLES_IDS } from './../../../config/user.config';
import { HttpService } from './../../../services/http.service';

@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

	users: Array<any> 	= [];

	constructor(private _http: HttpService) { }

	ngOnInit() {
		this.getUsers();
	}

	getUsers(){
		let url = URLS.get_users;

		this._http.get(url)
		.subscribe((response) => {
			this.users = response.data;

			this.users.forEach((user) => {
				user['role'] = USER_ROLES[user.role_id];

				/*if (user.role_id == USER_ROLES_IDS.super_admin) {
					user['is_hide'] = true;
				}*/
			});
		}, (error) =>{
			console.log(error);
		});
	}
}
