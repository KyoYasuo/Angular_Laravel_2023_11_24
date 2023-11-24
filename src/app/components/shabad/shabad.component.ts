import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from './../../services/http.service';
import { PlayerService } from './../../services/player.service';
import { UserService } from './../../services/user.service';
import { HelperService } from './../../services/helper.service';
import { AlertService } from './../../services/alert.service';
import { PlayerComponent } from './../audio-player/player/player.component';
import { URLS } from './../../config/urls.config';
import { TOTAL_PAGES } from './../../config/global.config';
import { ResourcesService } from 'src/app/services/resources.services';
import * as getYoutubeTitle from 'get-youtube-title';
import getYouTubeID from 'get-youtube-id';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpEventType } from '@angular/common/http';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { EventService } from 'src/app/services/event.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
declare var $;
declare var moment;
var FileSaver = require('file-saver');
@Component({
	selector: 'app-shabad',
	templateUrl: './shabad.component.html',
	styles: [`
		.dark-modal .modal-content {
			width: 15% !important;
			left: 35%;
		}
	`],
	styleUrls: ['./shabad.component.scss'],
	providers: [PlayerComponent, NgbModalConfig, NgbModal, DatePipe],
})
export class ShabadComponent implements OnInit {
	showIfOne = false;
	pageList = []
	userRoleId: any;
	userData: any = [];
	ignoreWord = [
		'ustad',
		'gyani',
		'giani',
		'bhai',
		'prof',
		'bibi',
		'sant',
		'dr.',
		'sri',
		'dr'
	]
	config: SwiperConfigInterface = {
		slidesPerView: 1,
		spaceBetween: 10,
		breakpoints: {
			640: {
				slidesPerView: 1,
			}
		},
		effect: "coverflow",
		loop: true,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	};
	exclude = [
		'Bhai ',
		'Dr. ',
		'Giani ',
		'Prof. ',
		'Brig (Retd.) '
	];
	@ViewChild('first', { static: false }) swipe: SwiperComponent
	@ViewChild('second', { static: false }) swipe2: SwiperComponent
	@ViewChild('highlight', { static: false }) public highlight: ElementRef;
	showKirtanBool = false;
	showKathaBool = false;
	showSanthyaBool = false;
	showPodbeanBool = false;
	selectedPage;
	style = {}
	isLoading = false;
	currentPlaying = '';
	hideTranslation: boolean 		= true;
	change() {
		this.goToPage(this.pageId);
	}
	change1(event) {
		this.goToPage(this.pageId);
		this.pageId
	}
	next() {
		this.swipe.directiveRef.nextSlide();
	}
	prev() {
		this.swipe.directiveRef.prevSlide();
	}
	getnext() {
		try {
			if (this.dvideo.length == 1) {
				return true;
			}
			return this.swipe.directiveRef.getIndex() == this.dvideo.length - 1;
		} catch (e) {
			return false;
		}
	}
	getnext2() {
		try {
			if (this.featuredvideo.length == 1) {
				return true;
			}
			return this.swipe2.directiveRef.getIndex() == this.featuredvideo.length - 1;
		} catch (e) {
			return false;
		}
	}
	getprev() {
		try {
			return this.swipe.directiveRef.getIndex() == 0;
		} catch (e) {
			return false;
		}
	}
	getprev2() {
		try {
			return this.swipe2.directiveRef.getIndex() == 0;
		} catch (e) {
			return false;
		}
	}
	next2() {
		this.swipe2.directiveRef.nextSlide();
	}
	prev2() {
		this.swipe2.directiveRef.prevSlide();
	}
	toggle = true;
	restrat(val) {
		if (this.toggle) {
			$("#player").hide();
			$("#player audio")[0].pause();
			$("#pauseSong").click();
			$("#matradioplayer").show();
			$("#matradioplayer audio")[0].src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
			$("#matradioplayer audio")[0].play();
		} else {
			$("#player").hide();
			$("#player audio")[0].pause();
			$("#pauseSong").click();
			$("#matradioplayer").show();
			$("#matradioplayer audio")[0].pause();
		}
		this.toggle = !this.toggle;
	}
	exportdialog(modal) {
		this.typeexp = [];
		this.typeexp_org = [];
		this.english = [];
		this.english_org = [];
		this.teeka = [];
		this.teeka_org = [];
		this.val = "line";
		this.modalService.open(modal, { size: 'sm', windowClass: 'exportdialog' });
	}
	displaydialog(modal) {
		this.modalService.open(modal, { size: 'sm', windowClass: 'displaydialog' });
	}
	modalRef: BsModalRef;
	shabad: object = {};
	shabadId: number;
	pageId: number = 1;
	currentShabadPage: number = 1;
	totalPages: number = TOTAL_PAGES;
	shabadData: object = {};
	shabadPages: Array < any > = [];
	shabadLanguages: Array < any > = [{
			key: 'pad_ched',
			name: 'Gurmukhi - Pad Ched',
			scriptures: []
		},
		{
			key: 'larivaar',
			name: 'Gurmukhi - Larivar',
			scriptures: []
		},
		{
			key: 'roman',
			name: 'Roman Script',
			scriptures: []
		}
	]
	isPadChedShow: boolean = true;
	isLareevaarShow: boolean = false;
	isRomanShow: boolean = false;
	translationAuthors: Array < any > = [];
	authors: Array < any > = [];
	engAuthors: Array < any > = [];
	punjabiAuthors: Array < any > = [];
	hindiAuthors: Array < any > = [];
	translationsByAuthors: object = {};
	selectedEnglishAuthor: string = '';
	selectedPunjabiAuthor: string = '';
	selectedHindiAuthor: string = '';
	selectedAuthorName: string = '';
	blogs: Array < any > = [];
	discussionVideos: Array < any > = [];
	featuredVideos: Array < any > = [];
	santhyAudio: Array < any > = [];
	kirtanAudio: Array < any > = [];
	kathaAudio: Array < any > = [];
	showAllBlogs: boolean = false;
	showAllKatha: boolean = false;
	dummayTracks: Array < any > = [{
			id: 1,
			title: 'Offline',
			audioUrl: './../../../assets/sounds/Offline.mp3'
		},
		{
			id: 1,
			title: 'Sorry',
			audioUrl: './../../../assets/sounds/Sorry.mp3'
		}
	];
	allAudioList: Array<any> = [];
	currentlyPlayedAudioKey: string = "";
	isAudioPlaying: boolean = false;
	selectedWordDetail: object = {};
	isGetWordDetailApiRunning: Boolean = false;
	user: object = {};
	selectedMediaRejectionData: object = {};
	media_id = 0;
	type_id = 0;
	highlightedScripture = {
		id: null,
		language: null,
		content: null,
		translation_authour_id: null
	}
	scrollToMedia = false;
	constructor(private _event: EventService, private _modalService: BsModalService,
		private _http: HttpService,
		private _activeRoute: ActivatedRoute,
		private _router: Router,
		private userService: UserService,
		private playerService: PlayerService,
		private _playerComp: PlayerComponent,
		private _user: UserService,
		private datePipe: DatePipe,
		private _helper: HelperService,
		private httpservice: HttpService,
		private _alert: AlertService,
		private rs: ResourcesService, config: NgbModalConfig, private modalService: NgbModal, private ref: ChangeDetectorRef) {
		config.backdrop = 'static';
		config.keyboard = false;
	}
	scroll(el: HTMLElement) {
		el.scrollIntoView();
	}
	onViewSearch(keyword) {
		let serachParams = {
			"search_keyword": keyword,
			"search_option": 1,
			"page": 1,
			"limit": 25,
			"language": "gurmukhi",
			"content": "gurbani",
			"pageF": 1,
			"pageT": 1430
		};;
		localStorage.setItem('params', JSON.stringify(serachParams));
	}
	mytxtyoutube = '';
	file: File = null;
	nameinvalidyoutube = false;
	hidemodal() {
		this.mytitle = "";
		this.file = null;
		this.mytxtyoutube = "";
		this.selectedType = 1;
		this.selectedTags = 2;
		this.selectedCategory = [];
		this.selectedSubCategory = [];
		this.exturlinvalid = false;
		this.fileinvalid = false;
		this.podbeaninvalid = false;
		this.nameinvalidyoutube = false;
		this.modalService.dismissAll();
	}
	mediaartist = [];
	taglist = [];
	categorieslist = [];
	subcategorylist = [];
	selectedArtist;
	selectedType = 1;
	selectedTags;
	selectedCategory = [];
	selectedSubCategory = [];
	podcastlist = [];
	selectedPodcast;
	selectedShabad = '';
	shabadlist = [];
	mytitle = '';
	fileinvalid = false;
	podbeaninvalid = false;
	exturlinvalid = false;
	mytxturl = '';
	time;
	isvalidyoutubeurl = true;
	onSearchChange(searchValue: string): void {
		var v2 = searchValue.split("/");
		this.mytitle = v2[v2.length - 1].split(".")[0];
		if (this.selectedType == 2) {
			var id = getYouTubeID(searchValue);
			var self = this;
			if (id != null) {
				this.mytxtyoutube = "https://www.youtube.com/embed/" + id;
				this.isvalidyoutubeurl = false;
				getYoutubeTitle(id, function(err, title) {
					if (!err) {
						self.settitle(title);
					}
				});
			}
		}
	}
	settitle(t) {
		this.mytitle = t;
	}
	msg;
	btntxt;
	mytxt;
	mytxtpodbean;
	duration: any = 0;
	titleinvalid = false;
	resData;
	successmsg = '';
	success = false;
	err = false;
	invalidmsg = '';
	addurl = "media/add";
	deleteurl = "media/delete-media/";
	deleteItem(loader, id) {
		this.uploaddata = '';
		if (confirm("Are you sure to delete " + id)) {
			this.modalService.open(loader, {
				centered: true,
				windowClass: 'dark-modal'
			});
			var url = this.deleteurl + id;
			this.rs
				.get(url).subscribe((data: any) => {
					this.resData = data;
					this.successmsg = this.resData["message"];
					if (this.resData["message"] != null && this.resData["success"] == "200") {
						this.success = true;
						this.err = false;
					} else {
						this.success = false;
						this.err = true;
					}
					this.updatedatatable();
				}, (err) => {
					this.err = true;
					this.success = false;
					this.successmsg = "something went wrong";
					this.updatedatatable();
				});
		}
	}
	deleteItemReject(id, loader) {
		this.uploaddata = '';
		if (confirm("Are you sure to reject " + id)) {
			this.modalService.open(loader, {
				centered: true,
				windowClass: 'dark-modal'
			});
			var url = this.deleteurl + id;
			this.rs
				.get(url).subscribe((data: any) => {
					this.resData = data;
					this.successmsg = this.resData["message"];
					if (this.resData["message"] != null && this.resData["success"] == "200") {
						this.success = true;
						this.err = false;
					} else {
						this.success = false;
						this.err = true;
					}
					this.updatedatatable();
				}, (err) => {
					this.err = true;
					this.success = false;
					this.successmsg = "something went wrong";
					this.updatedatatable();
				});
		}
	}
	deletepodbean(loader, id) {
		if (confirm("Are you sure to delete " + id)) {
			this.modalService.open(loader, {
				centered: true,
				windowClass: 'dark-modal'
			});
			var url = "media/delete-podcast-media/" + id;
			this.rs
				.get(url).subscribe((data: any) => {
					this.resData = data;
					this.successmsg = this.resData["message"];
					if (this.resData["message"] != null && this.resData["success"] == "200") {
						this.success = true;
						this.err = false;
					} else {
						this.success = false;
						this.err = true;
					}
					this.updatedatatable();
				}, (err) => {
					this.err = true;
					this.success = false;
					this.successmsg = "something went wrong";
					this.updatedatatable();
				});
		}
	}
	deleteItem2(loader, i) {
		this.uploaddata = '';
		var id;
		if (i == 0) {
			id = this.dvideo[this.swipe.directiveRef.getIndex()]['id'];
		} else {
			id = this.featuredvideo[this.swipe.directiveRef.getIndex()]['id'];
		}
		if (confirm("Are you sure to delete " + id)) {
			this.modalService.open(loader, {
				centered: true,
				windowClass: 'dark-modal'
			});
			var url = this.deleteurl + id;
			this.rs
				.get(url).subscribe((data: any) => {
					this.resData = data;
					this.successmsg = this.resData["message"];
					if (this.resData["message"] != null && this.resData["success"] == "200") {
						this.success = true;
						this.err = false;
					} else {
						this.success = false;
						this.err = true;
					}
					this.updatedatatable();
				}, (err) => {
					this.err = true;
					this.success = false;
					this.successmsg = "something went wrong";
					this.updatedatatable();
				});
		}
	}
	updatedatatable() {
		this.hidemodal();
		this.getShabad();
	}
	delete(loader, id) {
		if (confirm("Are you sure to delete " + id)) {
			this.modalService.open(loader, {
				centered: true,
				windowClass: 'dark-modal',
				backdrop: 'static'
			});
			var url = "blog-delete/" + id;
			this.rs
				.get(url).subscribe((data: any) => {
					this.modalService.dismissAll();
					if (data.status == "success") {
						this.err = false;
						this.success = true;
						this.successmsg = data.message;
						this.updatedatatable();
					} else {
						this.err = true;
						this.success = false;
						this.successmsg = "something went wrong";
					}
				}, (err) => {
					this.modalService.dismissAll();
					this.err = true;
					this.success = false;
					this.successmsg = "something went wrong";
					this.updatedatatable();
				});
		}
	}
	handleFileInput(ev) {
		if (ev[0].type.toString().split("/")[0] == "audio") {
			this.file = ev[0];
			this.fileinvalid = false;
			var i = this.file.name.lastIndexOf(".");
			var val = this.file.name.toString().substring(0, i);
			this.mytitle = val;
			this.invalidmsg = "";
			$("#lbl").text(ev[0].name);
			var objectUrl = URL.createObjectURL(this.file);
			$("#audio").prop("src", objectUrl);
			var video = document.createElement('video');
			video.preload = 'metadata';
			let f = this;
			(function(f) {
				video.onloadedmetadata = function() {
					window.URL.revokeObjectURL(video.src);
					var duration = Math.round(video.duration);
					if (duration > 60) {
						var minutes = Math.floor(duration / 60);
						var secons = duration - (minutes * 60);
						if (minutes > 60) {
							var hours = Math.floor(minutes / 60);
							var minutes = minutes - (hours * 60);
							f.duration = hours + ":" + ((minutes < 10) ? '0' + minutes : minutes) + ":" + ((secons < 10) ? '0' + secons : secons);
						} else f.duration = minutes + ":" + ((secons < 10) ? '0' + secons : secons);
					} else f.duration = duration;
				}
			}(f));
			video.src = URL.createObjectURL(ev[0]);
		} else {
			this.fileinvalid = true;
			this.mytitle = "";
			this.file = null;
			this.invalidmsg = "select valid file"
			$("#lbl").text("");
		}
	}
	show = true;

