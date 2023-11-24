import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { URLS } from './../../config/urls.config';
import { MEDIA_TYPE } from './../../config/media.config';
import { AUDIO_TAG_IDS, VEDIO_CATEGORY_IDS, ADVANCE_SEARCH_OPTIONS, TOTAL_PAGES } from './../../config/global.config';
declare var DeviceUUID;

import { HttpService } from './../../services/http.service';
import { YtPlayerComponent,PlayerOptions } from 'yt-player-angular';
import { Router } from '@angular/router';
import { ResourcesService } from 'src/app/services/resources.services';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';
import { OwlCarousel } from 'ngx-owl-carousel';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { environment } from '../../../environments/environment';
import { group } from '@angular/animations';
declare var $;
@Component({
	selector: 'app-my-pagination',
	templateUrl: './my-pagination.component.html',
	styleUrls: ['./my-pagination.component.scss'],
	providers: [DatePipe]
})
export class myPaginationComponent implements OnInit {
	
	@Input() currentPage:number = 1;
	@Input() numPages: number = 0;

	@Output() onChangePage = new EventEmitter<number>();

	constructor() {}

	ngOnInit(){
	}

	setCurrentPage(page: number){
		if(page > 0 && page < this.numPages + 1){
			this.onChangePage.emit(page);
		}
	}

}
