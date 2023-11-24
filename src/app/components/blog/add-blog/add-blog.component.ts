import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpService } from './../../../services/http.service';
import { HttpClientService } from './../../../services/http-client.service';
import { UserService } from './../../../services/user.service';
import { AlertService } from './../../../services/alert.service';

import { URLS } from './../../../config/urls.config';
import { TOTAL_SHABAD } from './../../../config/global.config';

@Component({
	selector: 'app-add-blog',
	templateUrl: './add-blog.component.html',
	styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent implements OnInit {

	@Input() modalRef;
	@Input() blogData;
	@Input() shabadId = 0;
	@Output() onAddBlog = new EventEmitter;

	addBlogForm: FormGroup;
	submitted: boolean = false;
	addBlogAPIRunnning: boolean = false;

	totalShabad: number = TOTAL_SHABAD;
	uploadProgress: number = 0;

	constructor(private _formBuilder: FormBuilder,
				private _http: HttpService,
				private _httpClient: HttpClientService,
				private _user: UserService,
				private _alert: AlertService,
				private _router: Router,
				private _activeRoute: ActivatedRoute) { }

	ngOnInit() {
		if(this.blogData && this.blogData.news_shabad){
			this.shabadId = this.blogData.news_shabad;
		}
	    let shabadVal: any = '';
	    if (this.shabadId > 0) {
	    	shabadVal = this.shabadId;
		}
		
		if(!this.blogData) this.blogData = { edit: null };
		else this.blogData.edit = 1;

		this.addBlogForm = this._formBuilder.group({
			title: ['', Validators.required],
			content: ['', Validators.required],
			news_shabad: [shabadVal],
			image: ['']
		});
	}

	get f() { return this.addBlogForm.controls; }

	uploadImage(event) {
		if (event.target.files.length > 0) {
		      let file = event.target.files[0];
		      this.addBlogForm.get('image').setValue(file);
		}
	}


	onSubmit() {
		this.addBlogAPIRunnning = true;
		this.submitted = true;

		if (this.addBlogForm.invalid) {
			this.addBlogAPIRunnning = false;
            return;
        }

        if (this.addBlogForm.get('image').value) {
			let url = URLS.file_upload_single;

			let formData = new FormData();
	    	formData.append('file', this.addBlogForm.get('image').value);

			this._httpClient.postMultipart(url, formData)
			.subscribe((res) => {
				if (res['type'] == 1) {
					this.uploadProgress = Math.round(100 * res['loaded'] / event['total']);
				}

				if (res['ok'] && res['body'] && res['body']['data']) {
					let savedImgName = res['body']['data']['file_name']
					this.saveData(savedImgName);
				}

		    }, (err) => {
				console.log(err);
				this.addBlogAPIRunnning = false;
		    });
        } else {
			this.saveData();
        }

	}

	saveData(imgName=null) {
		let user = this._user.getLoggedInUser();

		let url = URLS.blog;
		let params = this.addBlogForm.value;
		params['author'] = user['name'];

		if (imgName) {
			params['image'] = imgName;
		}

		if (!params['news_shabad']) {
			delete params['news_shabad'];
		}
		if(!this.blogData.edit){
			this._http.post(url, params)
			.subscribe((res) => {
				let blog = res.data;

				this._alert.showAlert('success', res.message);
				this.addBlogAPIRunnning = false;
				this.submitted = false;

				this.onAddBlog.emit(blog);
				this.modalRef.hide();

			}, (err) => {
				console.log(err);
				this.addBlogAPIRunnning = false;
			});
		}
		else {
			
			this._http.put(url + '/' + this.blogData.news_id, params)
			.subscribe((res) => {
				let blog = res.data;

				this._alert.showAlert('success', res.message);
				this.addBlogAPIRunnning = false;
				this.submitted = false;

				this.onAddBlog.emit(blog);
				this.modalRef.hide();

			}, (err) => {
				console.log(err);
				this.addBlogAPIRunnning = false;
			});
		}
	}

	counter(i: number) {
	    return new Array(i);
	}
}
