import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../services/user.service';

@Component({
    selector: 'app-my-account-layout',
    templateUrl: './my-account-layout.component.html',
    styleUrls: ['./my-account-layout.component.scss']
})
export class MyAccountLayoutComponent implements OnInit {


    autocompleteItemsAsObjects = [
        {value: 'Item1', id: 0, extra: 0},
        {value: 'item2', id: 1, extra: 1},
        'item3'
    ];
    user: object = {};

    constructor(
        private _user: UserService) { }

    ngOnInit() {
        if (this._user.isUserLogin()) {
            this.user = this._user.getLoggedInUser();
        }
    }

    validateAction(action) {
        let flag = this._user.isUserValidateForThisAction(action);
        return flag;
    }

}
