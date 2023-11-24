import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpService } from './../../../services/http.service';
import { UserService } from './../../../services/user.service';
import { AlertService } from './../../../services/alert.service';
import { HttpClientService } from './../../../services/http-client.service';


import { URLS } from './../../../config/urls.config';
import { REFERENCE_TYPE, MEDIA_TYPE } from './../../../config/media.config';
import { USER_ROLES_IDS } from './../../../config/user.config';
import { AUDIO_TAG_IDS } from './../../../config/global.config';

@Component({
	selector: 'app-add-audio',
	templateUrl: './add-audio.component.html',
	styleUrls: ['./add-audio.component.scss']
})
export class AddAudioComponent implements OnInit {

	@Input() modalRef;
	@Input() shabadId: number = 0;
	@Input() audioType: string = 'santhya';
	@Output() onAddAudio = new EventEmitter;

	addAudioForm: FormGroup;
	submitted: boolean = false;
	addAudioAPIRunnning: boolean = false;

	fileRef: any = null;

	uploadProgress: number = 0;
	uploadAudioOrLink: string = 'audio';
	uploadOrLink: string = 'upload';

	singers: Array<any> = [];

	constructor(private _formBuilder: FormBuilder,
				private _http: HttpService,
				private _user: UserService,
				private _alert: AlertService,
				private _httpClient: HttpClientService,) { }

	ngOnInit() {
		this.loadSingers();
	    this.buildForm();
	}

	buildForm() {
		this.addAudioForm = this._formBuilder.group({
			title: ['', Validators.required],
			audio_type: [this.audioType, Validators.required],
			audio: ['', Validators.required],
			externalLink: [''],
			author_id: ['', Validators.required]
		});
	}

	get f() { return this.addAudioForm.controls; }

	loadSingers() {
		let url = URLS.get_authors;

		this._http.get(url)
		.subscribe((res) => {
			let singers = res.data;
			this.singers = singers.map((singer) => singer.attributes.name);
		}, (err) => {
			console.log(err);
		});
	}

	setUploadOrLink(type) {
		this.uploadOrLink = type;
		this.setAudioFileLinkValidators();
	}

	setAudioFileLinkValidators() {
		let audioControl = this.addAudioForm.get('audio');
	    let externalLinkControl = this.addAudioForm.get('externalLink');

        if (this.uploadOrLink === 'upload') {
          audioControl.setValidators([Validators.required]);
          externalLinkControl.setValidators(null);
        }

        if (this.uploadOrLink === 'link') {
          audioControl.setValidators(null);
          externalLinkControl.setValidators([Validators.required]);
        }

        audioControl.updateValueAndValidity();
        externalLinkControl.updateValueAndValidity();
	}

	uploadAudio(event) {
		if (event.target.files.length > 0) {
		      let file = event.target.files[0];
		      this.fileRef = file;
		      this.addAudioForm.get('audio').setValue(file);
		}
	}

	onSubmit() {
		this.addAudioAPIRunnning = true;
		this.submitted = true;

		if (this.addAudioForm.invalid) {
			this.addAudioAPIRunnning = false;
            return;
        }

        if (this.addAudioForm.get('audio').value && this.uploadOrLink == 'upload') {
			let url = URLS.file_upload_single;

			let formData = new FormData();
	    	formData.append('file', this.addAudioForm.get('audio').value);

			this._httpClient.postMultipart(url, formData)
			.subscribe((res) => {
				if (res['type'] == 1) {
					this.uploadProgress = Math.round(100 * res['loaded'] / event['total']);
				}

				if (res['ok'] && res['body'] && res['body']['data']) {
					let fileName = res['body']['data']['file_name']
					this.saveData(fileName);
				}

		    }, (err) => {
				console.log(err);
				this.addAudioAPIRunnning = false;
		    });
        } else {
			this.saveData();
        }
	}

	saveData(fileName=null) {

		let user = this._user.getLoggedInUser();

		let url = URLS.media;
		let params = this.addAudioForm.value;

		if (fileName) {
			params['attachment_name'] = fileName;
		} else if (params['externalLink']) {
			params['attachment_name'] = params['externalLink'];
			delete params['externalLink'];
		}
		params['ref_type'] = REFERENCE_TYPE.resource;
		params['type'] = MEDIA_TYPE.audio;

		if (this.shabadId > 0) {
			params['shabad_id'] = this.shabadId;
		}

		params['status'] = 0;
		if (user['role_id'] == USER_ROLES_IDS.super_admin) {
			params['status'] = 1;
		}

		let tagids = Object.keys(AUDIO_TAG_IDS).map((tag) => {
			if (tag == params['audio_type']) {
				return AUDIO_TAG_IDS[tag];
			}
		});
		params['tag_ids'] = tagids.filter(Boolean);

		this.audioType = params['audio_type'];
		delete params['audio_type'];
		delete params['audio'];

		this._http.post(url, params)
		.subscribe((res) => {
			let audio = res.data;

			this._alert.showAlert('success', 'Audio data successfully saved.');
			this.addAudioAPIRunnning = false;
			this.submitted = false;

			let data = {
				type: this.audioType,
				audio: audio
			};
			this.onAddAudio.emit(data);
			this.modalRef.hide();

		}, (err) => {
			console.log(err);
			this.addAudioAPIRunnning = false;
		});
	}

}
