import { Component, OnInit } from '@angular/core';
import { URLS } from './../../../config/urls.config';
import { HttpService } from './../../../services/http.service';
import { AlertService } from './../../../services/alert.service';

@Component({
	selector: 'app-authors',
	templateUrl: './authors.component.html',
	styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

	translationAuthors: Array<any> 	= [];

	constructor(protected _http: HttpService,
				protected _alert: AlertService) { }

	ngOnInit() {
		this.getTranslationAuthors();
	}

	getTranslationAuthors(){
		let url = URLS.get_translation_authors;

		this._http.get(url)
		.subscribe((response) => {
			this.translationAuthors = response.data;
		}, (error) =>{
			console.log(error);
		});
	}

	changeStatus(author) {
		let status = '1';
		if (author['Active']) {
			status = '0';
		};
		author["Active"] = !author["Active"];

		let url = URLS.change_authors_status;
		url = url.replace("ID", author['id']).replace("STATUS", status);

		this._http.post(url)
		.subscribe((res) => {
			this._alert.showAlert('success', res.message);
		}, (error) =>{
			console.log(error);
			author["Active"] = !author["Active"];
			this._alert.showAlert('error', error.message);
		});
	}

	changeDefaultStatus(author) {

		this.translationAuthors.forEach((val) => {
			val.Default = false;
			if (author.id == val.id) {
				val.Default = true;
			}
		});

		// author["Default"] = !author["Default"];

		let url = URLS.change_authors_default_status;
		url = url.replace("ID", author['id']);

		this._http.put(url, {})
		.subscribe((res) => {
			this._alert.showAlert('success', res.message);
		}, (error) =>{
			author["Default"] = false;
			this._alert.showAlert('error', error.message);
		});
	}
}
