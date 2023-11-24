import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

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
import { EventService } from 'src/app/services/event.service';

import { v4 as uuid } from 'uuid';
import { machineId, machineIdSync } from 'node-machine-id';

declare var $;
@Component({
	selector: 'app-resource',
	templateUrl: './resource.component.html',
	styleUrls: ['./resource.component.scss'],
	providers: [DatePipe]
})
export class ResourceComponent implements OnInit {
	numPages: number = 0;
	searchResult: any = [];
	searchResultPaginated: any = [];
	currentPage = 1;
	per_page = 25;
	RP_options : any = {
		margin:10,
		dots: false,
		nav: true,
		loop: false,
		items: 3,
		responsive: {
		  0: {
			items: 1,
		  },
		  768: {
			items: 2,
		  },
		  991: {
			items: 3,
		  },
		  1200: {
			items: 3,
		  }
		}
	  }

	  FT_options : any = {
		margin:10,
		dots: false,
		nav: true,
		loop: false,
		items: 3,
		responsive: {
		  0: {
			items: 1,
		  },
		  768: {
			items: 2,
		  },
		  991: {
			items: 3,
		  },
		  1200: {
			items: 3,
		  }
		}
	  }



	  FT_options2 : any = {
		margin:10,
		dots: false,
		nav: true,
		loop: false,
		items: 3,
		responsive: {
		  0: {
			items: 1,
		  },
		  768: {
			items: 2,
		  },
		  991: {
			items: 4,
		  },
		  1200: {
			items: 6
		  }
		}
	  }




	Options : any = {
		margin:13,
		dots: false,
		nav: false,
		loop: false,
		items: 7,
		responsive: {
		  0: {
			items: 2,
		  },
		  600: {
			items: 3,
		  },
		  991: {
			items: 7,
		  }
		}
	  }
	  Options2 : any = {
		margin:13,
		dots: false,
		nav: false,
		loop: false,
		items: 7,
		responsive: {
		  0: {
			items: 2,
		  },
		  600: {
			items: 3,
		  },
		  991: {
			items: 7,
		  }
		}
	  }
	  @ViewChild('owlElement',{static:false}) owlElement: OwlCarousel
	
	  next()
	  {
           this.owlElement.next();
	  }
	  prev()
	  {

		this.owlElement.previous();
	  }

	  categoryClick(x)
	  {
		if(this.featuredCategoriesList[x].sub_category_count!=0)
		{
            this.router.navigate([ '/artistlist',this.featuredCategoriesList[x].name,this.featuredCategoriesList[x].id]);
		}
		else{
			this.router.navigate([ '/gurbanilist',this.featuredCategoriesList[x].name,this.featuredCategoriesList[x].id,"2"]);
		}
	  } 

	  back()
	  {
		  this.searchval=false;
	  }

	  categoryClicksearch(x)
	  {
		if(this.search.cat_result[x].sub_category_count!=0)
		{
            this.router.navigate([ '/artistlist',this.search.cat_result[x].name,this.search.cat_result[x].id]);
		}
		else{
			this.router.navigate([ '/gurbanilist',this.search.cat_result[x].name,this.search.cat_result[x].id]);
		}
	  }

	featuredTracks: Array<any> = [];
	featuredArtists: Array<any> = [];
	featuredCategories: Array<any> = [];
	featuredCategoriesList = [];
    featuredMedia=[];
    featuredMediaLinks=[];
	res=[1,2,3];
	//searchtext;
	search;
	searchval=false;

	mydate=new Date();
	mydt;
	recentlyplayed=[];
	recentlyplayedLinks = [];

	deviceUUID: any;

	
	featuredArtistsClicked(x){
		this.router.navigate(['artistgurbanilist',this.featuredArtists[x].id,this.featuredArtists[x].name]);
	}

	restratRecentleyPlayed(x){
		if(this.recentlyplayedLinks[x].type=="YOUTUBE"){
			this.router.navigate(['/videoplayer']);
		}
		else{
			$("#player").show();
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.recentlyplayedLinks[x].title+"</marquee>");
			$("#player audio")[0].src=this.recentlyplayedLinks[x].attachment_name;//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

			$("#srcforsong").html(this.recentlyplayedLinks[x].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();
			
			// Add Player List singer name and title
			localStorage.setItem('playerTitle', this.recentlyplayedLinks[x].title);
			localStorage.setItem('singerName', this.recentlyplayedLinks[x].author_name);
			let data = [];
			this._event.fire('showSingerName', data);
			// Add Player List singer name and title

			var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.recentlyplayedLinks[x].id;
			var param=new URLSearchParams();
			param.set("machine_id",machine_id);
			param.set("media_id",mediaid);
			param.set("view_date",this.mydt);
			if(this.userService.isUserLogin())
			{
				param.set("user_id",this.userService.getLoggedInUser().id);
			}	
			else{
				param.set("user_id",'');
			}
			if(this.recentlyplayedLinks[x].tag_id == 2){
				this.rs.post("media/play",param).subscribe((res)=>{
					this.getmediarecentley();
					var carousel = $('.owl-carousel').data('owl.carousel');
					carousel.to(carousel.relative(0));
				},(error)=>{
					console.log(error);
				});
			}
		}
	}

