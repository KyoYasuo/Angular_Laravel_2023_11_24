import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from './../../../services/user.service';
import { EventService } from './../../../services/event.service';

@Component({
	selector: 'app-my-account',
	templateUrl: './my-account.component.html',
	styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

	modalRef: BsModalRef;
	user: object = {};

	constructor(private _user: UserService,
				private _modalService: BsModalService,
				private _event: EventService) { }

	ngOnInit() {
		this.setUserData();
	}

	setUserData() {
		this.user = {};

        if (this._user.isUserLogin()) {
            this.user = this._user.getLoggedInUser();
        }
    }

    openEditProfilePopup(template: TemplateRef<any>) {
		this.modalRef = this._modalService.show(template, { class: 'modal-lg' });
	}

	updateUser(user) {
		this.user = user;

		let localStorageUser = this._user.getLoggedInUser();
		localStorageUser = {...localStorageUser, ...this.user};

		this._user.setCurrentUser(localStorageUser);
		this._event.fire('set_user_data', {});
	}
}
