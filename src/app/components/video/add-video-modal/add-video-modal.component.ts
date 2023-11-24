import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpService } from './../../../services/http.service';
import { UserService } from './../../../services/user.service';
import { AlertService } from './../../../services/alert.service';

import { URLS } from './../../../config/urls.config';
import { TOTAL_SHABAD, VEDIO_CATEGORY_IDS } from './../../../config/global.config';
import { REFERENCE_TYPE, MEDIA_TYPE } from './../../../config/media.config';
import { USER_ROLES_IDS } from './../../../config/user.config';

@Component({
	selector: 'add-video-modal',
	templateUrl: './add-video-modal.component.html',
	styleUrls: ['./add-video-modal.component.scss']
})
export class AddVideoModalComponent implements OnInit {

	@Input() modalRef;
	@Input() shabadId: number = 0;
	@Output() onAddVideo = new EventEmitter();

	addVideoForm: FormGroup;
	submitted: boolean = false;
	addVideoAPIRunnning: boolean = false;

	totalShabad = TOTAL_SHABAD;
	videoType = {
		feature: 'feature-video',
		discussion: 'discussion-video'
	}

	constructor(private _formBuilder: FormBuilder,
				private _http: HttpService,
				private _user: UserService,
				private _alert: AlertService) { }

	ngOnInit() {
		let urlReg = '^(http(s)?:\/\/)?((w){3}.)?(youtu(be|.be))?(\.com)?\/.+';
		this.addVideoForm = this._formBuilder.group({
			url: ['', [Validators.required, Validators.pattern(urlReg)]],
			video_type: [this.videoType.feature, Validators.required],
			shabad_id: [this.shabadId, Validators.required]
		});
	}

	get f() { return this.addVideoForm.controls; }

	onSubmit() {
		this.addVideoAPIRunnning = true;
		this.submitted = true;

		if (this.addVideoForm.invalid) {
			this.addVideoAPIRunnning = false;
            return;
        }

		let user = this._user.getLoggedInUser();
		let params = this.addVideoForm.value;
		// params['user_id'] = user['id'];
		params['author_id'] = user['id'];

		// TODO
		// Need to change this
		params['title'] = "Dummy Title";

		params['attachment_name'] = params['url'];
		params['ref_type'] = REFERENCE_TYPE.resource;
		params['type'] = MEDIA_TYPE.video;

		params['status'] = 0;
		if (user['role_id'] == USER_ROLES_IDS.super_admin) {
			params['status'] = 1;
		}

		let videoType = params['video_type'];
		params['category_ids'] = [VEDIO_CATEGORY_IDS[videoType]];

		delete params['url'];
		delete params['video_type'];

		let url = URLS.media;
		this._http.post(url, params)
		.subscribe((res) => {
			let video = res.data;
			if (video) {
				let data = {
					type: videoType,
					video: video
				};
				this.onAddVideo.emit(data);
			}

			this.modalRef.hide();

			this._alert.showAlert('success', 'Video Successfully Added.');
			this.addVideoAPIRunnning = false;
			this.submitted = false;
		}, (err) => {
			console.log(err);
			this.addVideoAPIRunnning = false;
		});
	}

	counter(i: number) {
	    return new Array(i);
	}
}