	getmediarecentley()
	{
		var user_id="";
		if(this.userService.isUserLogin())
		{
			user_id=this.userService.getLoggedInUser().id; 
		}
		this.rs.get("media/recently-played?machine_id="+ this._event.getMachinId() +"&user_id="+user_id)
		.subscribe((res) => {
			let tmp = res['recently_played'];
			tmp.reverse();
			this.recentlyplayedLinks = [];
			this.recentlyplayedLinks = JSON.parse(JSON.stringify(tmp));
			tmp.forEach(elem => {
				delete elem.attachment_name;
			});
			this.recentlyplayed= tmp;//.slice(0, 10);
		}, (error) =>{
			console.log(error);
		});

	}

	validateAction(action) {
		try{
		let flag = this._user.isUserValidateForThisAction(action);
	
		return flag;
		}
		catch(e)
		{
			return false;
		}
	}
	pageChanged(event) {
		
		this.searchedResult.pagination.page=event.page-1;
		this.searchData(true);
	}
	startFrom = 0;
	pageChange(event){
		this.currentPage = event.page;
		this.startFrom = event.page - 1;
		let arr = [];
		for(let i = 0; i < this.per_page; i++){
			if(this.startFrom * this.per_page + (i+1) > this.searchResult.length){
				break;
			}
			else {
				arr.push(this.searchResult[this.startFrom * this.per_page + i]);
			}
		}
		this.searchResultPaginated = arr;
	}
	prevPage(){
		if(this.currentPage > 1){
			this.currentPage = this.currentPage - 1;
		}
	}
	nextPage(){
		if(this.currentPage < (this.searchResult.length / this.per_page)){
			this.currentPage = this.currentPage + 1;
		}
	}
	setlast(offset){
		this.currentPage = Math.round((this.searchResult.length / this.per_page) + offset + 0.5);
	}

	machinUUIDNew: any;

	constructor(private _event: EventService,private _user: UserService,private rs:ResourcesService,private _http: HttpService,private router:Router,private datePipe: DatePipe,private userService:UserService,
		private _helper: HelperService,private ref:ChangeDetectorRef,private loadingBar:LoadingBarService, private httpservice: HttpService) { 

	}

	onSearchChange(event){
		console.log(event);
		
	}