	getlist() {
		// if(this.roleid==3 || this.roleid==4) 
		{
			let mediaartist = JSON.parse(sessionStorage.getItem('mediaartist'));
			if(mediaartist) {
				this.selectedArtist = mediaartist[0].id;
				this.mediaartist = mediaartist.sort((a, b) => {
					return a.name.localeCompare(b.name)
				})
			}
			else {
				this.rs.get("media-authors/list").subscribe((res) => {
					this.mediaartist = res["result"];
					sessionStorage.setItem('mediaartist', JSON.stringify(res["result"]));
					this.selectedArtist = this.mediaartist[0].id;
					this.mediaartist = this.mediaartist.sort((a, b) => {
						return a.name.localeCompare(b.name)
					})
				}, (err) => {
				});
			}
			let taglist = JSON.parse(sessionStorage.getItem('taglist'));
			if(taglist) {
				let items = ['discussion', 'featured'];
				items.forEach(value => {
					this.taglist = taglist.filter(item => item.name !== value);
				});
				this.selectedTags = this.taglist[1].id;
				this.selectedTags = this.taglist.find(x => x.name == "Kirtan").id;
			}
			else {
				this.rs.get("resource-tag/list").subscribe((res) => {
					this.taglist = res["result"];
					sessionStorage.setItem('taglist', JSON.stringify(res["result"]));
					let items = ['discussion', 'featured'];
					items.forEach(value => {
						this.taglist = this.taglist.filter(item => item.name !== value);
					});
					this.selectedTags = this.taglist[1].id;
					this.selectedTags = this.taglist.find(x => x.name == "Kirtan").id;
				}, (err) => {
				});
			}
			let categorieslist = JSON.parse(sessionStorage.getItem('categorieslist'));
			if(categorieslist) {
				this.categorieslist = categorieslist;
			}
			else {
				this.rs.get("categories/resources-list").subscribe((res) => {
					this.categorieslist = res["result"];
					sessionStorage.setItem('categorieslist', JSON.stringify(res["result"]));
				}, (err) => {
					console.log(err);
				});
			}
			let subcategorylist = JSON.parse(sessionStorage.getItem('subcategorylist'));
			if(subcategorylist) {
				this.subcategorylist = subcategorylist;
			}
			else {
				this.rs.get("categories/resources-subcategory-list").subscribe((res) => {
					this.subcategorylist = res["result"];
					sessionStorage.setItem('subcategorylist', JSON.stringify(res["result"]));
				}, (err) => {
					console.log(err);
				});
			}
			let shabadlist = JSON.parse(sessionStorage.getItem('shabadlist'));
			if(shabadlist) {
				this.shabadlist = shabadlist;
			}
			else {
				this.rs.get("shabad-data/list").subscribe((res) => {
					this.shabadlist = res["result"];
					sessionStorage.setItem('shabadlist', JSON.stringify(res["result"]));
				}, (err) => {
					console.log(err);
				});
			}
		}
	}

