import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpService } from './../../../services/http.service';
import { AlertService } from './../../../services/alert.service';
import { TOTAL_SHABAD } from './../../../config/global.config';
import { URLS } from './../../../config/urls.config';

@Component({
	selector: 'app-edit-blog',
	templateUrl: './edit-blog.component.html',
	styleUrls: ['./edit-blog.component.scss']
})
export class EditBlogComponent implements OnInit {

	@Input() modalRef;
	@Input() postData;
	@Output() onUpdatePost = new EventEmitter();

	editPostForm: FormGroup;
	submitted: boolean = false;
	editPostAPIRunnning: boolean = false;
	totalShabad: number = TOTAL_SHABAD;

	constructor(private _formBuilder: FormBuilder,
				private _http: HttpService,
				private _alert: AlertService) { }

	ngOnInit() {

		let shabadVal: any = '';
	    if (this.postData['news_shabad']
	    	&& this.postData['news_shabad'] > 0) {
	    	shabadVal = this.postData['news_shabad'];
	    }

		this.editPostForm = this._formBuilder.group({
			title: [this.postData['news_title'], Validators.required],
			content: [this.postData['news_text'], Validators.required],
			shabad_id: [shabadVal],
			is_approved: [this.postData['is_approved']]
		});
	}

	get f() { return this.editPostForm.controls; }

	onSubmit() {
		this.editPostAPIRunnning = true;
		this.submitted = true;

		if (this.editPostForm.invalid) {
			this.editPostAPIRunnning = false;
            return;
        }

		let url = URLS.blog + '/' + this.postData['news_id'];
		let params = this.editPostForm.value;
		params['author'] = this.postData['news_author'];

		if (!params['shabad_id']) {
			delete params['shabad_id'];
		}

		this._http.put(url, params)
		.subscribe((res) => {
			this._alert.showAlert('success', res.message);
			this.editPostAPIRunnning = false;

			this.onUpdatePost.emit(res.data);

			this.modalRef.hide();
		}, (err) => {
			console.log(err);
			this.editPostAPIRunnning = false;
		});
	}

	counter(i: number) {
	    return new Array(i);
	}

}