	index=-1;
	previndex=-1;
	title;
	titlesearch;
	restratsearch(x,i,i2){
	  if(this.index==x)
	  {
		  $("#player").show();
		  this.index=-1;
		  
			$("#pauseSong").click();
		  //$("#player audio")[0].pause();
	  }
	  else if(x==this.previndex)
	  {
		$("#player").show();
		
		$("#playSong").click();
		//$("#player audio")[0].play();
	  }
	  else{
		this.index=x;
		this.previndex=x;
		$("#player").show();
		$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.searchdata[i].ScriptureRomanEnglish+"</marquee>");
		$("#player audio")[0].src=this.searchdata[i]['data_m'][i2].att_n;//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
		
		$("#srcforsong").html(this.searchdata[i]['data_m'][i2].att_n);
		$("#setsrc").click();
		$("#playSong").click();
		//$("#player audio")[0].play();
		var machine_id = this._event.getMachinId(); 
		this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
		var mediaid=this.searchdata[i]['data_m'][i2].id;
		var param=new URLSearchParams();
		param.set("machine_id",machine_id);
		param.set("media_id",mediaid);
		param.set("view_date",this.mydt);
			if(this.userService.isUserLogin())
			{
				param.set("user_id",this.userService.getLoggedInUser().id);
			}
			else{
				param.set("user_id",'');
			}
			
			this.rs.post("media/play",param).subscribe((res)=>{
			},(error)=>{
				console.log(error);
			});
	  }
	}

	restratsearchLAST(x,i,i2, item){
		localStorage.setItem('playerTitle', item.ScriptureRomanEnglish);
		localStorage.setItem('singerName', item.name);
		let data = [];
		this._event.fire('showSingerName', data);
		if(this.index==x)
		{
			$("#player").show();
			this.index=-1;
			//$("#player audio")[0].pause();
			$("#pauseSong").click();
		}
		else if(x==this.previndex)
		{
		  $("#player").show();
		  
			$("#playSong").click();
		  //$("#player audio")[0].play();
		}
		else{
		  this.index=x;
		  this.previndex=x;
		  $("#player").show();
		  $("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+item.ScriptureRomanEnglish+"</marquee>");
		  $("#player audio")[0].src=item.attachment_name;//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
		  
			$("#srcforsong").html(item.attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
		  //$("#player audio")[0].play();
		  var machine_id = this._event.getMachinId(); 
		  this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
		  var mediaid=item.media_id;
		  var param=new URLSearchParams();
		  param.set("machine_id",machine_id);
		  param.set("media_id",mediaid);
		  param.set("view_date",this.mydt);
			  if(this.userService.isUserLogin())
			  {
				  param.set("user_id",this.userService.getLoggedInUser().id);
			  }
			  else{
				  param.set("user_id",'');
			  }
			 
			  this.rs.post("media/play",param).subscribe((res)=>{
			  },(error)=>{
				  console.log(error);
			  });
		}
	}
	  
	setindex(){
	  this.index=-1;
	  this.ref.detectChanges();
	}
	
	set2(){   this.index=this.previndex; }

	setSelected(id){			
		$(".active1").removeClass("active1");
		 $("#"+id).addClass("active1");
	}
    
	play(item){
		$("#player").hide();
	//$("#player audio")[0].pause();
		$("#pauseSong").click();
		$('#radioPlayer').show();
		let x = $('#radioPlayer');

		$('#setPlayingProp').click();
		$("#radioTitle").html(item.title);

		$('#vid').trigger('pause');

		setTimeout(function(){
			$("#srcvid").prop("src", item.src);
			let x = $("#vid");
			$(x).remove();
			$('#radioPlayer').append(x);
			$('#vid')[0].load()
			$('#vid').trigger('play');
		}, 30);
	}

	radioList = [/*{
		title: 'Sri Harimandir Sahib',
		img: 'assets/full.jpg',
		src: 'http://live.sgpc.net:8090/;?1585525382957'
	},{
		title: 'Takhat Sri Keshgarh Sahib',
		img: 'assets/full.jpg',
		src: 'http://sgpc.net:8000/;nocache=889869'
	},{
		title: 'Gurdwara Dukh Niwaran Sahib',
		img: 'assets/full.jpg',
		src: 'http://akalmultimedia.net:8000/GDNSLDH?hash=1585525755597.mp3'
	},{
		title: 'Dasmesh Darbar',
		img: 'assets/full.jpg',
		src: 'http://s5.voscast.com:7316/;'
	},{
		title: 'Fremont',
		img: 'assets/full.jpg',
		src: 'http://s3.voscast.com:7408/;stream1585527824379/1'
	},{
		title: 'Takhat Sachkhand Sri Hazur Sahib',
		img: 'assets/full.jpg',
		src: 'http://radio2.sikhnet.com:8038/live'
	},{
		title: 'Gurdwara Bangla Sahib',
		img: 'assets/full.jpg',
		src: 'http://radio2.sikhnet.com:8050/live'
	}*/];

	ngOnInit() {
		let timestamp = Math.floor((new Date()).getTime() / 1000);
		let old_timestamp = localStorage.getItem('timestamp');
		let flag = true;
		if(old_timestamp) {
			let diff = timestamp - parseInt(old_timestamp);
			if(diff>(86400 * 7)) {
				localStorage.setItem('timestamp', timestamp.toString());
			}
			else {
				flag = false;
			}
		}
		else {
			localStorage.setItem('timestamp', timestamp.toString());
		}
		if(flag===true){
			$('#modal').modal('show');
		}
		//let id = machineIdSync();

		document.getElementById("main2").scrollTo(0,0);
		var self = this;
		$("body").on('keydown', function(e){
			var keycode = (e.keyCode ? e.keyCode : e.which);
			if(keycode == '13'){
				self.f('all');

			}
		})
		
		this.setSelected("resources");
		
		this.rs.get("radio").subscribe((res) => {	
			this.radioList=res['data'];
		}, (error) =>{
			console.log(error);
		});
				//this.getFeaturedTracks();
		//this.getFeaturedArtist();
		//this.getFeaturedCategories();
		this.rs.get("categories/featured").subscribe((res) => {
			this.featuredCategoriesList=res['featured_categories'];
			
		}, (error) =>{
			console.log(error);
		});

		this.rs.get("media/featured?type=AUDIO").subscribe((res) => {
			
			let tmp = res['featured_media'];
			this.featuredMediaLinks = JSON.parse(JSON.stringify(tmp));
			tmp.forEach(elem => {
				delete elem.attachment_name;
			});

			this.featuredMedia= tmp;
			
		}, (error) =>{
			console.log(error);
		});

		this.rs.get("media-authors/featured").subscribe((res) => {
			
		
			this.featuredArtists=res['result'];
			//for(var i=0;i<this.featuredArtists.length;i++)

		}, (error) =>{
			console.log(error);
		});

		// this.rs.get("featured-api/listing").subscribe((res) => {
			

		// 	  var media_result=res.result.media_result;
			  
		// 	  var cat_result=res.result.cat_result;
			  
		// 	  var author_result=res.result.author_result;
			  
		// 	//   for(var i=0;i<media_result.length;i++)
		// 	//   {
		// 	// 	  if(media_result[i].featured!=0)
		// 	// 	  {
        //     //         this.mediaObjects.push({id:media_result[i].id,value:media_result[i].title,display:media_result[i].title,sort:media_result[i].featured_display_order});   
		// 	// 	  }
				  
        //     //   }
		// 	  for(var i=0;i<cat_result.length;i++)
		// 	  {
		// 		  if(cat_result[i].featured!=0)
		// 		  {
        //             this.featuredCategoriesList.push({id:cat_result[i].id,name:cat_result[i].title,display:cat_result[i].title,sort:cat_result[i].featured_display_order,attachment_name:cat_result[i].attachment_name});   
		// 		  }
				 
		// 	  }
		// 	  for(var i=0;i<author_result.length;i++)
		// 	  {
		// 		  if(author_result[i].featured!=0)
		// 		  {
        //             this.featuredArtists.push({id:author_result[i].id,name:author_result[i].title,display:author_result[i].title,sort:author_result[i].featured_display_order,attachment_name:author_result[i].attachment_name});   
		// 		  }
				 
        //       }
              
              
        //       this.featuredCategoriesList.sort(function (a, b) {
        //         return a.sort - b.sort;
        //       });
        //       this.featuredArtists.sort(function (a, b) {
        //         return a.sort - b.sort;
		// 	  });
			  
		// }, (error) =>{
		// 	console.log(error);
		// });

		//var param=new URLSearchParams();
		var user_id="";
		if(this.userService.isUserLogin())
		{
			user_id=this.userService.getLoggedInUser().id;
			//param.set("user_id",this.userService.getLoggedInUser().id);
		}
		// else{
		// 	param.set("user_id","");
		// }
		// param.set("machine_id",this._event.getMachinId());

		this.rs.get("media/recently-played?machine_id="+this._event.getMachinId()+"&user_id="+user_id)
		.subscribe((res) => {
			
			let tmp = res['recently_played'];
			tmp.reverse();
			
			this.recentlyplayedLinks = JSON.parse(JSON.stringify(tmp));
			tmp.forEach(elem => {
				delete elem.attachment_name;
			});
			this.recentlyplayed= tmp;//.slice(0, 10);
		}, (error) =>{
			console.log(error);
		});

		let getTranslationAuthors = sessionStorage.getItem('translationAuthors');
		let getTblAuthors = sessionStorage.getItem('tblAuthors');
		let getTblMelodies = sessionStorage.getItem('tblMelodies');
		let loadSingers = sessionStorage.getItem('singers');
		if(getTranslationAuthors) {
			this.translationAuthors = JSON.parse(getTranslationAuthors);
			this.setTranslationAuthors();
		}
		else {
			this.getTranslationAuthors();
		}
		if(getTblAuthors) {
			this.tblAuthors = JSON.parse(getTblAuthors);
		}
		else {
			this.getTblAuthors();
		}
		if(getTblMelodies) {
			this.tblMelodies = JSON.parse(getTblMelodies);
		}
		else {
			this.getTblMelodies();
		}
		if(loadSingers) {
			this.singers = JSON.parse(loadSingers);
		}
		else {
			this.loadSingers();
		}
		
	}

	playerPauseEvent() {
		this.setindex();
	};

	playerPlayEvent() {
		this.set2();
	};

	videoId;

	restrat(val,url){

		// localStorage.setItem("type",val);
		// if(val==1){
		//   url='https://www.youtube.com/watch?v=07d2dXHYb94';
		//   localStorage.setItem("url",url);
        //   this.router.navigate(['/videoplayer']);
		// }
		// else if(val==2)
		// {
		// 	url='59777392';
		//     localStorage.setItem("url",url);
		// 	this.router.navigate(['/videoplayer']);
		// }
		// else if(val==3)
		// {
		// 	url='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
		//     localStorage.setItem("url",url);
		// 	this.router.navigate(['/videoplayer']);
		// }
		// else{

		$("#player").show();
		//$("#matradioplayer").hide();
		//$("#matradioplayer audio")[0].pause();
		$("#player audio")[0].src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
		
		$("#srcforsong").html("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
		$("#setsrc").click();
		$("#playSong").click();
		//$("#player audio")[0].play();
		//}
	}


	restrat2(x){

		if(this.featuredMediaLinks[x].type=="YOUTUBE"){
			localStorage.setItem("url",this.featuredMediaLinks[x].attachment_name);
			var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.featuredMediaLinks[x].id;
			var param=new URLSearchParams();
			param.set("machine_id",machine_id);
			param.set("media_id",mediaid);
			param.set("view_date",this.mydt);
			if(this.userService.isUserLogin())
			{
				param.set("user_id",this.userService.getLoggedInUser().id);
			}
			else{
				param.set("user_id",'');
			}
			
			this.rs.post("media/play",param).subscribe((res)=>{
				this.router.navigate(['/videoplayer']);
			
			},(error)=>{
				console.log(error);
				this.router.navigate(['/videoplayer']);
			
			});
		}
		else
		{
			$("#player").show();
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.featuredMediaLinks[x].title+"</marquee>");
			$("#player audio")[0].src=this.featuredMediaLinks[x].attachment_name;
			$("#srcforsong").html(this.featuredMediaLinks[x].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();
			
		
			// Add Player List singer name and title
			localStorage.setItem('playerTitle', this.featuredMediaLinks[x].title);
			localStorage.setItem('singerName', this.featuredMediaLinks[x].author_name);
			let data = [];
			this._event.fire('showSingerName', data);
			// Add Player List singer name and title
			
			var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.featuredMediaLinks[x].id;
			var param=new URLSearchParams();
			param.set("machine_id",machine_id);
			param.set("media_id",mediaid);
			param.set("view_date",this.mydt);
			if(this.userService.isUserLogin()){
				param.set("user_id",this.userService.getLoggedInUser().id);
			} else {
				param.set("user_id",'');
			}
			
			this.rs.post("media/play",param).subscribe((res)=>{
			},(error)=>{
				console.log(error);
			});
		}
	}

	restrat2search(x) {

		$("#player").show();
		//$("#matradioplayer").hide();
		//$("#matradioplayer audio")[0].pause();

		//$(".text").text(this.featuredMedia[x].name);
		$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.featuredMedia[x].title+"</marquee>");
		$("#player audio")[0].src=this.search.media_result[x].attachment_name;
		$("#srcforsong").html(this.search.media_result[x].attachment_name);
		$("#setsrc").click();
		$("#playSong").click();
		//$("#player audio")[0].play();

            var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.search.media_result[x].id;
			var param=new URLSearchParams();
			param.set("machine_id",machine_id);
			param.set("media_id",mediaid);
			param.set("view_date",this.mydt);
			if(this.userService.isUserLogin()){
				param.set("user_id",this.userService.getLoggedInUser().id);
			} else {
				param.set("user_id",'');
			}
	
			this.rs.post("media/play",param).subscribe((res)=>{
			},(error)=>{
				console.log(error);
			})
	}

	// change(val)
	// {
	// 	$("#resources").addClass("active");
	// }

	// getFeaturedTracks() {
	// 	let url = URLS.media + "/featured";
	// 	let params = {
	// 		type: MEDIA_TYPE.audio,
	// 		/*includes: 'created_by_user',
	// 		sort: 'id',
	// 		direction: 'desc'*/
	// 	}

	// 	this._http.get(url, params)
	// 	.subscribe((res) => {
	// 		let result = res.data;

	// 		if (result.length == 0) {
	// 			return;
	// 		}

	// 		this.featuredTracks = result;

	// 	}, (error) =>{
	// 		console.log(error);
	// 	});
	// }

	getFeaturedArtist() {
		let url = URLS.get_featured_authors; ///media-authors/featured

		this._http.get(url, {})
		.subscribe((res) => {
			let result = res.data;

			if (result.length == 0) {
				return;
			}

			this.featuredArtists = result;

		}, (error) =>{
			console.log(error);
		});
	}

	// getFeaturedCategories() {
	// 	let url = URLS.categories + "/featured";

	// 	this._http.get(url, {})
	// 	.subscribe((res) => {
	// 		let result = res.data;

	// 		if (result.length == 0) {
	// 			return;
	// 		}

	// 		this.featuredCategories = result;

	// 	}, (error) =>{
	// 		console.log(error);
	// 	});
	// }

	isLoadingMore: Boolean = false;
	searchKeword: string = "";
	selectedSearchOption: any = 3;
	searchOtions: Array<any> = ADVANCE_SEARCH_OPTIONS;

	// advanceSearchOptions = {
	// 	selectedLanguage: 'gurmukhi',
	// 	languages: [
	// 		{
	// 			code: 'gurmukhi',
	// 			name: 'Gurmukhi',
	// 			content: ['gurbani', 'teeka', 'audio']
	// 		},
	// 		{
	// 			code: 'roman',
	// 			name: 'Roman',
	// 			content: ['gurbani']
	// 		},
	// 		{
	// 			code: 'english',
	// 			name: 'English',
	// 			content: ['gurbani', 'english-translation', 'audio']
	// 		}
	// 	],
	// 	selectedContent: 'gurbani',
	// 	contents: [
	// 		{
	// 			code : 'gurbani',
	// 			name: 'Gurbani',
	// 			is_show: true
	// 		},
	// 		{
	// 			code : 'teeka',
	// 			name: 'Teeka',
	// 			is_show: true
	// 		},
	// 		{
	// 			code : 'english-translation',
	// 			name: 'English Translation',
	// 			is_show: false
	// 		},
	// 		{
	// 			code : 'commentary',
	// 			name: 'Commentary',
	// 			is_show: false
	// 		},
	// 		{
	// 			code : 'working-translation',
	// 			name: 'Working Translation',
	// 			is_show: false
	// 		},
	// 		{
	// 			code : 'qna',
	// 			name: 'QNA',
	// 			is_show: false
	// 		},
	// 		{
	// 			code : 'audio',
	// 			name: 'Audio',
	// 			is_show: true
	// 		}
	// 	],
	// 	selectedTblAuthor: 0,
	// 	selectedTblMelody: 0,
	// 	selectedRaagiSinger: 0,
	// 	selectedAuthor: 0,
	// 	selectedAuthorCode: '',
	// 	pageFrom: 1,
	// 	pageTo: TOTAL_PAGES
	 //}

	advanceSearchOptions = {
		selectedLanguage: 'english',
		selectedContent:'audio',
		selectedTblAuthor: 0,
		selectedTblMelody: 0,
		selectedRaagiSinger: 0,
		selectedAuthor: 1,
		selectedAuthorCode: '',
		pageFrom: 1,
		pageTo: TOTAL_PAGES
	}
	
	totalPages: number = TOTAL_PAGES;

	searchedResult = {
		data: [],
		pagination: {
			page: 1,
			limit: 25
		}
	};

	translationAuthors: Array<any> 	= [];
	tblAuthors: Array<any> 	= [];
	tblMelodies: Array<any> 	= [];
	singers: Array<any> 	= [];

	isEngKeyboardShow: boolean = false;
	isPunKeyboardShow: boolean = false ;

	loader=true;

	/**
	 * Intial state
	 */
	/**
	 * Search shabad data
	 *
	 * @param Boolean loadOnShowMore=false
	 */
	is_search=false;
	searchdata=[];
	datalength=[];
	metadata={};

	startfrom;
	groupBy(OurArray, property) {  
		let rez = [];
		OurArray.reduce(function (accumulator, object) { 
		  // get the value of our object(age in our case) to use for group    the array as the array key  
		  const key = object[property]; 
		  // if the current value is similar to the key(age) don't accumulate the transformed array and leave it empty  
		  if (!accumulator[key]) {      
			accumulator[key] = [];    
			rez.push({
				"ShabadID": object[property],
				"Page": object['Page'],
				"title": object['title'],
				"name": object['name'],
				"Melody": object['Melody'],
				"Author": object['Author'],
				"ScriptureRomanEnglish": object['ScriptureRomanEnglish'],
				"Scripture": object['Scripture'],
				"id": object['id'],
				"sounds": [ object ]
			})
		  }
		  else {
			  for(let i = rez.length-1; i >= 0; i--){
				if(rez[i].ShabadID == object[property]){
					//if(object['Page'] < rez[i]["Page"]) rez[i]["Page"] = object['Page'];
					rez[i].sounds.push(object);
					break;
				}
			  }
		  }    
	  // add the value to the array
		  accumulator[key].push(object);
		  // return the transformed array
		return accumulator;  
	  // Also we also set the initial value of reduce() to an empty object
		}, {});
		return rez;
	  }
	  setCurrentPage(pagea){
		  this.pageChange({ page : pagea });
	  }

	searchData(loadOnShowMore=false) {
		this.searchKeword = this.searchKeword.trim();
		
		if(this.searchKeword == "") {
			if(this.advanceSearchOptions['selectedRaagiSinger'] != 0) {
				let name = "";
				this.singers.forEach(element => {
					if(element["id"] == this.advanceSearchOptions['selectedRaagiSinger']) name = element['attributes']['name'];
				});
				this.router.navigate(['artistgurbanilist/' + this.advanceSearchOptions['selectedRaagiSinger'] + '/' + name]);
			}
		}
		// setTimeout(() => {
		// 	try{
		//  $("table")[0].scrollIntoView(true);  
		 
		//  $("table")[1].scrollIntoView(true);   
		//  $("table")[2].scrollIntoView(true); 
		// 	}
		// 	catch(e){

		// 	}
		// }, 0);


		//this.loader=true;

		// this.rs.get("featured-api/listing?search="+this.searchKeword).subscribe((res) => {
		// 	this.search=res.result;
		// 	this.loader=false;
		// 	this.searchval=true;
		// }, (error) =>{
		//   console.log(error);
		//   this.loader=false;
		//   this.searchval=true;
		// });

		if(this.searchKeword.length==0 && this.advanceSearchOptions['selectedRaagiSinger'] == 0){
			return;
		}

		this.isLoadingMore = true;
		this.checkSearchKeywordLang();
		this.loadingBar.start();

		if (loadOnShowMore) {
			this.searchedResult.pagination.page++;
		}

		let url = "scripture/advance-search";//URLS.advance_search;
		let params = {
		    search_keyword	: this.searchKeword,
			search_option	: this.selectedSearchOption,
		    page 			: this.searchedResult.pagination.page,
			limit			: this.searchedResult.pagination.limit,
			res:"media"
		}


		this.setAdvanceSearchParams(params);

		this.rs.get2("scripture/media-advance-search-web",params).subscribe(data => {
			//this.searchResult = data;
			let property= 'ShabadID';
			this.searchResult = this.groupBy(data, property);
			this.pageChange({ page: 1 });
			
			this.numPages =  Math.ceil((this.searchResult.length / this.per_page));
			

			this.isLoadingMore = false;
			this.is_search=true;
			this.loadingBar.complete();
		});


		// "?search_keyword="+params['search_keyword']+"&search_option="+params['search_option']+"&page=1&limit=25&language=english&content=audio&pageF=1&pageT=1430"
		/*this.rs.get2(url,params)
		.subscribe((res) => {
			


		//	setTimeout(() => {
				try{
			 $("table")[0].scrollIntoView(true);  
			 
			 $("table")[1].scrollIntoView(true);   
			 $("table")[2].scrollIntoView(true); 
				}
				catch(e){
 
				}
			//}, 0);
			this.is_search=true;
			var searchdata2=res["data"];
			let arr=[];
			Object.keys(searchdata2).map(function(key){
				arr.push(searchdata2[key]);
			});
			this.searchdata=res['data'];
			this.searchdata=this.searchdata.filter((x)=> x['data_m'].length>=1);
			this.datalength=[];
			for(var i=0;i<this.searchdata.length;i++)
			{
			   this.datalength.push(this.searchdata[i]['data_m'].length);	
			}
			
			// if (!loadOnShowMore) {
			// 	this.searchedResult.data = [];
			// }

			// if (res.data && res.data.length > 0) {

			// 	res.data.forEach((val) => {
			// 		if (res.included) {
			// 			res.included.forEach((rel) => {
			// 				if (rel.type == 'author') {
			// 					if (rel.id == val['attributes']['author_id']) {
			// 						val['author_data'] = rel.attributes;
			// 					}
			// 				}

			// 				if (rel.type == 'melody') {
			// 					if (rel.id == val['attributes']['melody_id']) {
			// 						val['melody_data'] = rel.attributes;
			// 					}
			// 				}
			// 			});
			// 		}

			// 	});

			// 	this.searchedResult.data = this.searchedResult.data.concat(res.data);
			//}

			//this.searchedResult.pagination['total'] = res["data"].length;
			
			this.metadata['total']=res['total'];
			this.metadata['per_page']=res['per_page'];
			this.isLoadingMore = false;

				this.loadingBar.complete();
				
				this.startfrom=(parseInt(res.current_page)-1)*parseInt(res.per_page)+1;

		   
		}, (err) => {
			console.log(err);
			this.isLoadingMore = false;
		});*/
	}

	/**
	 * Check the language of search keywork is gurmukhi or any other
	 */
	checkSearchKeywordLang() {
		/*if (this.advanceSearchOptions.selectedLanguage !== 'gurmukhi'
			|| this.advanceSearchOptions.selectedContent == 'audio') {
			return;
		}*/
		var englishRerExP = /^[A-Za-z0-9\s]*$/;

		this.advanceSearchOptions.selectedLanguage = 'gurmukhi';
		if (englishRerExP.test(this.searchKeword)) {
			this.advanceSearchOptions.selectedLanguage = 'english';
		}

		//this.setHideShowContentBasedOnLanguage(); 
	}

	/**
	 * Set parameters for advance searc request
	 *
	 * @param Object params
	 */
	setAdvanceSearchParams(params) {
		params['language']	=  this.advanceSearchOptions.selectedLanguage;
		params['content']	=  this.advanceSearchOptions.selectedContent;

		if (this.advanceSearchOptions.selectedTblAuthor > 0) {
			params['author'] =  this.advanceSearchOptions.selectedTblAuthor;
		}

		if (this.advanceSearchOptions.selectedAuthor > 0) {
			params['translation_author'] =  this.advanceSearchOptions.selectedAuthor;
		}

		if (this.advanceSearchOptions.selectedTblMelody > 0) {
			params['raag'] =  this.advanceSearchOptions.selectedTblMelody
		}

		if (this.advanceSearchOptions.selectedRaagiSinger > 0) {
			params['audio_author_id'] =  this.advanceSearchOptions.selectedRaagiSinger
		}

		params['pageF']		=  this.advanceSearchOptions.pageFrom,
		params['pageT']		=  this.advanceSearchOptions.pageTo
	}

	/**
	 * Get list of translations authors
	 */
	getTranslationAuthors(){
		let url = URLS.get_translation_authors;
		this._http.get(url)
		.subscribe((response) => {
			this.translationAuthors = response.data;

			this.setTranslationAuthors();
		}, (error) =>{
			console.log(error);
		});
	}

	setTranslationAuthors() {
		this.translationAuthors.forEach((author) => {
			author['authorCode'] = this._helper.toSnakeCase(author.ReferredColumn);
		});
		sessionStorage.setItem('translationAuthors', JSON.stringify(this.translationAuthors));
	}

	/**
	 * Get TBL Authors table data list
	 */
	getTblAuthors() {
		let url = URLS.tbl_authors;
		let params = {
			sort : 'author',
    		direction : 'asc',
		}
		this._http.get(url, params)
		.subscribe((response) => {
			this.tblAuthors = response.data;
			sessionStorage.setItem('tblAuthors', JSON.stringify(this.tblAuthors));
		}, (error) =>{
			console.log(error);
		});
	}

	/**
	 * Get melodies data
	 */
	getTblMelodies() {
		let url = URLS.tbl_melodies;
		let params = {
			sort : 'melody',
    		direction : 'asc',
		}
		this._http.get(url, params)
		.subscribe((response) => {
			this.tblMelodies = response.data;
			sessionStorage.setItem('tblMelodies', JSON.stringify(this.tblMelodies));
		}, (error) =>{
			console.log(error);
		});
	}

	/**
	 * Method for get counting of 1 to particular number
	 *
	 * @param Interger i
	 */
	counter(i: number) {
	    return new Array(i);
	}

	/**
	 * On change search language
	 *
	 * @param String  lang
	 */
	onChangeLanguage(lang) {

		this.advanceSearchOptions['selectedLanguage'] = lang;

		if (this.advanceSearchOptions.selectedContent !== 'gurbani') {
			this.resetSearchedData();
		}

		this.advanceSearchOptions.selectedContent = 'gurbani';

		//this.setHideShowContentBasedOnLanguage();
	}

	/**
	 * Hide and Show content options based on language
	 */
	// setHideShowContentBasedOnLanguage() {
	// 	let selectedLangObj = this.getSelectedLanguageObj();

	// 	this.advanceSearchOptions.contents.forEach((content) => {
	// 		content.is_show = false;

	// 		if (selectedLangObj
	// 			&& selectedLangObj['content']
	// 			&& selectedLangObj['content'].indexOf(content.code) != -1) {
	// 			content.is_show = true;

	// 			//search optoins setting
	// 			// this.selectedSearchOption = 3;
	// 			this.searchOtions.forEach((so) => {
	// 				so.is_show = true;
	// 			});
	// 		}
	// 	});
	// }

	/**
	 * Get selected language object data
	 */
	// getSelectedLanguageObj() {
	// 	let selectedLangObj = {};

	// 	this.advanceSearchOptions.languages.forEach((lang) => {
	// 		if (lang.code == this.advanceSearchOptions.selectedLanguage) {
	// 			selectedLangObj = lang;
	// 		}
	// 	});

	// 	return selectedLangObj;
	// }

	/**
	 * Get selected content object data
	 */
	// getSelectedContentObj() {
	// 	let selectedContentObj = {};

	// 	this.advanceSearchOptions.contents.forEach((content) => {
	// 		if (content.code == this.advanceSearchOptions.selectedContent) {
	// 			selectedContentObj = content;
	// 		}
	// 	});

	// 	return selectedContentObj;
	// }

	/**
	 * Perform actions on change of content or selection of content
	 *
	 * @param String content
	 */
	onChangeContent(content) {

		this.advanceSearchOptions.selectedContent = content;

		this.resetSearchedData();

		this.selectedSearchOption = 3;
		if (this.advanceSearchOptions['selectedContent'] == 'teeka') {
			this.setDefaultTranslationAuthorSelcted('ManmohanSinghPunjabi');
			this.selectedSearchOption = 1;
		}

		if (this.advanceSearchOptions['selectedContent'] == 'english-translation') {
			this.setDefaultTranslationAuthorSelcted('ManmohanSinghEnglish');
			this.selectedSearchOption = 1;
		}

		this.searchOtions.forEach((so) => {
			so.is_show = true;

			if ((this.advanceSearchOptions['selectedContent'] == 'teeka'
				|| this.advanceSearchOptions['selectedContent'] == 'english-translation')
				&& (so.code == 3 || so.code == 4)) {
					so.is_show = false;
			}
		});
	}

	/**
	 * Set selection of default author
	 *
	 * @param String authorCode
	 */
	setDefaultTranslationAuthorSelcted(authorCode) {
		if (this.translationAuthors.length == 0) {
			return
		}

		this.translationAuthors.forEach((author) => {
			if (author.ReferredColumn == authorCode) {
				this.advanceSearchOptions.selectedAuthor = author.id;
				this.advanceSearchOptions.selectedAuthorCode = author.authorCode;
			}
		})
	}

	/**
	 * set selected translation authour on change of translation author
	 */
	onChangeTranslationAuthor() {
		this.resetSearchedData();

		if (this.advanceSearchOptions['selectedAuthor'] == 0) {
			this.advanceSearchOptions.selectedAuthorCode = '';

			return;
		}

		this.translationAuthors.forEach((author) => {
			if (author.id == this.advanceSearchOptions['selectedAuthor']) {
				this.advanceSearchOptions.selectedAuthorCode = author.authorCode;
			}
		})
	}

	/**
	 * Reset searched data list
	 */
	resetSearchedData() {
		this.searchedResult = {
			data: [],
			pagination: {
				page: 1,
				limit: 25
			}
		};
	}

	/**
	 * Add words in search keyword if english keyboard key select
	 *
	 * @param String  word
	 */
	onEngKeyboardDataEnter(word) {
		this.searchKeword += word;
	}

	f(str){
		if(this.isPunKeyboardShow || this.isEngKeyboardShow){ this.searchData(); }
		this.showHideKeyboard(str);
	}

	/**
	 * Add words in search keyword if punjabi keyboard key select
	 *
	 * @param String  word
	 */
	onPunKeyboardDataEnter(word) {
		this.searchKeword += word;
	}

	/**
	 * show and hide keyboards and show one at a time
	 *
	 * @param String  keyboardType
	 */
	ugasiTastature(){
		$('#tastatura').click();
	}
	showHideKeyboard(keyboardType) {

		if (keyboardType == 'eng') {
			this.isPunKeyboardShow = false;
			this.isEngKeyboardShow = !this.isEngKeyboardShow;
		} else  if (keyboardType == 'pun') {
			this.isEngKeyboardShow = false;
			this.isPunKeyboardShow = !this.isPunKeyboardShow;
		}
		else if (keyboardType == 'all')  {
			this.isEngKeyboardShow = false;
			this.isPunKeyboardShow = false;
		}

		//


		//language select based on keyboard
		/*if (this.isEngKeyboardShow) {
			// this.searchKeword = "";
			this.advanceSearchOptions['selectedLanguage'] = 'english';
			this.setHideShowContentBasedOnLanguage();
			this.resetSearchedData();
		} else if (this.isPunKeyboardShow) {
			// this.searchKeword = "";
			this.advanceSearchOptions['selectedLanguage'] = 'gurmukhi';
			this.setHideShowContentBasedOnLanguage();
			this.resetSearchedData();
		}*/
	}

	/**
	 * make some changes on focus of search keyword input
	 */
	onFocusOfSearchInput() {
		this.hideBothKeyboards();
	}

	/**
	 * hide both keyboards
	 */
	hideBothKeyboards() {
		this.isEngKeyboardShow = false;
		this.isPunKeyboardShow = false;
	}

	/**
	 * Load raagi singers list
	 */
	loadSingers() {
		let url = URLS.get_authors;

		this._http.get(url)
		.subscribe((res) => {

			if (res.data.length == 0) {
				return;
			}

			let singers = res.data;
			this.singers = singers;
			sessionStorage.setItem('singers', JSON.stringify(this.singers));
		}, (err) => {
			console.log(err);
		});
	}

	/**
	 * Clear search keyword from input
	 */
	clearSearchInput() {
		this.searchKeword = "";
	}

	/**
	 * reset all search and selection options data
	 */
	resetSearchAndOptions() {
		this.clearSearchInput();
		this.hideBothKeyboards();
		this.resetSearchedData();

		this.selectedSearchOption = 3; //set search option to first letter search

		// reset to defalut selected options
		this.advanceSearchOptions.selectedLanguage = 'gurmukhi';
		this.advanceSearchOptions.selectedContent = 'gurbani';
		this.advanceSearchOptions.selectedContent = 'gurbani';
		this.advanceSearchOptions.selectedTblAuthor = 0,
		this.advanceSearchOptions.selectedTblMelody = 0,
		this.advanceSearchOptions.selectedRaagiSinger = 0,
		this.advanceSearchOptions.selectedAuthor = 1,
		this.advanceSearchOptions.selectedAuthorCode = '',
		this.advanceSearchOptions.pageFrom = 1,
		this.advanceSearchOptions.pageTo = TOTAL_PAGES

	}


}
