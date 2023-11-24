import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, Params} from "@angular/router";

import { HttpService } from './../../services/http.service';
import { URLS } from './../../config/urls.config';

@Component({
	selector: 'app-donates',
	templateUrl: './donates.component.html',
	styleUrls: ['./donates.component.scss']
})
export class DonateComponent implements OnInit {

	words: Array<any> = [];
	wordDetail: Object = {};
	isWordDetailApiRunning: Boolean = false;
	searchedWord: string = "";
	currentTimeout: any = null;
	selectedLang: string = "gurmukhi";

	constructor(private _http: HttpService, private _activeRoute: ActivatedRoute, private router: Router) {
		
	}

	ngOnInit() {
	}

}
