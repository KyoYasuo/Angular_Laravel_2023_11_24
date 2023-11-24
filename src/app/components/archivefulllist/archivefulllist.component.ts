import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { FileSaverService } from 'ngx-filesaver';

import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { HttpService } from 'src/app/services/http.service';
import { EventService } from 'src/app/services/event.service';

declare var $;
declare var DeviceUUID;


@Component({
  selector: 'app-archivefulllist',
  templateUrl: './archivefulllist.component.html',
  styleUrls: ['./archivefulllist.component.scss'],
  providers: [DatePipe]
})
export class ArchivefulllistComponent implements OnInit {
  //podcastlist=[];
  index=-1;
  index2=-1;
  loader=true;
  
  previndex=-1;
  previndex2=-1;	
  
  // Add Pagingnation
	
  numPages = 1;
  isLoadingMore: Boolean = true;
  
  podcastlist = {
    data: [],
    pagination: {
      page: 1,
      limit: 30,
	  total: 0,
    }
  };
	
	mydate=new Date(); mydt;

  check(podcast){ return !podcast.thumbnail || podcast.thumbnail=='' }
  check2(podcast){ return podcast.thumbnail_pod && podcast.thumbnail!=''; }
  
  restrat(x){

    if(this.index==x){
        this.index=-1;
        //$("#player audio")[0].pause();
			  $("#pauseSong").click();
    } else if(this.previndex==x) {
      //$("#player audio")[0].play();
      $("#player").show();
			$("#playSong").click();
    } else {
      this.index=x;
      this.previndex=x;
      $("#player").show();
      //$("#matradioplayer").hide();
      //$("#matradioplayer audio")[0].pause();
      $("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.podcastlist[x].title+"</marquee>");
      $("#player audio")[0].src=this.podcastlist[x].attachment_name;//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      
			$("#srcforsong").html(this.podcastlist[x].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
      //$("#player audio")[0].play();

		localStorage.setItem('playerTitle', this.podcastlist[x].title);
		localStorage.setItem('singerName', this.podcastlist[x].author_name);
		let data = [];
		this._event.fire('showSingerName', data);

		var machine_id = this._event.getMachinId(); 
		this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
		var mediaid=this.podcastlist[x].id;
		var param=new URLSearchParams();
		param.set("machine_id",machine_id);
		param.set("media_id",mediaid);
		param.set("view_date",this.mydt);
		
		if(this.userService.isUserLogin()){
			param.set("user_id",this.userService.getLoggedInUser().id);
		} else{
			param.set("user_id",'');
		}
		
		this.rs.post("media/play",param).subscribe((res)=>{
		},(error)=>{
			console.log(error);
		});
	}
  }

  restrat2(x){
		if(this.podcastlist['data'][x].type=="YOUTUBE"){
			localStorage.setItem("url",this.podcastlist['data'][x].attachment_name);
			var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.podcastlist['data'][x].id;
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
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.podcastlist['data'][x].title+"</marquee>");
			$("#player audio")[0].src=this.podcastlist['data'][x].attachment_name;
			$("#srcforsong").html(this.podcastlist['data'][x].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();
			
		
			// Add Player List singer name and title
			localStorage.setItem('playerTitle', this.podcastlist['data'][x].title);
			localStorage.setItem('singerName', this.podcastlist['data'][x].author_name);
			let data = [];
			this._event.fire('showSingerName', data);
			// Add Player List singer name and title
			
			var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.podcastlist['data'][x].id;
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
  
  restrat2search(x){
    if(this.index2==x) {
        this.index2=-1;
        //$("#player audio")[0].pause();
			  $("#pauseSong").click();
    } else if(this.previndex2==x){
      //$("#player audio")[0].play();
      $("#player").show();
			$("#playSong").click();
    } else {
      this.index2=x;
      this.previndex2=x;
      $("#player").show();
      //$("#matradioplayer").hide();
      //$("#matradioplayer audio")[0].pause();
      $("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.podcastlistsearch[x].title+"</marquee>");
      
      $("#player audio")[0].src=this.podcastlistsearch[x].attachment_name;//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      
			$("#srcforsong").html(this.podcastlistsearch[x].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
      //$("#player audio")[0].play();
		var machine_id = this._event.getMachinId(); 
		this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
		var mediaid=this.podcastlistsearch[x].id;
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

  constructor( private _event: EventService, private httpservice: HttpService,
    private loading:LoadingBarService,private modalService: NgbModal,private _user: UserService,private route:ActivatedRoute,private router:Router,private _http: Http, private _FileSaverService: FileSaverService,private rs:ResourcesService,private ref:ChangeDetectorRef,private datePipe: DatePipe,private userService:UserService) {
  }
   
  searchloader=false;
  is_search=false;
  podcastlistsearch=[];
  
	somethingChanged(searchtxt){
		var search = $("#search_val").val();
		if(search=="") {
			this.searchloader=false;
			this.podcastlistsearch=[];
			this.is_search=false;
		}
	}
  
  search(){
    var search = $("#search_val").val();
    this.searchtxt=search;
     this.previndex=-1;
     this.index=-1;
     this.previndex2=-1;
     this.index2=-1;
    //  if(search==undefined)
    //  {
    //   this.searchloader=false;
    //   this.podcastlistsearch=[];
    //   this.is_search=false;
    //  }
    //  else{
      this.searchloader=true;
      this.podcastlistsearch=[];
      this.is_search=true;
      
      this.loading.start();
      this.rs.get("media/podcast-list?search="+search).subscribe((res) => {
        this.podcastlistsearch=res.result;
        this.searchloader=false;

      this.loading.complete();

      this.loading.stop();
      }, (error) =>{
        console.log(error);
        this.searchloader=false;
      });
     //}
  }


  search2()
  {
     $("#search").val(this.searchtxt);
     this.previndex=-1;
     this.index=-1;
     this.previndex2=-1;
     this.index2=-1;
     if(this.searchtxt==undefined)
     {
      this.searchloader=false;
      this.podcastlistsearch=[];
      this.is_search=false;
     }
     else{
      this.searchloader=true;
      this.podcastlistsearch=[];
      this.is_search=true;
      this.rs.get("media/get-archive-all?search="+this.searchtxt).subscribe((res) => {
        this.podcastlistsearch=res.result;
        this.searchloader=false;
        this.loader=false;

        this.searchtxt=null;
      }, (error) =>{
        console.log(error);
        this.searchloader=false;

        this.searchtxt=null;
      });
     }
  }
  setindex(){
    this.index=-1;
    this.index2=-1;
    this.ref.detectChanges();
  }
  set2(){
    this.index=this.previndex;
    this.index2=this.previndex2;
  }
  
  onKeydownEvent(event: KeyboardEvent): void {
    if (event.keyCode === 13) {
      this.search();
    }
  }
  searchtxt=null;
  validateAction(action) {
    let flag = this._user.isUserValidateForThisAction(action);

    return flag;
}
	breadcrumlist=[];
	change(path)
  {
	 this.router.navigate([path]);
  }
   	
	openModal2(c){
		this.modalService.dismissAll();
		this.modalService.open(c,{centered:true});
		//$("#exampleModalCenter").modal('show');
	}
	open(ev){
		this.modalService.dismissAll();
		$('#exampleModalCenter').modal('hide');
	}
	
	res;
	ngOnInit() {
		
		this.rs.get3(this.httpservice.getAPI() + "api/v1/media/totalCount").subscribe((res)=>{
		  this.res=res;
		},(err)=>{

		}) 
		
		this.breadcrumlist=[{name:"Home",path:"/home"}]
		document.getElementById("main2").scrollTo(0,0);

		this.route.params.subscribe(params => {
			this.searchtxt=params['search'];
		});

		var self = this;
		$('audio')[0].onpause = function() {
		  self.setindex();
		};
		$('audio')[0].onplay = function() {
		  self.set2();
		};
		
		if(this.searchtxt==null){
			this.getArchiveList();			
		} else {
			this.search2();
		}
    }

	
  //follows=["arun","sham","suraj","ram","sham","amit","mohit","rohit"]
	openModal() {
		$("#exampleModalCenter").modal('show');
	}
	// New Code
	
	getArchiveList(){
		
		this.rs.get('media/get-archive-all?page=' + this.podcastlist.pagination.page).subscribe((res) => {
		  
		  //this.podcastlist=res.result.data;
		  this.podcastlist.data = res.result.data;
		  
		  this.podcastlist.data =this.podcastlist['data'].filter((item)=> item.status== 1);
		  this.numPages = res.result.last_page;
		  this.podcastlist.pagination['limit'] = res.result.per_page;
		  this.podcastlist.pagination['total'] = res.result.total;
		  this.podcastlist.pagination['page'] = res.result.current_page;
		 
		  this.loader=false;
		  this.ref.detectChanges();
		}, (error) =>{
		  console.log(error);
		  this.loader=false;
		});
	}
	
		
	archiveListLoad(isLoadingMore){
		
		this.isLoadingMore = true;
		if (isLoadingMore) { this.podcastlist.pagination.page++; }
		
		this.rs.get('media/get-archive-all?page=' + this.podcastlist.pagination.page).subscribe((res) => {
		  
		  this.podcastlist.data = res.result.data;
		  
		  this.podcastlist.data =this.podcastlist['data'].filter((item)=> item.status== 1);
		  this.numPages = res.result.last_page;
		  this.podcastlist.pagination['limit'] = res.result.per_page;
		  this.podcastlist.pagination['total'] = res.result.total;
		  this.podcastlist.pagination['page'] = res.result.current_page;
		 
		  this.ref.detectChanges();
		}, (error) =>{
		  console.log(error);
		});
	}


  pageChanged(event) { 
    this.podcastlist.pagination.page = event-1;
	this.archiveListLoad(true);
  }
}
