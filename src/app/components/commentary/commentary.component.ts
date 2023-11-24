import { Component, OnInit, TemplateRef, SimpleChanges, ViewEncapsulation, AfterViewChecked, OnChanges } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { HttpService } from './../../services/http.service';
import { environment } from './../../../environments/environment';
import { PlayerService} from './../../services/player.service';
import { UserService } from './../../services/user.service';
import { HelperService } from './../../services/helper.service';
import { AlertService } from './../../services/alert.service';

var FileSaver = require('file-saver');
import { URLS } from './../../config/urls.config';
import { TOTAL_PAGES, AUDIO_TAG_IDS, VEDIO_CATEGORY_IDS } from './../../config/global.config';
import { MEDIA_TYPE } from './../../config/media.config';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from 'src/app/services/resources.services';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { text } from '@fortawesome/fontawesome-svg-core';
declare var $;
declare var moment;
import Swal from 'sweetalert2';
import {filter, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import { EventService } from 'src/app/services/event.service';


@Component({ 
  selector: 'app-commentary',
  templateUrl: './commentary.component.html',
  providers: [NgbModalConfig, NgbModal],
  styleUrls: ['./commentary.component.scss']
})
export class CommentaryComponent implements OnInit,AfterViewChecked,OnChanges {
	pageList = [];
	startindex=0;
	slice=10;
  endindex=this.slice;
  

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		//alert("destroy");
		//this.setheight();
	}
	ngAfterViewChecked()
	{
		// for(var i=0;i<this.shabadData['scriptures'].length;i++)
		// {
		// 	var i1=$("#ul"+i).height();
		// 	var i2=$("#ul2"+i).height();
		// 	if(i1>i2)
		// 	{
		// 		$("#ul"+i).height(i1+"px");

		// 		$("#ul2"+i).height(i1+"px");
		// 	}
		// 	else{
		// 		$("#ul"+i).height(i2+"px");
		// 		$("#ul2"+i).height(i2+"px");
		// 	}
		// }
	}
	ngOnChanges(changes: SimpleChanges): void {
		this.setpage();
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		//this.setheight(true);
	}

	ngAfterViewInit(): void {
		//alert("viewinit")
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.
		//this.setheight();
	}
 
	setheight(val)
	{
		// setTimeout(() => {
		// 	for(var i=0;i<this.shabadData['scriptures'].length;i++)
		// {
		// 	var i1=$("#ul"+i).parent().height();
		// 	var i2=$("#ul2"+i).parent().height();
			
		// 	if(i1>i2)
		// 	{

		// 		if(val)
		// 		{
		// 			i1=i1+20;
		// 		}
		// 		else{
		// 			i1=i1-50;
		// 		}
		// 		$("#ul"+i).height(i1+"px");
	 	// 		$("#ul2"+i).height(i1+"px");
		// 	}
		// 	else{

		// 		if(val)
		// 		{
		// 			i1=i1+20;
		// 		}
		// 		else{
		// 			i1=i1-50;
		// 		}
		// 		//i1=i1-20;
		// 		//i1=i1+20;
		// 		$("#ul"+i).height(i1+"px");
	 	// 		$("#ul2"+i).height(i1+"px");
		// 		// i2=i2+20;
		// 		// $("#ul"+i).height(i2+"px");
		// 		// $("#ul2"+i).height(i2+"px");
		// 	}
		// }
		// }, 100);
		
	}
	toggle=true;

	restrat(val)
	{
		if(this.toggle){
				$("#player").hide();
				$("#player audio")[0].pause();
				$("#pauseSong").click();
				$("#matradioplayer").show();
				$("#matradioplayer audio")[0].src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"//"http://103.246.184.34:8000/jak";
				
				$("#matradioplayer audio")[0].play();
		}
		else{
			$("#player").hide();
			$("#player audio")[0].pause();
			$("#pauseSong").click();
			$("#matradioplayer").show();
			$("#matradioplayer audio")[0].pause();
		}
		//$("#pbtn").toggle("fa-play-circle fa-pause-circle");
		this.toggle=!this.toggle;
	}
  



	modalRef: BsModalRef;

	shabad: object = {};
	shabadId: number;
	pageId: number = 1;
	currentShabadPage: number = 1;
	totalPages: number = TOTAL_PAGES;

	shabadData: object = {};
	shabadPages: Array<any> = [];

	isLareevaarShow: boolean 		= false;
	isRomanShow: boolean 			= false;
	hideTranslation: boolean 		= true;


	shabadLanguages: Array<any> = [
		{
			key : 'pad_ched',
			name: 'Gurmukhi - Pad Ched',
			scriptures: []
		},
		{
			key : 'larivaar',
			name: 'Gurmukhi - Larivar',
			scriptures: []
		},
		{
			key : 'roman',
			name: 'Roman Script',
			scriptures: []
		}
	]

	isPadChedShow: boolean 			= true;

	translationAuthors: Array<any> 	= [];
	authors: Array<any> 			= [];
	engAuthors: Array<any> 			= [];
	punjabiAuthors: Array<any> 		= [];
	translationsByAuthors: object 	= {};
	selectedEnglishAuthor: string 	= '';
	selectedPunjabiAuthor: string 	= '';
	selectedAuthorName: string 		= '';

	blogs: Array<any> 				= [];
	discussionVideos: Array<any> 	= [];
	featuredVideos: Array<any> 		= [];
	santhyAudio: Array<any> 		= [];
	kirtanAudio: Array<any> 		= [];
	kathaAudio: Array<any> 			= [];

	showAllBlogs: boolean = false;
	showAllKatha: boolean = false;

	dummayTracks: Array<any> = [
		{
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

	highlightedScripture = {
		id: null,
		language: null,
		content: null,
		translation_authour_id: null
	}

	openVerticallyCentered(content) {
		//this.modalService.open(content, { centered: true });
	}

	change()
	{
		this.goToPage(this.pageId);
	}
	constructor(
		private http: HttpClient,
		private _modalService: BsModalService,
				private _http: HttpService,
				private _activeRoute: ActivatedRoute,
				private _router: Router,
				private playerService: PlayerService,
				private _user: UserService,
				private _helper: HelperService,
				private _alert: AlertService,
				private modalService: NgbModal,
				private rs:ResourcesService,
				private userService:UserService,
				private _event: EventService,
			    config: NgbModalConfig
				) {
					config.backdrop = 'static';
      				config.keyboard = false;
				}

	
open(ev)
{
	$('#exampleModalCenter').modal('hide');
}

	onViewSearch(keyword) {

		let serachParams = { "search_keyword": keyword, "search_option": 1, "page": 1, "limit": 25, "language": "gurmukhi", "content": "gurbani", "pageF": 1, "pageT": 1430 };
		; localStorage.setItem('params', JSON.stringify(serachParams));
	}



selectopen(){
	setTimeout(() => {	
		let items = $('.ng-option-label');
		for(let qq = 0; qq < items.length; qq++){
			let tmp = $(items[qq]).html().trim();
			if(this.pageId == tmp){
				$(".ng-dropdown-panel-items").animate(
					{
					scrollTop: $(items[qq]).offset().top - $('#select').offset().top - 50
					},
					800 //speed
				);
			}
		}
		//$('.ng-dropdown-panel-items').attr('style', 'overflow:hidden');
	}, 200);
}

commentary='';

htmlText;
commentary_available=false;
checkshown()
{
	var x= this.punjabipodcast==null || this.englishpodcast==null || this.commentary_available || this.add_commentary;
	return x;
}
getcommentary()
{
	if(!this.shabadId){
		this.shabadId = 1;
	}
	this.setpage();
	this.rs.get("commentary/list/"+this.shabadId).subscribe((res)=>{
		if(res['status']==200){	
			if(res['result'].length){
			  this.commentary=res['result'][0]['commentary'];
			  this.htmlText=this.commentary
              this.commentary_available=true;
			}
			else{
				this.commentary='';
				this.htmlText='';
				this.commentary_available=false;
			}
		}
	},(err)=>{
		console.log(err);
		// alert("err adding translation");
		// this.showupload=true;
		// this.modalService.dismissAll();
	});
}
saveCommentary(loader)
{
	if(this.htmlText.toString().trim().length!=0)
	{
	    this.showupload=false;
		this.modalService.open(loader,{centered: true,windowClass: 'dark-modal'});
		let url=new URLSearchParams();
		url.set("text",this.htmlText.toString());
		url.set("user_id",this.userService.getLoggedInUser().id);
		//this.modalService.open(loader);
		this.rs.post("commentary/add/"+this.shabadId,url).subscribe((res)=>{
			if(res['status']==200){	

			     Swal.fire('',res.message,'success');
			    this.modalService.dismissAll();
				this.getShabad();
				this.showupload=true;
				this.getcommentary();
				this.modalService.dismissAll();
			}
			else{
			this.showupload=true;
			this.modalService.dismissAll();
			//alert(res['message']);

			Swal.fire('',res.message,'error');
			}
			this.showcommenatary=false;
		},(err)=>{
			alert("err adding commenatary");
			this.showupload=true;
			this.modalService.dismissAll();
			this.showcommenatary=false;

			Swal.fire('','Something went wrong','error');
		});
	}
	else{
		alert("enter commentary");
	}
}
showupload=true;
save(id,loader)
{
		var txt=$("#txt"+id).val();
		this.showupload=false;
		this.modalService.open(loader,{centered: true,windowClass: 'dark-modal'});
		let url=new URLSearchParams();
		url.set("text",txt.toString());
		url.set("user_id",this.userService.getLoggedInUser().id);
        
		this.rs.post("shabad-data/add-translation/"+id,url).subscribe((res)=>{
			if(res['status']==200){	

				Swal.fire('',res.message,'success');
			    this.modalService.dismissAll();
				this.getShabad();
				this.showupload=true;
			}
			else{
			this.showupload=true;
			this.modalService.dismissAll();
			//alert(res['message']);

			Swal.fire('',res.message,'error');
			}
		},(err)=>{
			//alert("err adding translation");
			this.showupload=true;
			this.modalService.dismissAll();

			Swal.fire('',"Something went wrong",'success');
		});

}
shabadlist=[];
  selectedShabad;
  categorieslist=[];
  subcategorylist=[];
  selectedCategory=[];
  selectedSubCategory=[];
  selectedLg=1;
  lg=[{id:1,name:"english"},{id:2,name:"punjabi"}];

isadmin=false;
iscommentshow=false;
setindex(){
	this.isplaying=false;
  }
  set2()
  {
	this.isplaying=true;
  }
  clicked()
  {
	  
  }

  checkdisabled()
  {
	  // if(this.pageId>=5){
	  // 	return false;
	  // }
	  // return true;
	  if(this.startindex==0)
	  {
		  return true;
	  }
	  return false;
  }
  checkdisablednext()
  {
	  // if(this.shabadPages.length >= 5){
	  // 	return false;
	  // }
	  // return true;
	  if(this.endindex >= this.shabadPages.length)
	  {
		  return true;
	  }
	  return false;
  }
  change2()
  {
	  if(window.innerWidth>=567){
	     this.startindex=this.startindex-this.slice;
	     this.endindex=this.endindex-this.slice;
	  }
	  else{

		this.startindex=this.startindex-this.slice;
		this.endindex=this.endindex-this.slice;
	  }
	  //this._router.navigate(['/shabad',this.pageId,this.shabadId-1]);
  }
  change3()
  {
	if(window.innerWidth>=567){
	  
	  this.startindex=this.startindex+this.slice;
	  this.endindex=this.endindex+this.slice;
	}
	else {

		this.startindex=this.startindex+this.slice;
		this.endindex=this.endindex+this.slice;
	}
	  //alert(this.shabadId+1);
	  //this._router.navigate(['/shabad',this.pageId,this.shabadId+1]);
	  
  }
  

  add_comment_permission=false;
  approve_comment_permission=false;
  isloggedin=false;
  errdata=false;
  waitingfordata=false;
  add_commentary=false;
  checkroles()
  { 
	  try{
	  var user=JSON.parse(window.localStorage.getItem("current_user").toString());
	  if(user){ 
		  this.isloggedin=true;
		var roles=user['roles'];
		
		roles.indexOf("add_comment")> -1 ? this.add_comment_permission=!this.add_comment_permission:'';
		if(user.is_block == 1)
		{
			this.add_comment_permission=false;
		}
		roles.indexOf("approve_comment")> -1 ? this.approve_comment_permission=!this.approve_comment_permission:'';
		roles.indexOf("edit_own_comment")> -1 ? this.edit_own_comment=!this.edit_own_comment:'';
		roles.indexOf("add_commentary")> -1 ? this.add_commentary=!this.add_commentary:'';
		
		this.uid=user.id;
		this.uroleid = user.role.id;
		  //if(roles.contains)
		}
	}
	catch(e)
	{

	}
  }

	edit_own_comment=false;
	


  time;
  timeupload=false;
  search=false;
  searchedResult = {
	data: [],
	pagination: {
		page: 1,
		limit: 25
	}
};
get(val)
{
	//if(val.toString().toLowerCase() == this.prevsearch){
			var arr = val.split(/></g);
			for(var i = 0; i < arr.length; i++){
				if(i!=0){
				arr[i] = '<' + arr[i] + '>';
				}
				if(arr[i].includes(this.searchKeword.toString().toLowerCase()) || arr[i].includes(this.searchKeword) || arr[i].includes(this.searchKeword.toString().toUpperCase()))
				{
					return arr[i];
					break;
				}
			}
    //}

	
   //return val.split("<br>")[0];
}
  metadata;
  searchKeword;
  scrolled = false;

  onKeydownEvent2(event: KeyboardEvent): void {
	if (event.keyCode === 13) {
	  this.searchData();
	}
  }
  prevsearch;
  searchData(loadOnShowMore=false) {

	if(this.searchKeword.length==0)
	{
		return;
	}

	// if (loadOnShowMore) {
	// 	this.searchedResult.pagination.page++;
	// }

	let url = URLS.advance_search;
	// if($(".navbar-toggler").is(":visible"))
	// {
	// }
	// else{
	//         this.ro	
	// }
	let params = {
		search_keyword	: this.searchKeword.toString().toLowerCase(),
		search_option	: 3,
		page 			: 1,
		limit			: 25,
	}

	this.prevsearch=this.searchKeword.toString().toLowerCase();

	params['language']	=  "english";//this.advanceSearchOptions.selectedLanguage;
	params['content']	=  "commentary";//this.advanceSearchOptions.selectedContent;

	params['pageF']		=  1;//this.advanceSearchOptions.pageFrom,
	params['pageT']		=  1430;//this.advanceSearchOptions.pageTo
	
	



	this._http.get(url, params)
	.subscribe((res) => {

		// if (!loadOnShowMore) {
		// 	this.searchedResult.data = [];
		// }

		if (res.data && res.data.length > 0) {

			res.data.forEach((val) => {
				if (res.included) {
					res.included.forEach((rel) => {
						if (rel.type == 'author') {
							if (rel.id == val['attributes']['author_id']) {
								val['author_data'] = rel.attributes;
							}
						}

						if (rel.type == 'melody') {
							if (rel.id == val['attributes']['melody_id']) {
								val['melody_data'] = rel.attributes;
							}
						}
					});
				}

			});
 
			this.searchedResult.data = res.data;//this.searchedResult.data.concat(res.data);
			this.searchedResult.data.forEach((elem)=>{
				elem['attributes']['commentary2']=this.get(elem['attributes']['commentary']);
			})
			this.metadata=res.meta.pagination;
			this.search=true;
		}

		this.searchedResult.pagination['total'] = res.meta.pagination.total;
		
	}, (err) => {
		console.log(err);
	});
}



  setSelected(id)
	{			
		$(".active1").removeClass("active1");
		 $("#"+id).addClass("active1");
	}

	ngOnInit() {
		let user = this.userService.getLoggedInUser();
		if(user && (user.role_id==3 || user.role_id==4)) {
			this.hideTranslation = false;
		}
		// this.getcommentary();
		this._activeRoute.params.subscribe((params) => {
			this.pageId = params.id;
	
			if (params.shabad_id) {
				this.shabadId = params.shabad_id;

			}else{
				this.shabadId = null;
			}
			setTimeout(() => {
				if (this.isAudioPlaying) {
					this.playerService.stop();
				}

				this.getShabad();
				this.allAudioList = [];
				// this.getSanthya();
				//this.getcommentary();
				//this.getKirtan();
				//this.getKatha();

				//this.getDiscussionVideos();
				//this.getFeaturedVideos();

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

			if (params.highlighted_scripture_id
				&& (params.selected_content == 'teeka' || params.selected_content == 'english-translation')
				&& params.selected_translation_author) {

				this.highlightedScripture.id = params.highlighted_scripture_id;
				this.highlightedScripture.content = params.selected_content;
				this.highlightedScripture.translation_authour_id = params.selected_translation_author;
			}
	    });

		document.getElementById("main2").scrollTo(0,0);

		for(let i = 0; i < this.totalPages; i++){
			this.pageList.push(i+1);
		}
		
		let f = this;
		(function(f){
			$("#select2").on('change', function(){
				setTimeout(function (){
					f.change();
				}, 100);
			})
		}(f));
		if(window.innerWidth>=567){
			this.startindex=0;//this.startindex+4;
			this.endindex=this.slice;//this.endindex+4;
		}
		else{
			this.startindex=0;//this.startindex-2;
			this.endindex=this.slice;//this.endindex-2;
		}
		this.setSelected("commentary");
		var self = this;
		this.checkroles();
		$('audio')[0].onpause = function() {
		   self.setindex();
		 };
		 $('audio')[0].onplay = function() {
		   self.set2();
		 };
	   

  $("#audio").on("loadedmetadata", function(e) {
});
$("#audio").on("canplaythrough", (e)=>{
  var seconds = e.currentTarget.duration;
  var duration = moment.duration(seconds, "seconds");
  
  var time = "";
  var hours = duration.hours();
  if (hours > 0) { time = hours + ":" ; }
  
  time = hours + duration.minutes() + ":" + duration.seconds();
  this.time=time;
  this.timeupload=true;

  this.errdata=false;
  this.waitingfordata=false;
}); 
$('#audio').on('error', (e)=> {
   console.log(e);
  this.errdata=true;
  this.waitingfordata=false;
});

		if (this._user.isUserLogin()) {
            this.user = this._user.getLoggedInUser();
        }

		$(document.body).on('click','.add', function(e) {  
			var li = $(this).closest('li').next('li');  $(li).css("display","block");
			//var id=$(this).attr('id');
			var id=$(this).data('id');
			$(this).css("display","none");
			$("#comm").hide();
		});
		// this.getTranslationAuthors();
		this.setDataFromLocalStorage();
		//this.audioPlayerEvents();

		if(JSON.parse(localStorage.getItem('current_user')).role.name=="super admin")
		{
              this.isadmin=true; 
		}


		  //this.getcommentary();
		  if(this.userService.isUserLogin())
		  {
				this.iscommentshow=true;
		  }
			this.getcomment();
	}

	scroll(to) {
		if(this.scrolled) {
			return;
		}
		this.scrolled = true;
		setTimeout(() => {	
			let screenwidth = $("body").width();
			if(screenwidth < 500 || true) {
				let q = $("#"+to);
				let offset = $(q).offset().top;
				let mainScrollTop = $("#main2").scrollTop();
				$("#main2").animate(
					{
						scrollTop: mainScrollTop + offset - 80
					},
					800 //speed
				);
			}
		}, 1000);
	}

	getPodcastList() {
		let getCategorieslist = sessionStorage.getItem('getCategorieslist');
		if(getCategorieslist) {
			this.categorieslist = JSON.parse(getCategorieslist);
		}
		else {
			this.rs.get("categories/podcast-list").subscribe((res) => {
				this.categorieslist=res["result"];
				var d=this.categorieslist.filter((item)=> item.status!=0);
				this.categorieslist=[];
				this.categorieslist=d;
				sessionStorage.setItem('getCategorieslist', JSON.stringify(this.categorieslist));
				//this.selectedCategory[0]=this.categorieslist[0].id;
				}, (err) => {
					console.log(err);
			});
		}
	}
	getSubCategoryList() {
		let getSubcategorylist = sessionStorage.getItem('getSubcategorylist');
		if(getSubcategorylist) {
			this.subcategorylist = JSON.parse(getSubcategorylist);
		}
		else {
			this.rs.get("categories/podcast-subcategory-list").subscribe((res) => {
				this.subcategorylist=res["result"];
				var d=this.subcategorylist.filter((item)=> item.status!=0);
				this.subcategorylist=[];
				this.subcategorylist=d;
				sessionStorage.setItem('getSubcategorylist', JSON.stringify(this.subcategorylist));
				//this.selectedSubCategory[0]=this.subcategorylist[0].id;
				}, (err) => {
					console.log(err);
			});
		}
	}
	getShabadList() {
		let getShabadlist = sessionStorage.getItem('getShabadlist');
		if(getShabadlist) {
			this.shabadlist = JSON.parse(getShabadlist);
		}
		else {
			this.rs.get("shabad-data/list").subscribe((res) => {
				this.shabadlist=res["result"];
				sessionStorage.setItem('getShabadlist', JSON.stringify(this.shabadlist));
				//this.selectedSubCategory[0]=this.subcategorylist[0].id;
				}, (err) => {
					console.log(err);
			});
		}
	}

	saveComment(){

	}
	onKeydownEvent(event: KeyboardEvent): void {
		if (event.keyCode === 13) {
		  this.addcomment();
		}
	}
	mycomment='';
	comment='';
	htmlText2;
	isChecked;
	htmlTextedit;

	showid;
	lastid;


	getTranslationAuthors(){
		let url = URLS.get_translation_authors;
		this._http.get(url)
		.subscribe((response) => {
			this.translationAuthors = response.data;

			this.translationAuthors.forEach((tAuth) => {
				let authorData = {
					key: tAuth.ReferredColumn,
					name: tAuth.Author,
					isSelected: false
				}

				if (tAuth.Default && !this.highlightedScripture.translation_authour_id) {
					authorData.isSelected = true;
					this.selectedAuthorName = authorData.name;
				}

				if (this.highlightedScripture.translation_authour_id
					&& this.highlightedScripture.translation_authour_id == tAuth.id) {
					authorData.isSelected = true;
					this.selectedAuthorName = authorData.name;
				}

				// this.authors.push(authorData);
				if (tAuth.Language.toLowerCase() === 'english' && tAuth.Active) {
					this.engAuthors.push(authorData);
				} else if (tAuth.Language.toLowerCase() === 'punjabi' && tAuth.Active) {
					this.punjabiAuthors.push(authorData);
				}

			});

			// this.selectedEnglishAuthor = this.engAuthors[0].key;
			// this.selectedPunjabiAuthor = this.punjabiAuthors[1].key;
		}, (error) =>{
			console.log(error);
		});
	}

	replyid = null;
	reply(id)
	{
	   this.replyid=id;
	   this.showid=-1;
	}
	edit(comment,id)
	{
	 this.htmlTextedit=comment;
	 this.showid=id;
	 this.replyid=-1;
	}
	update(type,loader)
	{

		if(this.htmlTextedit.toString().trim().length!=0){
			//this.modalService.open(loader);
			this.modalService.open(loader,{centered: true,windowClass: 'dark-modal'});
		
			let param=new URLSearchParams();
			param.append("text",this.htmlTextedit.toString());

		param.set("user_id",this.userService.getLoggedInUser().id);
          this.rs.post(type==1?"commentary/update-comment/"+this.showid:"commentary/update-reply/"+this.showid,param).subscribe((res)=>{
			if(res.status!="200")
			{

				Swal.fire('','Err updating comment','error');
			}
			else{

				Swal.fire('','Comment updated','success');
			}
			this.modalService.dismissAll();	 
			this.getShabad(); 
			this.replyid='';
			this.showid='';
		  },(err)=>{
			  console.log(err);
			this.replyid='';
			this.showid='';
			this.modalService.dismissAll();	 
			this.getShabad(); 

			Swal.fire('','Something went wrong','error');
			
		  });
		}
	}
	approve(id,type,loader,status)
	{
		this.modalService.open(loader,{centered: true,windowClass: 'dark-modal'});
		
		let param=new URLSearchParams();
		param.set("status",status=="1"?"0":"1");
		this.rs.post(type==1?"commentary/comment-status/"+id:"commentary/reply-status/"+id,param).subscribe((res)=>{
			if(res.success!="200")
			{

				Swal.fire('','Err approving reply','error');
			}
			else{

				Swal.fire('',res.message.toString(),'success');
			}

			this.modalService.dismissAll();
			this.getShabad();
		    this.modalService.dismissAll();
			this.replyid='';
			this.showid='';
		},(err)=>{
			this.replyid='';
			this.showid='';

			Swal.fire('','Something went wrong','error');
			this.modalService.dismissAll();	 
			this.getShabad(); 	
		});
	}
	delete(id,type)
	{

		if(confirm("Are you sure to delete "+id)) {
      
		this.rs.post(type==1?"commentary/comment-delete/"+id:"commentary/reply-delete/"+id,new URLSearchParams()).subscribe((res)=>{
			if(res.status!="200")
			{

				Swal.fire('','Err deleting comment','error');
			}
			else{

				Swal.fire('','Comment deleted','success');
			}

			this.modalService.dismissAll();
			this.getShabad();
			this.replyid='';
			this.showid='';
			},(err)=>{

				this.modalService.dismissAll();
				this.getShabad();
				this.replyid='';
			this.showid='';

			Swal.fire('','Something went wrong','error');
			});
		}
	}
	checkValue()
	{
		this.istranslationshown=!this.istranslationshown;
	
		//  if(this.isChecked)
		//  {

		//  }
		//  else{
			 
		//  }
	}
	addcomment()
	{
		if(this.htmlText2.toString().trim().length==0)
		{
			Swal.fire('',"please fill the comment field",'error');
			return;
		}
		
		
		let param=new URLSearchParams();
		param.set("text",this.htmlText2.toString());
		param.set("user_id",this.userService.getLoggedInUser().id);
		this.mycomment='';
		this.rs.post("commentary/add-comment/"+this.shabadId,param).subscribe((res) => {
			this.htmlText2='';
				if(res['status']==200)
				{
						//this.getcomment();
						Swal.fire('',this.user['auto_approve'] || this.user['role_id'] == '4' || this.user['role_id'] == '3'?'Comment added':'Your comment will be posted once approved','success');
						this.getShabad();
				}
				else{

					Swal.fire('','Err adding comment','error');
					//alert("err adding comment");
				}
		}, (err) => {
			this.htmlText2='';
			Swal.fire('','Something went wrong','error');
				  console.log(err);
		  });

	}



	htmlReply;
	addreply(id,loader)
	{
		
		if(this.htmlReply.toString().trim().length==0)
		{
			Swal.fire('',"please fill the comment field",'error');
			return;
		}
		
		
		//this.modalService.open(loader);
		this.modalService.open(loader,{centered: true,windowClass: 'dark-modal'});
		
		let param=new URLSearchParams();
		param.set("text",this.htmlReply.toString());
		param.set("user_id",this.userService.getLoggedInUser().id);
		this.mycomment='';
		this.rs.post("commentary/add-reply/"+id,param).subscribe((res) => {
			this.htmlReply='';
				if(res['status']==200)
				{
						//this.getcomment();
						this.getShabad();
						 this.modalService.dismissAll();
						 
						Swal.fire('','Reply added','success');
				}
				else{
					
					Swal.fire('','Err adding reply','error');
		this.modalService.dismissAll();
				}
		}, (err) => {
			this.htmlReply='';
			
				  console.log(err);

				//  alert("err adding reply");

				Swal.fire('','Err adding reply','error');
		this.modalService.dismissAll();
		  });

	}
	commentlist=[];
	lastcomment;
	showallcomment=true;

	gettime(dt)
	{
		let d = dt;
		try{
			let endDate = new Date(new Date(dt.toString()).toISOString());
			
			var purchaseDate = moment(new Date().toISOString());
			//purchaseDate=moment(purchaseDate.format("YYYY-MM-DD HH:mm:ss"))
			let diffMs = moment.duration(purchaseDate.diff(moment(dt.split(" ").join("T")+"Z")));//(purchaseDate.getTime() - endDate.getTime()); // milliseconds

			let diffDays = diffMs.days();
			let diffHrs = diffMs.hours();
			let diffMins = diffMs.minutes();
			

			// let diffDays = Math.floor(diffMs / 86400000); // days
			// let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
			// let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

			if(diffDays>=1)
			{
				return diffDays+" days ago";
			}
			else if(diffHrs>=1)
			{
				return diffHrs+" hours ago";
			}
			else if(diffMins>=1)
			{
				return diffMins+" mintues ago";
			}
			else {
				return diffMs.seconds()+" seconds ago";
			}
		}
		catch(error){
			return d;
		}
	}
	lasttime;
	lastname;
	lastreplies=[];
	last_id;
	acceptedcommentlist=[];
	acceptedlastcomment;
	uid;
	uroleid;

	
	
	getcomment()
	{
		this.commentlist=[];
		this.lastcomment='';
		this.lasttime='';
		this.lastname='';
		if(this.shabadId==null) {
			return;
		}
		this.rs.get("commentary/shabad-comment-list/"+this.shabadId).subscribe((res) => {
			this.commentlist=res["result"];

			this.commentlist.sort((x,x2)=> new Date(x.created_at).getTime() - new Date(x2.created_at).getTime() );
			
			
			if(!this.approve_comment_permission){

				if(this.userService.isUserLogin()==false){

				  this.acceptedcommentlist=this.commentlist.filter((x)=> x.approve_status == "1");
				  for(var i=0;i<this.acceptedcommentlist.length;i++)
					{
						if(this.acceptedcommentlist[i].replies.length!=0)
						{
							this.acceptedcommentlist[i].replies=this.acceptedcommentlist[i].replies.filter((x)=> x.approve_status == "1");
						}
					}
				}
				else{
			// this.lastcomment=this.commentlist[this.commentlist.length-1].comment;
			// this.lastname=this.commentlist[this.commentlist.length-1].name;
			// this.lasttime=this.gettime(this.commentlist[this.commentlist.length-1].created_at);
			// this.lastreplies=this.commentlist[this.commentlist.length-1].replies;
			// this.last_id=this.commentlist[this.commentlist.length-1].id;
			this.lastcomment=this.commentlist[this.commentlist.length-1];
			
			this.acceptedcommentlist = this.commentlist.filter((x)=> x.approve_status == "1");
			
			//this.acceptedcommentlist = this.acceptedcommentlist.concat(this.commentlist.filter((x)=> x.user_id == this.userService.getLoggedInUser().id));

			for(var i=0;i<this.acceptedcommentlist.length;i++)
			{
				if(this.acceptedcommentlist[i].replies.length!=0)
				{
					this.acceptedcommentlist[i].replies = this.acceptedcommentlist[i].replies.filter((x)=> x.approve_status == "1" && x.userid != this.userService.getLoggedInUser().id);
				}
			}

			this.acceptedlastcomment = this.acceptedcommentlist[this.acceptedcommentlist.length-1];
			

			//this.acceptedlastcomment['fil']
			//this.commentlist=res['result'];
		    }
		 }
			
	}, (err) => {
			  console.log(err);
	  });

	}
	paperClip()
	{
		//window("./shabad/"+this.pageId+"/"+this.currentShabadPage);
		this._router.navigate(['/shabad',this.pageId,this.currentShabadPage]);
	}
	
	getShabadPages() {
		let url = '/shabad-pages/' + this.pageId;

		this._http.get(url)
		.subscribe((res) => {
			let pages = res.data;

			//navigate to page with shabad page
			this._router.navigate(['/shabad', this.pageId, pages[0]]);
		}, (error) =>{
			console.log(error);
		});
	}

	is_translation_shown=false;
	istranslationshown=false;
	showcommenatary=false;
	showtranslation()
	{
	  this.istranslationshown=!this.istranslationshown;
		$("#checkbox").prop('checked', this.istranslationshown);
	  
	  //if(this.istranslationshown)
	}

	setpage()
	{
	    while(true){
			var d=this.shabadPages.slice(this.startindex,this.endindex);
			// if(this.shabadId>=this.startindex && this.shabadId<=this.startindex+4)
			// {
            //         break;
			// }
			// else{
			//   this.startindex=this.startindex+4;
			//   this.endindex=this.endindex+4;
			// }
			if(d.length==0)
			{
				break;
			}
			else if(d.includes(parseInt(this.shabadId.toString())))
			{
				break;
			}
			else{
				if(window.innerWidth>=567){
				this.startindex=this.startindex+this.slice;
				this.endindex=this.endindex+this.slice;
				}
				else{
					this.startindex=this.startindex+this.slice;
				    this.endindex=this.endindex+this.slice;
				}
			}
		}
		//alert(this.startindex);

	}

	getShabad() {
		let url = '/shabad/' + this.pageId;
		if (this.shabadId) {
			url += '/' + this.shabadId;
		}
		this.is_translation_shown=false;

		this._http.get(url)
		.subscribe((response) => {
			this.shabadData = response.data;
			this.shabadPages = response.pages;
			if (!this.shabadId) {
				this.shabadId = this.shabadPages[0];
			}

			this.currentShabadPage = this.shabadData['id'];

			this.resetScriptures();
			this.translationsByAuthors = {};

			//scripture data
			this.shabadData['scriptures'].forEach((sd, scripureIndex) => {
				sd.Scripture = sd.Scripture.split(" ");

				if(sd.translation['KhojgurbaaniEnglish']!=null)
				{
                       this.is_translation_shown=true;
				}
				if (this.highlightedScripture.id && sd.id == this.highlightedScripture.id) {
					sd['is_highlight'] = true;
				}
			});

			//blogs
			this.blogs = this.shabadData['blog'];


			this.rs.get("media/shabad-data/"+this.shabadId).subscribe((response) => {
				this.podcasttoday=response['result'];
				this.punjabipodcast=null;
				this.englishpodcast=null;
				for(var i=0;i<this.podcasttoday.length;i++){
					if(this.podcasttoday[i]['language']=='p' && this.podcasttoday[i]['status']==1){
						this.punjabipodcast = this.podcasttoday[i];
					} else if(this.podcasttoday[i]['status']==1){
						this.englishpodcast=this.podcasttoday[i];
					}
				}
			},(err)=>{
				console.log(err);
				this.englishpodcast=null;
				this.punjabipodcast=null;
			});
			
	
	
		// 	this.rs.get("shabad-data/get-shabad-media/"+this.shabadId).subscribe((response) => {
		// 		this.saudio=response['Santhiya_data'];
		// 		var d3=this.saudio.filter((item) => item.type !== 'YOUTUBE');
		// 		this.saudio=[];
		// 		this.saudio=d3;
		// },(err)=>{
		// 	console.log(err);
		// });
			this.getcomment();
			this.getcommentary();
			this.htmlReply="";
			this.replyid='';
			this.showid='';
			$("#comm").show();
			$("#val").hide();
			$(".add").show();

			this._activeRoute.queryParams.subscribe(params => {
				if(params.scroll && params.scroll=='commentary') {
					this.scroll('commentaryArea');
				}
			});
		}, (error) =>{
			console.log(error);
		});



			
	}
	podcasttoday=[];
	punjabipodcast;
	englishpodcast;
	saudio=[];
	isplaying=false;
	play2()
	{
		if(this.isplaying==true)
		{ 
           //$("#player audio")[0].pause();
		   $("#pauseSong").click();
		}
		else{
			$("#player").show();
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.saudio[0].title+"</marquee>");
			$("#player audio")[0].src=this.saudio[0].attachment_name;
			
			$("#srcforsong").html(this.saudio[0].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();
		}

		this.isplaying=!this.isplaying;
	}
	play(i)
	{
		if(i==1)
		{
			$("#player").show();
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.punjabipodcast.title+"</marquee>");
			$("#player audio")[0].src=this.punjabipodcast.attachment_name;
			
			$("#srcforsong").html(this.punjabipodcast.attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();

			localStorage.setItem('playerTitle', this.punjabipodcast.title);
			localStorage.setItem('singerName', this.punjabipodcast.author_name);

			let data = [];
			this._event.fire('showSingerName', data);
			
		}
		else{
			$("#player").show();
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.englishpodcast.title+"</marquee>");
			$("#player audio")[0].src=this.englishpodcast.attachment_name;
			
			$("#srcforsong").html(this.englishpodcast.attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();

			localStorage.setItem('playerTitle', this.englishpodcast.title);
			localStorage.setItem('singerName', this.englishpodcast.author_name);

			let data = [];
			this._event.fire('showSingerName', data);
			
		}
	}

	getSanthya() {
		let url = URLS.media;
		if (Object.keys(this.user).length > 0) {
			url += "/protected";
		}
		let params = {
			shabad_id: this.shabadId,
			type: MEDIA_TYPE.audio,
			tag_ids: AUDIO_TAG_IDS.santhya
		}
		this._http.get(url, params)
		.subscribe((response) => {
			let santhyaData = [];
			if (response.data && response.data.length > 0) {
				santhyaData = response.data;
			}
			//this.setSanthyAudioList(santhyaData);
		}, (error) =>{
			console.log(error);
		});
	}

	
openModal(c)
{

	this.modalService.dismissAll();
	this.modalService.open(c,{centered:true});
	//$("#exampleModalCenter").modal('show');
}
	
typeexp_org=[];
    typeexp=[];
  teeka_org=[];
  english_org=[];
  english=[];
  comm=false;
  CheckValue2(ev,name,name2,id)
  {
	  if(id==1)
	  {
			if(ev.currentTarget.checked)
			{
					this.typeexp.push({type:name});
					this.typeexp_org.push(name2);
			}
			else{
				var i=this.typeexp.findIndex(x=> x.type==name);
				this.typeexp.splice(i,1);

				this.typeexp_org.splice(i,1);
			}
    }
    else if(id==2)
	  {
		if(ev.currentTarget.checked)
		{
				this.english.push({english:name});
				this.english_org.push(name2);
		}
		else{
			var i=this.english.findIndex(x=> x.english==name);
			this.english.splice(i,1);
			this.english_org.push(i,1);
		}
	  }
	  else{
		if(ev.currentTarget.checked)
		{
		  this.comm=true;
		}
		else{
  
		  this.comm=false;
		}
	  }
	  
	  
  }

  val="section";
  ChangeValue2(event)
  {
	  this.val=event.target.value;
  }
  submit()
  {
	  var obj={};
	  obj['type']=this.typeexp;
	  var res={"result":this.shabadData['scriptures']};
	  var data='';

			   if(this.val=="section"){
									for(var i=0;i<this.typeexp.length;i++)
									{
										data+="\n";
											data+=this.typeexp_org[i]+":\n";
											data+="\n";
											for(var j=0;j<res['result'].length;j++)
											{

												if(this.typeexp[i].type=="Scripture")
												{
													data+=res['result'][j]['Scripture'].toString()+"\n";
												}
												else if(this.typeexp[i].type=="ScriptureOriginal")
												{
													data+=res['result'][j]['ScriptureOriginal']+"\n";
												}
												else if(this.typeexp[i].type=="ScriptureRoman")
												{
													data+=res['result'][j]['ScriptureRoman']+"\n";
												}
												//else if(this.typeexp[i].)
											}
											for(var i=0;i<this.english.length;i++)
									{
										//if(i==0){
											data+="\n";
										//}
											data+="Author(English) -"+this.english_org[i]=="KhojgurbaaniEnglish"?"New Transaltion":this.english_org[i]+"\n";
											
											//if(i==0){
												data+="\n";
											//}
											for(var j=0;j<res['result'].length;j++)
											{
												if(this.english_org[i]=="Bhai Manmohan Singh")
												{
													data+=res['result'][j]['translation']['ManmohanSinghEnglish']+"\n";
												}
												else if(this.english_org[i]=="Dr. Sant Singh Khalsa")
												{
													data+=res['result'][j]['translation']['SantSinghKhalsaEnglish']+"\n";
												}
												else if(this.english_org[i]=="KhojgurbaaniEnglish")
												{
													if(res['result'][j]['translation']['KhojgurbaaniEnglish']!=null)
													{
														data+=res['result'][j]['translation']['KhojgurbaaniEnglish']+"\n";
													}
													//data+=+"\n";
												}
											}
									}

									if(this.comm)
									{
										data+="\n";
										
										data+="Commentary :";
											
										data+="\n";
										
										data+=$("#comm").text();
									}
									}
					}
					else{
						for(var j=0;j<res['result'].length;j++)
						{
							data+="\n";
							for(var i=0;i<this.typeexp.length;i++)
							{
								if(this.typeexp[i].type=="Scripture")
													{
														data+=res['result'][j]['Scripture']+"\n";
													}
								else if(this.typeexp[i].type=="ScriptureOriginal")
								{
									data+=res['result'][j]['ScriptureOriginal']+"\n";
								}
								else if(this.typeexp[i].type=="ScriptureRoman")
								{
									data+=res['result'][j]['ScriptureRoman']+"\n";
								}
							}
							for(var i=0;i<this.english.length;i++)
							{
								if(this.english_org[i]=="Bhai Manmohan Singh")
								{
									data+=res['result'][j]['translation']['ManmohanSinghEnglish']+"\n";
								}
								else if(this.english_org[i]=="Dr. Sant Singh Khalsa")
								{
									data+=res['result'][j]['translation']['SantSinghKhalsaEnglish']+"\n";
								}

								else if(this.english_org[i]=="KhojgurbaaniEnglish")
								{
									if(res['result'][j]['translation']['KhojgurbaaniEnglish']!=null)
													{
														data+=res['result'][j]['translation']['KhojgurbaaniEnglish']+"\n";
													}
									//data+=res['result'][j]['translation']['KhojgurbaaniEnglish']+"\n";
								}
							}
						}

						if(this.comm)
						{
							data+="\n";
							
							data+="Commentary :";
								
							data+="\n";
							
							data+=$("#comm").text();
						}
					}

					var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "export_section.txt");
	  //obj['teeka']=this.teeka;
	  //obj['english']=this.english;
	//   var to=+this.pageId + +3;
	//   this.rs.postJson("shabad-data/export-shabads?from="+(this.pageId*this.pageId)+"&to="+to+"&format_type="+this.val+"&format_file=txt",obj.toString()).subscribe((res)=>{
	// 		   var data='';

	// 		   if(this.val=="section"){
	// 								for(var i=0;i<this.typeexp.length;i++)
	// 								{

	// 									data+="\n";
	// 										data+=this.typeexp_org[i]+":\n";
	// 										data+="\n";
	// 										for(var j=0;j<res['result'].length;j++)
	// 										{

	// 											if(this.typeexp[i].type=="Scripture")
	// 											{
	// 												data+=res['result'][j]['Scripture']+"\n";
	// 											}
	// 											else if(this.typeexp[i].type=="ScriptureOriginal")
	// 											{
	// 												data+=res['result'][j]['ScriptureOriginal']+"\n";
	// 											}
	// 											else if(this.typeexp[i].type=="ScriptureRoman")
	// 											{
	// 												data+=res['result'][j]['ScriptureRoman']+"\n";
	// 											}
	// 										}
	// 								}
	// 								// for(var i=0;i<this.english.length;i++)
	// 								// {
	// 								// 	//if(i==0){
	// 								// 		data+="\n";
	// 								// 	//}
	// 								// 		data+="Author(English) -"+this.english_org[i]+"\n";
											
	// 								// 		//if(i==0){
	// 								// 			data+="\n";
	// 								// 		//}
	// 								// 		for(var j=0;j<res['result'].length;j++)
	// 								// 		{
	// 								// 			if(this.english_org[i]=="Bhai Manmohan Singh")
	// 								// 			{
	// 								// 				data+=res['result'][j]['translation']['ManmohanSinghEnglish']+"\n";
	// 								// 			}
	// 								// 			else if(this.english_org[i]=="Dr. Sant Singh Khalsa")
	// 								// 			{
	// 								// 				data+=res['result'][j]['translation']['SantSinghKhalsaEnglish']+"\n";
	// 								// 			}
	// 								// 		}
	// 								// }
	// 								// for(var i=0;i<this.teeka.length;i++)
	// 								// {

	// 								// 	    data+="\n";
	// 								// 		data+="Author(Teeka) -"+this.teeka_org[i]+"\n";
											
	// 								// 		data+="\n";

	// 								// 		for(var j=0;j<res['result'].length;j++)
	// 								// 		{
	// 								// 			  data+=res['result'][j]['translation'][this.teeka[i].teeka]+"\n";
												
	// 								// 		}
	// 								// }
	// 			}
	// 			else{
	// 				for(var j=0;j<res['result'].length;j++)
	// 				{
	// 					data+="\n";
	// 					for(var i=0;i<this.typeexp.length;i++)
	// 					{
	// 						if(this.typeexp[i].type=="Scripture")
	// 											{
	// 												data+=res['result'][j]['Scripture']+"\n";
	// 											}
	// 						else if(this.typeexp[i].type=="ScriptureOriginal")
	// 						{
	// 							data+=res['result'][j]['ScriptureOriginal']+"\n";
	// 						}
	// 						else if(this.typeexp[i].type=="ScriptureRoman")
	// 						{
	// 							data+=res['result'][j]['ScriptureRoman']+"\n";
	// 						}
	// 					}
	// 					// for(var i=0;i<this.english.length;i++)
	// 					// {
	// 					// 	if(this.english_org[i]=="Bhai Manmohan Singh")
	// 					// 	{
	// 					// 		data+=res['result'][j]['translation']['ManmohanSinghEnglish']+"\n";
	// 					// 	}
	// 					// 	else if(this.english_org[i]=="Dr. Sant Singh Khalsa")
	// 					// 	{
	// 					// 		data+=res['result'][j]['translation']['SantSinghKhalsaEnglish']+"\n";
	// 					// 	}
	// 					// }
	// 					// for(var i=0;i<this.teeka.length;i++)
	// 					// {
							
	// 					// 	data+=res['result'][j]['translation'][this.teeka[i].teeka]+"\n";
											
							
	// 					// }
									
	// 				}
					           
	// 			}
	// 		   var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    //           // FileSaver.saveAs(blob, "export_section.txt");
	//   },(err)=>{
	// 	console.log(err);
	//   })
  }
  
	resetScriptures() {
		this.shabadLanguages.forEach((sl) => {
			sl.scriptures = [];
		});
	}

	
	
	counter(i: number) {
	    return new Array(i);
	}

	goToPage(page) {
		if (this.isAudioPlaying) {
			this.playerService.stop();
		}

		this._router.navigate(['/commentary', page]);
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
		}, (error) =>{
			console.log(error);
			this.isGetWordDetailApiRunning = false;
		});
	}
	progressval=30;
	fileupload=false;
	msg;
	// handleFileInput(ev)
	// {
	// 	$("#lbl").text(ev[0].name);
	// }
	openModalFileSubmit(content,val)
	{
		this.getPodcastList();
		this.getSubCategoryList();
		this.getShabadList();
                // $("#exampleModalCenter3").modal({
				// 	keyboard: false,
				// 	backdrop: 'static'
				// })
				if(val==1)
				{
					this.msg="Upload punjabi podcast";
					this.selectedLg=2;
				}
				else{
					this.msg="Upload english podcast";
					this.selectedLg=1;
				}
				this.mytitle='';
				this.fileinvalid=false;
				this.fileinvalid2=false;
				this.nameinvalid=false;
				this.descinvalid=false;
				this.exturlinvalid=false;
				this.mydesc='';
				this.mytxturl='';
				this.err=false;
				this.selectedShabad=this.shabadId;
				this.modalService.open(content);
	}
	fileinvalid2=false;
	invalidmsg2='';
	handleFileInput(ev,type)
	{
    if(type==1){
              if(ev[0].type.toString().split("/")[0]=="audio"){
                this.file=ev[0];
                this.fileinvalid=false;
                var i=this.file.name.lastIndexOf(".");
                var val=this.file.name.toString().substring(0,i);
                this.mytitle=val;//this.file.name;

                this.invalidmsg="";
                $("#lbl").text(ev[0].name);

                var objectUrl = URL.createObjectURL(this.file);
                $("#audio").prop("src", objectUrl);
              }
              else{
              this.fileinvalid=true;
              this.mytitle="";
              this.file=null;

              this.invalidmsg="select valid file"
              $("#lbl").text("Select audio file");
              }
      }
      else{
        if(ev[0].type.toString().split("/")[0]=="image"){
          this.file2=ev[0];
          this.fileinvalid2=false;
          
          this.invalidmsg2="";
          $("#lbl2").text(ev[0].name);

          var objectUrl = URL.createObjectURL(this.file);
          $("#audio").prop("src", objectUrl);
        }
        else{
        this.fileinvalid2=true;
        this.file2=null;
        this.invalidmsg2="select valid file"
        $("#lbl2").text("Select image file");
        }
      }
  }

	type=[{id:0,name:"S3"},{id:1,name:"Audio"},{id:4,name:"External Url"}]
  selectedType=0;

  cancel()
  {
	  $("#val").hide();
	  $("#comm").show();
	  $(".add").show();
  }
  
  success=false;
  err=false;
  successmsg;
  file:File=null;

  fileinvalid=false;
  invalidmsg='';
  mytitle;
  nameinvalid=false;
  mydesc;
  file2:File=null;
  descinvalid=false;
  mytxturl;
  exturlinvalid=false;
  uploaddata='';
  resData;
  upload(loader)
  {

    let formData = new FormData();
    var loadingstart=false;
    if(this.selectedType==1 || this.selectedType==0)
    {
        
        if(this.file==null )
        {
          this.fileinvalid=true;
          this.invalidmsg="Please select mp3 file";
          return;
        }
        else if(this.mytitle.toString().trim().length==0)
        {
          this.nameinvalid=true;
          return;
        }
        // else if(this.mydesc.toString().trim().length==0)
        // {
        //   this.descinvalid=true;
        //   return;
        // }
        formData.set("thumbnail",this.file2);
        formData.set("attachment_name",this.file);
        formData.set("description",this.mydesc);
        formData.append("title",this.mytitle);
        formData.append("type","AUDIO");
        
    }
    else{
      if(this.mytxturl.toString().trim().length==0)
      {
        this.exturlinvalid=true;
        return;
      }
      else if(this.mytitle.toString().trim().length==0)
        {
          this.nameinvalid=true;
          return;
        }
        // else if(this.mydesc.toString().trim().length==0)
        // {
        //   this.descinvalid=true;
        //   return;
        // }
        if(this.file2!=null){
            formData.set("thumbnail",this.file2);
        }
        else{
            formData.set("thumbnail",'');
        }
      formData.set("description",this.mydesc);
      formData.append("title",this.mytitle);
      formData.append("type","EXTERNAL");
	  formData.append("external_url",this.mytxturl);
	  loadingstart=true;
 
    }
    
    if(this.selectedLg==1)
    {
      formData.append("language",'e');
    }
    else{
      formData.append("language",'p');
    }
    var catid=[];
    for(var i=0;i<this.selectedCategory.length;i++)
    {
        catid[i]={"cat_id":this.selectedCategory[i]};
    }
    formData.append("category",JSON.stringify(catid));
    
    var subid=[];
    for(var i2=0;i2<this.selectedSubCategory.length;i2++)
    {
        subid[i2]={"sub_cat_id":this.selectedSubCategory[i2]};
    }
    formData.append("sub_category",JSON.stringify(subid));
    formData.append("shabad_id",this.selectedShabad);
                  
    // else if(this.selectedCategory==null)
    // {
    //       this.selectinvalid=true;
    //       this.nameinvalid=false;
    //       return;
    // }
   var ref= this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
		
      var url="media/podcast-add";
  

	  if(loadingstart){

		$("#audio").prop("src", this.mytxturl);
		this.waitingfordata=true;
				var x=setInterval(()=>{
				  if(this.errdata)
				  {
					clearInterval(x);
					this.errdata=false;
					this.waitingfordata=false;
					Swal.fire('','Error getting time info from url','error');
					this.modalService.dismissAll();
				  }
				  else if(!this.waitingfordata)
				  {
	  
					clearInterval(x);
					this.errdata=false;
					this.waitingfordata=false;
		
								this.uploaddata='0%';
									this.rs
									.postMultipart(url,
									formData
									).subscribe((event) => {
									if (event.type === HttpEventType.UploadProgress) {
										this.uploaddata = Math.round(100 * event.loaded / event.total).toString() +"%";
									}
									else if (event.type === HttpEventType.Response){
													this.resData = event.body;
									
									this.successmsg=this.resData["message"];
									if(this.resData["message"]!=null && this.resData["success"]=="200")
									{
										this.success=true;
										this.err=false;
										this.updatedatatable();
									}
									else{

										this.success=false;
										this.err=true;
										ref.close();
									}
									}
									},(err)=>{
										this.err=true;
										this.success=false;
										this.successmsg="something went wrong";
							//this.modalService.dismissAll();
							ref.close();
											//this.updatedatatable();
									});
						  }
						});
		}
	else{

		this.uploaddata='0%';
        this.rs
        .postMultipart(url,
          formData
        ).subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploaddata = Math.round(100 * event.loaded / event.total).toString() +"%";
          }
          else if (event.type === HttpEventType.Response){
                        this.resData = event.body;
         
          this.successmsg=this.resData["message"];
          if(this.resData["message"]!=null && this.resData["success"]=="200")
          {
              this.success=true;
			  this.err=false;
			  this.updatedatatable();
          }
          else{

            this.success=false;
			this.err=true;
			ref.close();
			//this.updatedatatable();
		  }
		  
        }
        },(err)=>{
               this.err=true;
               this.success=false;
			   this.successmsg="something went wrong";
			   ref.close();
//this.modalService.dismissAll();
                //this.updatedatatable();
		});
	}
  }
  updatedatatable()
  {
	  this.modalService.dismissAll();
	  this.getShabad();
  }


	onSelectLareevaarScriptureOption() {
		this.isLareevaarShow = !this.isLareevaarShow;
		this.setShabadPageDataInLs();
		this.setheight(this.isLareevaarShow);
	}

	onSelectRomanScriptureOption() {
		this.isRomanShow = !this.isRomanShow;
		this.setShabadPageDataInLs();
		this.setheight(this.isRomanShow);
	}

	setShabadPageDataInLs() {
		let data = {
			is_lareevaar_scripture_show : this.isLareevaarShow,
			is_roman_scripture_show : this.isRomanShow
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

	name_avatar(name) {
		if(name==null){
			return 'GU';
		}
		name = name.match(/\b(\w)/g).join('');
		if(name.length>2){
			name = name.substring(0,1)+name.substr(name.length-1);
		}
		return name;
	}

}
