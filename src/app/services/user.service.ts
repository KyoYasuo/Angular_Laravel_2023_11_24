import { Injectable } from '@angular/core';

import { USER_ROLES_IDS, USER_ROLES_OBJ } from './../config/user.config'

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor() { }

  	/**
	 * Set current logged in user in local storage
	 * @param Object  user
	 */
	setCurrentUser(user) {
	 	localStorage.setItem('current_user', JSON.stringify(user));
	}

	/**
	 * Remove logged in user from localstorage
	 */
	resetCurrentUser() {
	 	localStorage.removeItem('current_user');
	}

	/**
	 * is user logged in
	 */
	isUserLogin() {
	 	let user = localStorage.getItem('current_user');

	 	return (user) ? true : false;
	}

	getLoggedInUser() {
	 	return JSON.parse(localStorage.getItem('current_user'));
	}

	isUserValidateForThisAction(action) {
		if (!this.isUserLogin()) {
			return false;
		}

		let user = this.getLoggedInUser();

		let flag = false;

		if (!user['roles'] || user['is_block']) {
			return flag;
		}

		//admin/super admin/user
		let definedUserRoles = Object.keys(USER_ROLES_IDS);
		if (definedUserRoles.indexOf(action) != -1) {

			let userRole = {};
			USER_ROLES_OBJ.forEach((role) => {
				if (role.id == user.role_id) {
					userRole = role;
				}
			});

			// check user role is admin, super admin or authenticated user
			if (Object.keys(userRole).length > 0
				&& action == userRole['key']) {
				flag = true;
			}
		}


		// check user permissions here
		if (user['roles'].indexOf(action) != -1) {
			flag = true;
		}

		return flag;
	}
}