	add(content, i) {
		this.getlist();
		this.duration = 0;
		this.show = true;
		if (i == 2) {
			this.show = false;
		}
		this.selectedType = i;
		this.msg = "Add media";
		this.btntxt = "add";
		this.mytxt = "";
		this.file = null;
		this.fileinvalid = false;
		this.isvalidyoutubeurl = false;
		this.mytxtpodbean = "";
		this.mytxtyoutube = "";
		this.mytitle = "";
		this.mytxturl = "";
		this.titleinvalid = false;
		this.exturlinvalid = false;
		this.podbeaninvalid = false;
		this.errmsg = '';
		this.err = false;
		// this.selectedTags = this.taglist.find(x => x.name == "Kirtan").id;
		this.selectedShabad = this.shabadId.toString();
		this.modalService.open(content);
	}
	type = [{
			id: 0,
			name: "S3"
		},
		{
			id: 1,
			name: "Audio"
		}, {
			id: 4,
			name: "External Url"
		}
	]
	uploaddata = '';
	is_add = true;
	errmsg = '';
	selectedVideotype = 5;
	videotype = [{
		name: "Featured",
		id: 6
	}, {
		name: "Discussion",
		id: 5
	}]
	upload(loader) {
		if (this.selectedType == 1 || this.selectedType == 0) {
			if (this.file == null && this.is_add) {
				this.fileinvalid = true;
				this.invalidmsg = "pls select mp3 file"
				return;
			} else if (this.mytitle.toString().trim().length == 0) {
				this.titleinvalid = true;
				this.fileinvalid = false;
				return;
			}
		} else if (this.selectedType == 2) {
			if (this.mytxtyoutube.toString().trim().length == 0) {
				this.nameinvalidyoutube = true;
				this.titleinvalid = false;
				return;
			} else if (this.isvalidyoutubeurl) {
				this.nameinvalidyoutube = true;
				this.titleinvalid = false;
				return;
			} else if (this.mytitle.toString().trim().length == 0) {
				this.titleinvalid = true;
				return;
			}
		} else if (this.selectedType == 3) {
			if (this.mytxtpodbean.toString().trim().length == 0) {
				this.podbeaninvalid = true;
				this.titleinvalid = false;
				return;
			} else if (this.mytitle.toString().trim().length == 0) {
				this.titleinvalid = true;
				return;
			}
		} else {
		}
		var ref = this.modalService.open(loader, {
			centered: true,
			windowClass: 'dark-modal'
		});
		this.rs.get("media/list?q=" + this.mytitle.toString() + "&whole_word=yes").subscribe((res) => {
			this.upload2(ref);
		}, (err) => {
			alert("something went wrong");
			ref.close();
		})
	}
	upload2(ref) {
		let formData = new FormData();
		formData.set("user_id", this.userService.getLoggedInUser().id);
		var loadingstart = false;
		if (this.selectedType == 1 || this.selectedType == 0) {
			if (this.file == null && this.is_add) {
				this.fileinvalid = true;
				this.invalidmsg = "pls select mp3 file"
				return;
			} else if (this.mytitle.toString().trim().length == 0) {
				this.titleinvalid = true;
				this.fileinvalid = false;
				return;
			}
			this.titleinvalid = false;
			this.fileinvalid = false;
			if (this.file != null) {
				formData.append("attachment_name", this.file, this.file.name);
			}
			formData.append("title", this.mytitle);
			formData.append("author_id", this.selectedArtist);
			formData.append("type", this.selectedType == 1 ? "AUDIO" : "S3");
			formData.append("youtube_url", "");
			formData.append("podbean_url", "");
			var catid = [];
			for (var i = 0; i < this.selectedCategory.length; i++) {
				catid[i] = {
					"cat_id": this.selectedCategory[i]
				};
			}
			formData.append("category", JSON.stringify(catid));
			formData.append("new_category", "");
			var subid = [];
			for (var i2 = 0; i2 < this.selectedSubCategory.length; i2++) {
				subid[i2] = {
					"sub_cat_id": this.selectedSubCategory[i2]
				};
			}
			formData.append("sub_category", JSON.stringify(subid));
			formData.append("tag_id", this.selectedTags);
			formData.append("duration", '' + this.duration);
			formData.append("shabad_id", this.selectedShabad);
			formData.append("fid", "0");
		} else if (this.selectedType == 2) {
			if (this.mytxtyoutube.toString().trim().length == 0) {
				this.nameinvalidyoutube = true;
				this.titleinvalid = false;
				return;
			} else if (this.isvalidyoutubeurl) {
				this.nameinvalidyoutube = true;
				this.titleinvalid = false;
				return;
			} else if (this.mytitle.toString().trim().length == 0) {
				this.titleinvalid = true;
				return;
			}
			this.titleinvalid = false;
			this.nameinvalidyoutube = false;
			formData.append("attachment_name", "");
			formData.append("title", this.mytitle);
			formData.append("author_id", this.selectedArtist);
			formData.append("type", "YOUTUBE");
			formData.append("youtube_url", this.mytxtyoutube);
			formData.append("podbean_url", "");
			var catid = [];
			for (var i = 0; i < this.selectedCategory.length; i++) {
				catid[i] = {
					"cat_id": this.selectedCategory[i]
				};
			}
			formData.append("category", JSON.stringify(catid));
			formData.append("new_category", "");
			var subid = [];
			for (var i2 = 0; i2 < this.selectedSubCategory.length; i2++) {
				subid[i2] = {
					"sub_cat_id": this.selectedSubCategory[i2]
				};
			}
			formData.append("sub_category", JSON.stringify(subid));
			formData.append("tag_id", this.selectedVideotype.toString());
			formData.append("duration", '' + this.duration);
			formData.append("shabad_id", this.selectedShabad);
		}
		else {
			this.titleinvalid = false;
			this.exturlinvalid = false;
			formData.append("attachment_name", "");
			formData.append("title", this.mytitle);
			formData.append("author_id", this.selectedArtist);
			formData.append("type", "EXTERNAL");
			formData.append("external_url", this.mytxturl);
			formData.append("youtube_url", "");
			formData.append("podbean_url",
				"");
			formData.append("duration", '' + this.duration);
			var catid = [];
			for (var i = 0; i < this.selectedCategory.length; i++) {
				catid[i] = {
					"cat_id": this.selectedCategory[i]
				};
			}
			formData.append("category", JSON.stringify(catid));
			formData.append("new_category", "");
			var subid = [];
			for (var i2 = 0; i2 < this.selectedSubCategory.length; i2++) {
				subid[i2] = {
					"sub_cat_id": this.selectedSubCategory[i2]
				};
			}
			formData.append("sub_category", JSON.stringify(subid));
			formData.append("tag_id", this.selectedTags);
			formData.append("shabad_id", this.selectedShabad);
			formData.append("fid", "0");
			loadingstart = true;
		}
		this.err = false;
		this.errmsg = '';
		var url;
		url = this.addurl;
		if (loadingstart) {
			$("#audio").prop("src", this.mytxturl);
			this.waitingfordata = true;
			this.uploaddata = 'Time_get'
			var x = setInterval(() => {
				if (this.errdata) {
					clearInterval(x);
					this.errdata = false;
					this.waitingfordata = false;
					Swal.fire('', 'Error getting time info from url', 'error');
					this.modalService.dismissAll();
				} else if (!this.waitingfordata) {
					clearInterval(x);
					this.errdata = false;
					this.waitingfordata = false;
					if (this.time != 0) {
						formData.append("duration", this.time);
						this.timeupload = false;
					}
					this.uploaddata = '0%';
					this.rs
						.postMultipart(url,
							formData
						).subscribe((event) => {
							if (event.type === HttpEventType.UploadProgress) {
								this.uploaddata = Math.round(100 * event.loaded / event.total) + "%";
							} else if (event.type === HttpEventType.Response) {
								this.resData = event.body;
								this.successmsg = this.resData["message"];
								if (this.resData["message"] != null && this.resData["success"] == "200") {
									this.success = true;
									this.err = false;
									this.updatedatatable();
								} else {
									this.success = false;
									this.err = true;
									this.errmsg = this.resData['message'];
									ref.close();
								}
								this.updatedatatable();
							}
						}, (err) => {
							this.err = true;
							this.success = false;
							this.successmsg = "something went wrong";
							this.errmsg = "something went wrong";
							this.updatedatatable();
							ref.close();
						});
				}
			});
		} else {
			this.uploaddata = '0%';
			this.rs
				.postMultipart(url,
					formData
				).subscribe((event) => {
					if (event.type === HttpEventType.UploadProgress) {
						this.uploaddata = Math.round(100 * event.loaded / event.total) + "%";
					} else if (event.type === HttpEventType.Response) {
						this.resData = event.body;
						this.successmsg = this.resData["message"];
						if (this.resData["message"] != null && this.resData["success"] == "200") {
							this.success = true;
							this.err = false;
							this.updatedatatable();
						} else {
							this.success = false;
							this.err = true;
							this.errmsg = this.resData['message'];
							ref.close();
						}
					}
				}, (err) => {
					this.err = true;
					this.success = false;
					this.successmsg = "something went wrong";
					this.errmsg = "something went wrong";
					ref.close();
				});
		}
	}
	setindex() {
		this.currentPlaying = this.prevtitle;
		this.ourtitle = '';
		this.ref.detectChanges();
	}
	set2() {
		this.currentPlaying = this.ourtitle;
		this.ourtitle = this.prevtitle;
	}
	add_audio_permission = false;
	add_video_permission = false;
	timeupload;
	errdata = false;
	waitingfordata = false;
	check() {
		if (this.dvideo.length >= 1) {
			return true;
		} else if (this.featuredvideo.length >= 1) {
			return true;
		}
		return false;
	}
	roleid = 0;
	typeexp = [];
	teeka = [];
	english = [];
	typeexp_org = [];
	teeka_org = [];
	english_org = [];
	checkValue(ev, name, name2, id) {
		if (id == 1) {
			if (ev.currentTarget.checked) {
				this.typeexp.push({
					type: name
				});
				this.typeexp_org.push(name2);
			} else {
				var i = this.typeexp.findIndex(x => x.type == name);
				this.typeexp.splice(i, 1);
				this.typeexp_org.splice(i, 1);
			}
		} else if (id == 2) {
			if (ev.currentTarget.checked) {
				this.english.push({
					english: name
				});
				this.english_org.push(name2);
			} else {
				var i = this.english.findIndex(x => x.english == name);
				this.english.splice(i, 1);
				this.english_org.push(i, 1);
			}
		} else {
			if (ev.currentTarget.checked) {
				this.teeka.push({
					teeka: name
				});
				this.teeka_org.push(name2);
			} else {
				var i = this.teeka.findIndex(x => x.teeka == name);
				this.teeka.splice(i, 1);
				this.teeka_org.splice(i, 1);
			}
		}
	}
	val = "line";
	gettitle(title) {
		var t = title.split(".")[0];
		return t.split("_").join(' ');
	}
	submit() {
		var obj = {};
		obj['type'] = this.typeexp;
		obj['teeka'] = this.teeka;
		obj['english'] = this.english;
		var to = +this.pageId + +3;
		this.rs.postJson("shabad-data/export-shabads?sid=" + this.shabadId + "&from=" + (this.shabadPages[0]) + "&to=" + this.shabadPages[this.shabadPages.length - 1] + "&format_type=" + this.val + "&format_file=txt", obj.toString()).subscribe((res) => {
			var data = '';
			if (this.val == "section") {
				for (var i = 0; i < this.typeexp.length; i++) {
					data += "\n";
					data += this.typeexp_org[i] + ":\n";
					data += "\n";
					for (var j = 0; j < res['result'].length; j++) {
						if (this.typeexp[i].type == "Scripture") {
							data += res['result'][j]['Scripture'] + "\n";
						} else if (this.typeexp[i].type == "ScriptureOriginal") {
							data += res['result'][j]['ScriptureOriginal'] + "\n";
						} else if (this.typeexp[i].type == "ScriptureRoman") {
							data += res['result'][j]['ScriptureRoman'] + "\n";
						}
					}
				}
				for (var i = 0; i < this.english.length; i++) {
					data += "\n";
					data += "Author(English) -" + this.english_org[i] + "\n";
					data += "\n";
					for (var j = 0; j < res['result'].length; j++) {
						this.engAuthors.forEach((author, index) => {
							if (this.english_org[i] == author.name) {
								data += res['result'][j]['translation'][author.key] + "\n";
							}
						});
					}
				}
				for (var i = 0; i < this.teeka.length; i++) {
					data += "\n";
					data += "Author(Teeka) -" + this.teeka_org[i] + "\n";
					data += "\n";
					for (var j = 0; j < res['result'].length; j++) {
						data += res['result'][j]['translation'][this.teeka[i].teeka] + "\n";
					}
				}
			} else {
				for (var j = 0; j < res['result'].length; j++) {
					data += "\n";
					for (var i = 0; i < this.typeexp.length; i++) {
						if (this.typeexp[i].type == "Scripture") {
							data += res['result'][j]['Scripture'] + "\n";
						} else if (this.typeexp[i].type == "ScriptureOriginal") {
							data += res['result'][j]['ScriptureOriginal'] + "\n";
						} else if (this.typeexp[i].type == "ScriptureRoman") {
							data += res['result'][j]['ScriptureRoman'] + "\n";
						}
					}
					for (var i = 0; i < this.english.length; i++) {
						this.engAuthors.forEach((author, index) => {
							if (this.english_org[i] == author.name) {
								data += res['result'][j]['translation'][author.key] + "\n";
							}
						});
					}
					for (var i = 0; i < this.teeka.length; i++) {
						data += res['result'][j]['translation'][this.teeka[i].teeka] + "\n";
					}
				}
			}
			var blob = new Blob([data], {
				type: "text/plain;charset=utf-8"
			});
			FileSaver.saveAs(blob, "export_section.txt");
		}, (err) => {
		})
	}
	checkroles() {
		try {
			var user = JSON.parse(window.localStorage.getItem("current_user").toString());
			if (user) {
				var roles = user['roles'];
				this.roleid = user['role']['id'];
				roles.indexOf("add_audio") > -1 ? this.add_audio_permission = !this.add_audio_permission : '';
				roles.indexOf("add_video") > -1 ? this.add_video_permission = !this.add_video_permission : '';
			}
			if (JSON.parse(localStorage.getItem('current_user')).role.name == "super admin") {
				this.isadmin = true;
			}
		} catch (e) {
		}
	}
	commentary;
	htmlText;
	iscommenteray_available = false;
	getcommentary() {
		if (!this.shabadId) {
			this.shabadId = 1;
		}
		this.rs.get("commentary/list/" + this.shabadId).subscribe((res) => {
			this.iscommenteray_available = false;
			if (res['status'] == 200 && res['result'].length == 1) {
				this.commentary = res['result'][0]['commentary'];
				this.htmlText = this.commentary
				this.iscommenteray_available = true;
			} else {
				this.commentary = '';
				this.htmlText = '';
			}
		}, (err) => {
			this.iscommenteray_available = false;
			this.commentary = '';
			this.htmlText = '';
		});
	}
	checkdisabled() {
		if (this.startindex == 0) {
			return true;
		}
		return false;
	}
	checkdisablednext() {
		if (this.endindex >= this.shabadPages.length) {
			return true;
		}
		return false;
	}
	change2() {
		this.startindex = this.startindex - this.slice;
		this.endindex = this.endindex - this.slice;
	}
	change3() {
		this.startindex = this.startindex + this.slice;
		this.endindex = this.endindex + this.slice;
	}
	fixShortDesc(txt) {
		return txt.replace(/&nbsp;/g, " ");
	}
	startindex = 0;
	slice=10;
	endindex = this.slice;
	isadmin = false
	transEffect = false;
	setSelected(id) {
		$(".active1").removeClass("active1");
		$("#" + id).addClass("active1");
	}
	ngOnInit() {
		let trans = sessionStorage.getItem('trans');
		if(! trans) {
			this.transEffect = true;
		}
		sessionStorage.setItem('trans', '1');
		let user = this.userService.getLoggedInUser();
		if(user && (user.role_id==3 || user.role_id==4)) {
			this.hideTranslation = false;
		}
		this.isLoading = true;
		this._activeRoute.params.subscribe((params) => {
			this.pageId = params.id;
			this.shabadId = null;
			if (params.shabad_id) {
				this.shabadId = params.shabad_id;
			}
			this.getShabad();
			setTimeout(() => {
				if (this.isAudioPlaying) {
					this.playerService.stop();
				}
			}, 100);
		});
		this._activeRoute.queryParams.subscribe(params => {
			if (params.highlighted_scripture_id && params.highlighted_scripture_lang && params.selected_content == 'gurbani') {
				this.highlightedScripture.id = params.highlighted_scripture_id;
				this.highlightedScripture.language = params.highlighted_scripture_lang;
				this.highlightedScripture.content = params.selected_content;
				this.isRomanShow = true;
			}
			else if(localStorage.getItem('shabad_page_data')==null) {
				this.isRomanShow = true;
			}
			if (params.highlighted_scripture_id &&
				(params.selected_content == 'teeka' || params.selected_content == 'english-translation') &&
				params.selected_translation_author) {
				this.highlightedScripture.id = params.highlighted_scripture_id;
				this.highlightedScripture.content = params.selected_content;
				this.highlightedScripture.translation_authour_id = params.selected_translation_author;
			}
			if (params.mediaid && params.type) {
				this.media_id = params.media_id;
				this.type = params.type;
			}
			if (params.from == 'media') {
				this.scrollToMedia = true;
			}
			this.userData = [{
				role_id: ''
			}];
			this._event.on('setRoleId').subscribe((e) => {
				if (localStorage.getItem('current_user') != null) {
					this.userData = JSON.parse(localStorage.getItem('current_user'));
					this.userRoleId = this.userData.role_id;
				} else {
					this.userRoleId = '';
				}
				localStorage.setItem('userRoleId', this.userRoleId);
			})
		});
		
		document.getElementById("main2").scrollTo(0, 0);
		for (let i = 0; i < this.totalPages; i++) {
			this.pageList.push(i + 1);
		}
		this.createList();
		this.setSelected("shabad")
		this.checkroles();
		var self = this;
		let f = this;
		(function(f) {
			$("#select2").on('change', function() {
				setTimeout(function() {
					f.change();
				}, 100);
			})
		}(f));
		$("#audio").on("loadedmetadata", function(e) {
		});
		$("#audio").on("canplaythrough", (e) => {
			var seconds = e.currentTarget.duration;
			var duration = moment.duration(seconds, "seconds");
			var time = "";
			var hours = duration.hours();
			if (hours > 0) {
				time = hours + ":";
			}
			time = hours + duration.minutes() + ":" + duration.seconds();
			this.time = time;
			this.timeupload = true;
			this.errdata = false;
			this.waitingfordata = false;
		});
		$('#audio').on('error', (e) => {
			this.errdata = true;
			this.waitingfordata = false;
		});
		$('.combobox').combobox();
		if (this._user.isUserLogin()) {
			this.user = this._user.getLoggedInUser();
		}
		let getTranslationAuthors = sessionStorage.getItem('translationAuthors');
		if(getTranslationAuthors) {
			this.translationAuthors = JSON.parse(getTranslationAuthors);
			this.setTranslationAuthors();
		}
		else {
			this.getTranslationAuthors();
		}
		this.setDataFromLocalStorage();
		this.audioPlayerEvents();
		//getartist
	}
	playerPauseEvent() {
		this.setindex();
	};
	playerPlayEvent() {
		this.set2();
	};
	list: any;
	createList() {
		this.list = Array.from({
				length: 1430
			}, (value, key) => key)
			.map(val => ({
				id: val + 1,
				pageId: val + 1
			}));
	}
	audioPlayerEvents() {
		let event = this.playerService.playerEvents;
		event.onPlay$
			.subscribe((audio) => {
				this.currentlyPlayedAudioKey = audio.key;
			});
		event.playing$
			.subscribe((playing) => {
				this.isAudioPlaying = playing;
			});
	}
	approve(id, val, loader) {
		this.modalService.open(loader, {
			centered: true,
			windowClass: 'dark-modal'
		});
		var param = new URLSearchParams();
		param.set("media_id", id);
		param.set("status", val);
		this.rs.post("media/update-approval-status", param).subscribe((res) => {
			this.modalService.dismissAll();
			this.updatedatatable();
		}, (err) => {
			this.modalService.dismissAll();
			this.updatedatatable();
			console.log(err);
		})
	}
	getShabadPages() {
		let url = '/shabad-pages/' + this.pageId;
		this._http.get(url)
			.subscribe((res) => {
				let pages = res.data;
				//navigate to page with shabad page
				this._router.navigate(['/shabad', this.pageId, pages[0]]);
			}, (error) => {
				console.log(error);
			});
	}
	setpage() {
		while (true) {
			var d = this.shabadPages.slice(this.startindex, this.endindex);
			if (d.length == 0) {
				break;
			} else if (d.includes(parseInt(this.shabadId.toString()))) {
				break;
			} else {
				this.startindex = this.startindex + this.slice;
				this.endindex = this.endindex + this.slice;
			}
		}
	}
	getShabad() {
		this.isLoading = true;
		let url = '/shabad/' + this.pageId;
		if (this.shabadId) {
			url += '/' + this.shabadId;
		}
		this._http.get(url)
			.subscribe((response) => {
				this.shabadData = response.data;
				this.shabadPages = response.pages;
				this.isLoading = false;
				if (!this.shabadId) {
					this.shabadId = this.shabadPages[0];
				}
				this.currentShabadPage = this.shabadData['id'];
				this.engAuthors = this.engAuthors.filter(function( obj ) {
					return obj.key != 'KhojgurbaaniEnglish';
				});
				let KhojgurbaaniEnglish = false;
				
				this.translationsByAuthors = {};
				var scriptureIndex = 0
				//scripture data
				this.shabadData['scriptures'].forEach((sd, index) => {
					scriptureIndex = index
					sd.Scripture = sd.Scripture.split(" ");
					if (this.highlightedScripture.id && sd.id == this.highlightedScripture.id) {
						sd['is_highlight'] = true;
					}
					if(sd.translation.KhojgurbaaniEnglish) {
						KhojgurbaaniEnglish = true;
					}
				});

				let isSelectedDisplay = JSON.parse(localStorage.getItem('isSelectedDisplay')) || [];
				let KhojgurbaaniEnglishSelected = localStorage.getItem('KhojgurbaaniEnglishSelected') || 'true';
				if(KhojgurbaaniEnglish) {
					if(isSelectedDisplay.includes('KhojgurbaaniEnglish')) {
						this.selectedAuthorName = 'KhojGurbani';
					}
					let ge = {
						key: 'KhojgurbaaniEnglish',
						name: 'KhojGurbani',
						isSelected: KhojgurbaaniEnglishSelected=='true'
					}
					this.engAuthors.push(ge);
				}
				else {
					let isSelected = isSelectedDisplay; // isSelectedDisplay.includes('KhojgurbaaniEnglish')?[]:isSelectedDisplay;
					// if(isSelected.length==0) 
					{
						this.engAuthors = [];
						this.punjabiAuthors = [];
						this.hindiAuthors = [];
					}
					let display = isSelected;
					let len = isSelected.length;
					this.translationAuthors.forEach((tAuth) => {
						let authorData = {
							key: tAuth.ReferredColumn,
							name: tAuth.Author,
							isSelected: false
						}
						if(len>0){
							if(isSelected.includes(authorData.key)) {
								authorData.isSelected = true;
								this.selectedAuthorName = authorData.name;
							}
						}
						// else
						{
							if (tAuth.Default && !this.highlightedScripture.translation_authour_id) {
								authorData.isSelected = true;
								this.selectedAuthorName = authorData.name;
								display.push(tAuth.ReferredColumn);
							}
							if (this.highlightedScripture.translation_authour_id &&
								this.highlightedScripture.translation_authour_id == tAuth.id) {
								authorData.isSelected = true;
								this.selectedAuthorName = authorData.name;
								display.push(tAuth.ReferredColumn);
							}
							if (tAuth.Language.toLowerCase() === 'english' && tAuth.Active) {
								this.engAuthors.push(authorData);
							} else if (tAuth.Language.toLowerCase() === 'punjabi' && tAuth.Active) {
								this.punjabiAuthors.push(authorData);
							} else if (tAuth.Language.toLowerCase() === 'hindi' && tAuth.Active) {
								this.hindiAuthors.push(authorData);
							}
						}
					});
					display = display.filter((value, index, self) => self.indexOf(value) === index);
					localStorage.setItem('isSelectedDisplay', JSON.stringify(display));
				}
				this.engAuthors = this.engAuthors.sort((a,b) => a.key.localeCompare(b.key));
				this.punjabiAuthors = this.punjabiAuthors.sort((a,b) => a.key.localeCompare(b.key));
				this.hindiAuthors = this.hindiAuthors.sort((a,b) => a.key.localeCompare(b.key));
				this.isLoading = false;
				if (scriptureIndex + 1 == this.shabadData['scriptures'].length) {
					this.scrollView()
				}
				this.setpage();
				this.rs.get("shabad-data/get-shabad-media/" + this.shabadId).subscribe((response) => {
					this.saudio = response['Santhiya_data'];
					this.kaudio = response['katha_data'];
					this.kirtan_audio = response['Kirtan_data'].sort((a, b) => {
						let aTitle = a.author_name.toLowerCase();
						let bTitle = b.author_name.toLowerCase();
						aTitle = this.removeWord(aTitle.trim());
						bTitle = this.removeWord(bTitle.trim());
						return (aTitle < bTitle) ? -1 : (aTitle > bTitle) ? 1 : 0;
					});
					this.podbean_audio = response['podcast_media'];
					try {
						if (this.isadmin == false) {
							var s = this.saudio.filter((x) => x.media_approve == 1);
							this.saudio = s.concat(this.saudio.filter((x) => x.userid == this.userService.getLoggedInUser().id && x.media_approve == 0));
							var s2 = this.kaudio.filter((x) => x.media_approve == 1)
							this.kaudio = s2.concat(this.kaudio.filter((x) => x.userid == this.userService.getLoggedInUser().id && x.media_approve == 0));
							var s3 = this.kirtan_audio.filter((x) => x.media_approve == 1)
							this.kirtan_audio = s3.concat(this.kirtan_audio.filter((x) => x.userid == this.userService.getLoggedInUser().id && x.media_approve == 0));
						}
					} catch (e) {
						this.saudio = this.saudio.filter((x) => x.media_approve == 1);
						var kaudio = this.kaudio.filter((x) => x.media_approve == 1)
						this.kirtan_audio = this.kirtan_audio.filter((x) => x.media_approve == 1)
					}
					this.videos = [];
					for (var i = 0; i < this.saudio.length; i++) {
						if (this.saudio[i].type == 'YOUTUBE' && this.saudio[i].status == 1) {
							this.videos.push(this.saudio[i]);
						}
					}
					for (var i = 0; i < this.kaudio.length; i++) {
						if (this.kaudio[i].type == 'YOUTUBE' && this.kaudio[i].status == 1) {
							this.videos.push(this.kaudio[i]);
							delete this.kaudio[i];
						}
					}
					for (var i = 0; i < this.kirtan_audio.length; i++) {
						if (this.kirtan_audio[i].type == 'YOUTUBE' && this.kirtan_audio[i].status == 1) {
							this.videos.push(this.kirtan_audio[i]);
						}
					}
					var d = this.kirtan_audio.filter((item) => item.type !== 'YOUTUBE');
					this.kirtan_audio = [];
					this.kirtan_audio = d;
					var d2 = this.kaudio.filter((item) => item.type !== 'YOUTUBE');
					this.kaudio = [];
					this.kaudio = d2;
					var d3 = this.saudio.filter((item) => item.type !== 'YOUTUBE');
					this.saudio = [];
					this.saudio = d3;
					this.featuredvideo = response['Featured_data'];
					this.dvideo = response['Discussion_data'];
					try {
						if (this.isadmin == false) {
							var featuredvideo_temp = this.featuredvideo.filter((x) => x.media_approve == 1)
							var dvideo_temp = this.dvideo.filter((x) => x.media_approve == 1)
							this.featuredvideo = featuredvideo_temp.concat(this.featuredvideo.filter((x) => x.media_approve == 0 && x.userid == this.userService.getLoggedInUser().id));
							this.dvideo = dvideo_temp.concat(this.dvideo.filter((x) => x.media_approve == 0 && x.userid == this.userService.getLoggedInUser().id));
						}
					} catch (e) {
						this.featuredvideo = this.featuredvideo.filter((x) => x.media_approve == 1)
						this.dvideo = this.dvideo.filter((x) => x.media_approve == 1)
					}
					if (this.scrollToMedia) {
						setTimeout(() => {
							$("#main2").animate({
									scrollTop: $("#audiosection").offset().top + 1000
								},
								800 //speed
							);
						}, 20);
					}
					setTimeout(() => {
						var cntElementsAudio = $('#audiocontent').children();
						for (let y = 0; y < cntElementsAudio.length; y++) {
							$(cntElementsAudio[y]).attr('style', 'vertical-align:top;display:inline-block;width:50%;padding:0 15px;');
						}
						if (cntElementsAudio.length == 2) {
							$(cntElementsAudio[0]).attr('style', 'vertical-align:top;display:inline-block;width:50%;padding:0 15px;margin-right: 0px !important');
							$(cntElementsAudio[1]).attr('style', 'vertical-align:top;display:inline-block;width:50%;padding:0 15px;margin-left: 0px !important');
						}
						if (cntElementsAudio.length == 3) {
							$(cntElementsAudio[0]).attr('style', 'vertical-align:top;display:inline-block;width:33%;padding:0 15px;margin-right: 0px !important');
							$(cntElementsAudio[1]).attr('style', 'vertical-align:top;display:inline-block;width:33%;padding:0 15px;margin-left: 0px !important;margin-right: 0px !important');
							$(cntElementsAudio[2]).attr('style', 'vertical-align:top;display:inline-block;width:33%;padding:0 15px;');
						}
						if (cntElementsAudio.length == 4) {
							$(cntElementsAudio[0]).attr('style', 'vertical-align:top;display:inline-block;width:50%;padding:0 15px;margin-right: 0px !important');
							$(cntElementsAudio[1]).attr('style', 'vertical-align:top;display:inline-block;width:50%;padding:0 15px;margin-left: 0px !important;margin-right: 0px !important');
							$(cntElementsAudio[2]).attr('style', 'vertical-align:top;display:inline-block;width:50%;padding:0 15px;margin-left: 0px !important;margin-right: 0px !important;margin-top: 0.5rem;');
							$(cntElementsAudio[3]).attr('style', 'vertical-align:top;display:inline-block;width:50%;padding:0 15px;margin-left: 0px !important;margin-top: 0.5rem;');
						}
						if (this.dvideo.length == 0 || this.featuredvideo.length == 0) {
							this.showIfOne = true;
						} else this.showIfOne = false;
					}, 10);
				}, (err) => {
					console.log(err);
				});
				this.getcommentary();
			}, (error) => {
				console.log(error);
				this.isLoading = false;
			});
	}
	scrollView() {
		setTimeout(() => {
			let elem = document.getElementsByClassName('highlight')[0] as any;
			if (elem.parentElement.previousSibling) {
				elem.parentElement.previousSibling.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "nearest"
				});
			} else {
				elem.scrollIntoView({
					behavior: "smooth",
					block: "end",
					inline: "nearest"
				});
			}
		}, 0)
	}
	customSearchFn(term: string, item: any) {
		return item.name.toLowerCase().startsWith(term.toLowerCase())
	}
	removeWord(str: string) {
		let words = str.split(" ");
		if (words.length <= 1) return str;
		if (this.ignoreWord.some(item => !item.localeCompare(words[0])))
			return words.splice(1).join(" ");
		return str;
	}
	selectopen() {
		setTimeout(() => {
			let items = $('.ng-option-label');
			for (let qq = 0; qq < items.length; qq++) {
				let tmp = $(items[qq]).html().trim();
				if (this.pageId == tmp) {
					$(".ng-dropdown-panel-items").animate({
							scrollTop: $(items[qq]).offset().top - $('#select').offset().top - 50
						},
						800 //speed
					);
				}
			}
		}, 200);
	}
	dvideo = [];
	featuredvideo = []
	kaudio = [];
	saudio = [];
	kirtan_audio = [];
	podbean_audio = [];
	kaudioall = [];
	saudioall = [];
	kirtan_audioall = [];
	ourtitle = 'abc';
	prevtitle = '';
	videos = [];
	restratkatha(x) {
		this.sendRecently(this.kaudio[x]);
		this.currentPlaying = '';
		if (this.ourtitle == this.kaudio[x].id) {
			this.currentPlaying = this.kaudio[x].id;
			this.ourtitle = '';
			$("#pauseSong").click();
			return;
		} else if (this.kaudio[x].id == this.prevtitle) {
			$("#player").show();
			$("#playSong").click();
			return;
		}
		this.ourtitle = this.kaudio[x].id;
		// Add Player List singer name and title
		localStorage.setItem('playerTitle', this.kaudio[x].title);
		localStorage.setItem('singerName', this.kaudio[x].author_name);
		let data = [];
		this._event.fire('showSingerName', data);
		// Add Player List singer name and title
		this.prevtitle = this.kaudio[x].id;
		$("#player").show();
		$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>" + this.kaudio[x].title + "</marquee>");
		$("#player audio")[0].src = this.kaudio[x].attachment_name;
		$("#srcforsong").html(this.kaudio[x].attachment_name);
		$("#setsrc").click();
		$("#playSong").click();
	}
	mydate = new Date();
	mydt;
	sendRecently(media) {
		let media_id = media.id;
		let x = this._user.getLoggedInUser();
		if (media.tag_id == 2) {
			var machine_id = this._event.getMachinId();
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid = media_id;
			var param = new URLSearchParams();
			param.set("machine_id", machine_id);
			param.set("media_id", mediaid);
			param.set("view_date", this.mydt);
			if (this.userService.isUserLogin()) {
				param.set("user_id", this.userService.getLoggedInUser().id);
			} else {
				param.set("user_id", '');
			}
			this.rs.post("media/play", param).subscribe((res) => {
			}, (error) => {
				console.log(error);
			});
		}
	}
	restratPodbean(x) {
		this.sendRecently(this.podbean_audio[x]);
		this.currentPlaying = '';
		if (this.ourtitle == this.podbean_audio[x].id) {
			this.currentPlaying = this.podbean_audio[x].id;
			this.ourtitle = '';
			$("#pauseSong").click();
			return;
		} else if (this.podbean_audio[x].id == this.prevtitle) {
			$("#playSong").click();
			$("#player").show();
			return;
		}
		this.ourtitle = this.podbean_audio[x].id;
		// Add Player List singer name and title
		localStorage.setItem('playerTitle', this.podbean_audio[x].title);
		localStorage.setItem('singerName', this.podbean_audio[x].author_name);
		let data = [];
		this._event.fire('showSingerName', data);
		// Add Player List singer name and title
		this.prevtitle = this.podbean_audio[x].id;
		$("#player").show();
		$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>" + this.podbean_audio[x].title + "</marquee>");
		$("#player audio")[0].src = this.podbean_audio[x].attachment_name;
		$("#srcforsong").html(this.podbean_audio[x].attachment_name);
		$("#setsrc").click();
		$("#playSong").click();
	}
	restratsanthya(x) {
		this.sendRecently(this.saudio[x]);
		this.currentPlaying = '';
		if (this.ourtitle == this.saudio[x].id) {
			this.currentPlaying = this.saudio[x].id;
			this.ourtitle = '';
			$("#player audio")[0].pause();
			$("#pauseSong").click();
			return;
		} else if (this.saudio[x].id == this.prevtitle) {
			this.ourtitle = this.saudio[x].id;
			$("#playSong").click();
			$("#player").show();
			return;
		}
		this.ourtitle = this.saudio[x].id;
		// Add Player List singer name and title
		localStorage.setItem('playerTitle', this.saudio[x].title);
		localStorage.setItem('singerName', this.saudio[x].author_name);
		let data = [];
		this._event.fire('showSingerName', data);
		// Add Player List singer name and title
		this.prevtitle = this.saudio[x].id;
		$("#player").show();
		$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>" + this.saudio[x].title + "</marquee>");
		$("#player audio")[0].src = this.saudio[x].attachment_name;
		$("#srcforsong").html(this.saudio[x].attachment_name);
		$("#setsrc").click();
		$("#playSong").click();
	}
	restratkirtan(x) {
		this.sendRecently(this.kirtan_audio[x]);
		this.currentPlaying = '';
		if (this.ourtitle == this.kirtan_audio[x].id) {
			this.currentPlaying = this.kirtan_audio[x].id;
			this.ourtitle = '';
			$("#player audio")[0].pause();
			$("#pauseSong").click();
			return;
		} else if (this.kirtan_audio[x].id == this.prevtitle) {
			$("#playSong").click();
			$("#player").show();
			return;
		}
		this.ourtitle = this.kirtan_audio[x].id;
		// Add Player List singer name and title
		localStorage.setItem('playerTitle', this.kirtan_audio[x].title);
		localStorage.setItem('singerName', this.kirtan_audio[x].author_name);
		let data = [];
		this._event.fire('showSingerName', data);
		// Add Player List singer name and title
		this.prevtitle = this.kirtan_audio[x].id;
		$("#player").show();
		$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>" + this.kirtan_audio[x].title + "</marquee>");
		$("#player audio")[0].src = this.kirtan_audio[x].attachment_name;
		$("#srcforsong").html(this.kirtan_audio[x].attachment_name);
		$("#setsrc").click();
		$("#playSong").click();
	}
	
	getTranslationAuthors() {
		let url = URLS.get_translation_authors;
		this._http.get(url)
			.subscribe((response) => {
				this.translationAuthors = response.data;
				sessionStorage.setItem('translationAuthors', JSON.stringify(this.translationAuthors));
				this.setTranslationAuthors();
			}, (error) => {
				console.log(error);
			});
	}
	setTranslationAuthors() {
		let isSelectedDisplay = JSON.parse(localStorage.getItem('isSelectedDisplay')) || [];
		this.translationAuthors.forEach((tAuth) => {
			let authorData = {
				key: tAuth.ReferredColumn,
				name: tAuth.Author,
				isSelected: false
			}
			if(isSelectedDisplay.length>0){
				if(isSelectedDisplay.includes(tAuth.ReferredColumn)){
					authorData.isSelected = true;
					this.selectedAuthorName = authorData.name;
				}
			}
			else{
				if (tAuth.Default && !this.highlightedScripture.translation_authour_id) {
					authorData.isSelected = true;
					this.selectedAuthorName = authorData.name;
				}
				if (this.highlightedScripture.translation_authour_id &&
					this.highlightedScripture.translation_authour_id == tAuth.id) {
					authorData.isSelected = true;
					this.selectedAuthorName = authorData.name;
				}
			}
			// this.authors.push(authorData);
			if (tAuth.Language.toLowerCase() === 'english' && tAuth.Active) {
				this.engAuthors.push(authorData);
			} else if (tAuth.Language.toLowerCase() === 'punjabi' && tAuth.Active) {
				this.punjabiAuthors.push(authorData);
			} else if (tAuth.Language.toLowerCase() === 'hindi' && tAuth.Active) {
				this.hindiAuthors.push(authorData);
			}
		});
		this.engAuthors = this.engAuthors.sort((a,b) => a.key.localeCompare(b.key));
		this.punjabiAuthors = this.punjabiAuthors.sort((a,b) => a.key.localeCompare(b.key));
		this.hindiAuthors = this.hindiAuthors.sort((a,b) => a.key.localeCompare(b.key));
	}
	translationType = null;
	changeTranslationAuthor(translationType, translationAuthor) {
		this.translationType = translationType;
		this.selectedAuthorName = translationAuthor.name;
		let isSelected = [];
		this.engAuthors.forEach((eAuth) => {
			// eAuth['isSelected'] = false;
			if(translationAuthor.key == eAuth.key && eAuth.key=='KhojgurbaaniEnglish') {
				localStorage.setItem('KhojgurbaaniEnglishSelected', eAuth['isSelected']==true?'false':'true');
			}
			if (translationAuthor.key == eAuth.key) {
				eAuth['isSelected'] = !eAuth['isSelected'];
				if(eAuth['isSelected']){
					isSelected.push(translationAuthor.key);
				}
			}
			else if(eAuth.isSelected===true) {
				isSelected.push(eAuth.key);
			}
		});
		this.punjabiAuthors.forEach((pAuth) => {
			// pAuth['isSelected'] = false;
			if (translationAuthor.key == pAuth.key) {
				pAuth['isSelected'] = !pAuth['isSelected'];
				if(pAuth['isSelected']){
					isSelected.push(translationAuthor.key);
				}
			}
			else if(pAuth.isSelected===true) {
				isSelected.push(pAuth.key);
			}
		});
		this.hindiAuthors.forEach((pAuth) => {
			// pAuth['isSelected'] = false;
			if (translationAuthor.key == pAuth.key) {
				pAuth['isSelected'] = !pAuth['isSelected'];
				if(pAuth['isSelected']){
					isSelected.push(translationAuthor.key);
				}
			}
			else if(pAuth.isSelected===true) {
				isSelected.push(pAuth.key);
			}
		});
		localStorage.setItem('isSelectedDisplay', JSON.stringify(isSelected));
	}
	goToPage(page) {
		if (this.isAudioPlaying) {
			this.playerService.stop();
		}
		this._router.navigate(['/shabad', page]);
	}
	goToNextPrevPage(type, pageId) {
		pageId = parseInt(pageId);
		if (type == 'next') {
			pageId = pageId + 1
		} else {
			pageId = pageId - 1
		}
		this.goToPage(pageId);
	}
	wordDetail(word) {
		if (word.includes("॥")) {
			return;
		}
		this.getWordDetail(word);
	}
	getWordDetail(selectedWord) {
		this.isGetWordDetailApiRunning = true;
		this.selectedWordDetail = {};
		let url = URLS.get_word_detail;
		url += '?lang=gurmukhi&value=' + selectedWord;
		this._http.get(url)
			.subscribe((res) => {
				if (!res.data) {
					this.selectedWordDetail = {};
					this.isGetWordDetailApiRunning = false;
				}
				this.selectedWordDetail = res.data;
				this.isGetWordDetailApiRunning = false;
			}, (error) => {
				console.log(error);
				this.isGetWordDetailApiRunning = false;
			});
	}
	openAddVideoPopup(template: TemplateRef < any > ) {
		this.modalRef = this._modalService.show(template, {
			ignoreBackdropClick: true
		});
	}
	addAudio(type, audio) {
		let audioData = {
			id: audio.id,
			title: audio.attributes.title,
			audioUrl: (audio.attributes.attachment_url) ? audio.attributes.attachment_url : audio.attributes.attachment_name,
			attributes: {
				status: Boolean(Number(audio.attributes.status))
			}
		}
		if (type == 'santhya') {
			this.santhyAudio.push(audioData);
		} else if (type == 'kirtan') {
			this.kirtanAudio.push(audioData)
		} else {
			this.kathaAudio.push(audioData)
		}
		this.allAudioList = [];
		this.allAudioList = this.allAudioList.concat(this.santhyAudio, this.kirtanAudio, this.kathaAudio);
		this._playerComp.getTracks(this.allAudioList);
	}
	addVideo(type, video) {
		let videoUrl = video['attributes']['external_url'];
		video['attributes']['youtube_video_url'] = videoUrl;
		if (videoUrl) {
			if (this._helper.isYoutubeUrl(videoUrl)) {
				let youtubeEmbedUrl = this._helper.getYoutubeEmbedUrl(videoUrl);
				video['attributes']['youtube_video_url'] = youtubeEmbedUrl;
			}
		}
		if (type == 'feature-video') {
			this.featuredVideos.push(video);
		} else {
			this.discussionVideos.push(video)
		}
	}
	validateAction(action) {
		let flag = this._user.isUserValidateForThisAction(action);
		return flag;
	}
	/**
	 * Reject added media by users
	 * @param String  type  	audio/video
	 * @param String  subType 	audio/video subtype
	 * @param Object  media		selected media object
	 */
	mediaReject(type, subType, media) {
		let url = URLS.media;
		url += "/" + media.id;
		this._http.delete(url)
			.subscribe((response) => {
				if (type == 'video') {
					switch (subType) {
						case "featured":
							this.deleteDataFromMedia(media, this.featuredVideos);
							break;
						default:
							this.deleteDataFromMedia(media, this.discussionVideos);
							break;
					}
				} else {
					switch (subType) {
						case "santhya":
							this.deleteDataFromMedia(media, this.santhyAudio);
							break;
						case "kirtan":
							this.deleteDataFromMedia(media, this.kirtanAudio);
							break;
						default:
							this.deleteDataFromMedia(media, this.kathaAudio);
							break;
					}
				}
				let msg = "Audio Successfully Removed.";
				if (type == 'video') {
					msg = "Video Successfully Removed.";
				}
				this._alert.showAlert('success', msg);
			}, (error) => {
				console.log(error);
				this._alert.showAlert('danger', error.message);
			});
	}
	deleteDataFromMedia(selectedMedia, allMedia) {
		let index = null;
		allMedia.forEach((media, i) => {
			if (selectedMedia.id == media.id) {
				index = i;
			}
		});
		if (index >= 0) {
			allMedia.splice(index, 1);
		}
	}
	onSelectLareevaarScriptureOption() {
		this.isLareevaarShow = !this.isLareevaarShow;
		this.setShabadPageDataInLs();
	}
	onSelectRomanScriptureOption() {
		this.isRomanShow = !this.isRomanShow;
		this.setShabadPageDataInLs();
	}
	setShabadPageDataInLs() {
		let data = {
			is_lareevaar_scripture_show: this.isLareevaarShow,
			is_roman_scripture_show: this.isRomanShow
		}
		localStorage.setItem('shabad_page_data', JSON.stringify(data));
	}
	setDataFromLocalStorage() {
		let saveLSData = JSON.parse(localStorage.getItem('shabad_page_data')) || {};
		if (saveLSData['is_lareevaar_scripture_show']) {
			this.isLareevaarShow = saveLSData['is_lareevaar_scripture_show'];
		}
		if (saveLSData['is_roman_scripture_show']) {
			this.isRomanShow = saveLSData['is_roman_scripture_show'];
		}
	}
	confirmRejection(type, subType, media) {
		if (Object.keys(this.selectedMediaRejectionData).length == 0) {
			this.modalRef.hide();
			return;
		}
		let data = Object.assign({}, this.selectedMediaRejectionData);
		this.mediaReject(data['media_type'], data['media_sub_type'], data['media_obj']);
		this.selectedMediaRejectionData = {}; //reset
		this.modalRef.hide();
	}
	name_avatar(name) {
		if(name==null){
			return 'GU';
		}
		this.exclude.forEach(function(val){
			name = name.replace(val,'');
		});
		if(name=='KhojGurbani') {
			name = 'Khoj Gurbani';
		}
		name = name.match(/\b(\w)/g).join('');
		if(name.length>2){
			name = name.substring(0,1)+name.substr(name.length-1);
		}
		return name;
	}
	resetDisplay() {
		this.isRomanShow = true;
		this.isLareevaarShow = false;
		this.setShabadPageDataInLs();

		let isSelected = [];
		this.engAuthors.forEach((eAuth) => {
			if(eAuth.key=="KhojgurbaaniEnglish") {
				eAuth.isSelected = true;
			}
			else {
				let author = this.translationAuthors.filter(function( obj ) {
					return obj.ReferredColumn == eAuth.key;
				});
				author = author.length>0 ? author[0] : false;
				eAuth.isSelected = author && author['Default']==1 ? true : false;
			}
			if(eAuth.isSelected===true) {
				isSelected.push(eAuth.key);
			}
		});
		this.punjabiAuthors.forEach((pAuth) => {
			let author = this.translationAuthors.filter(function( obj ) {
				return obj.ReferredColumn == pAuth.key;
			});
			author = author.length>0 ? author[0] : false;
			pAuth.isSelected = author && author['Default']==1 ? true : false;
			if(pAuth.isSelected===true) {
				isSelected.push(pAuth.key);
			}
		});
		this.hindiAuthors.forEach((pAuth) => {
			let author = this.translationAuthors.filter(function( obj ) {
				return obj.ReferredColumn == pAuth.key;
			});
			author = author.length>0 ? author[0] : false;
			pAuth.isSelected = author && author['Default']==1 ? true : false;
			if(pAuth.isSelected===true) {
				isSelected.push(pAuth.key);
			}
		});
		localStorage.setItem('isSelectedDisplay', JSON.stringify(isSelected));
		localStorage.setItem('KhojgurbaaniEnglishSelected', 'true');
	}
}