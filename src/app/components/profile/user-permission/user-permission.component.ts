import { Component, OnInit } from '@angular/core';

import { USER_ROLES_OBJ } from './../../../config/user.config';
import { URLS } from './../../../config/urls.config';
import { HttpService } from './../../../services/http.service';
import { AlertService } from './../../../services/alert.service';

@Component({
	selector: 'app-user-permission',
	templateUrl: './user-permission.component.html',
	styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {

	userRoles: Array<any> = USER_ROLES_OBJ;
	permissions: Array<any> = [];
	rolePermissions: Array<any> = [];

	isSavePermissionsApiRunning: boolean = false;

	constructor(private _http: HttpService,
				private _alert: AlertService) { }

	ngOnInit() {
		this.getPermissions();
	}

	getPermissions(){
		let url = URLS.get_permissions;

		this._http.get(url)
		.subscribe((response) => {
			this.permissions = response.data;

			this.permissions.forEach((p) => {
				let obj = {
					id: p['id'],
					name: p['name']
				};

				this.userRoles.forEach((role) => {
                                    let ids = []
                                    for(let data of p['role_ids']){
                                        ids.push(parseInt(data))
                                    }
                                    p['role_ids'] = ids
                                   
					let status = 0;
//					if (p['role_ids'].indexOf(role['id']) != -1) {
					if (p['role_ids'].indexOf(role['id']) != -1) {
						status = 1
					}
					obj[role['key']] = status;
				});
				this.rolePermissions.push(obj);

			});
		}, (error) =>{
			console.log(error);
		});
	}

	savePermissions() {
		this.isSavePermissionsApiRunning = true;
		let newRolePermissions = {};

		this.userRoles.forEach((role) => {
			newRolePermissions[role['id']] = [];

			this.rolePermissions.forEach((permission) => {
				if (role['key'] == 'super_admin' && permission['super_admin']) {
					newRolePermissions[role['id']].push(permission['id']);
				} else if (role['key'] == 'admin' && permission['admin']) {
					newRolePermissions[role['id']].push(permission['id']);
				} else if (role['key'] == 'authenticated_user' && permission['authenticated_user']) {
					newRolePermissions[role['id']].push(permission['id']);
				}
			});
		});

		let url = URLS.get_permissions;

		this._http.post(url, newRolePermissions)
		.subscribe((response) => {
			this._alert.showAlert('success', response.message);

			this.isSavePermissionsApiRunning = false;
		}, (error) =>{
			this.isSavePermissionsApiRunning = false;
		});

	}

}
