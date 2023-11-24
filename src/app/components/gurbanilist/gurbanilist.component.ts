import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcesService } from 'src/app/services/resources.services';
declare var $;
declare var DeviceUUID;
import { DatePipe, Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/services/http.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-gurbanilist',
  templateUrl: './gurbanilist.component.html',
  styleUrls: ['./gurbanilist.component.scss'],
  providers: [DatePipe]
})
export class GurbanilistComponent implements OnInit {

  constructor(private _event: EventService, private _user: UserService,private httpservice: HttpService,private route:ActivatedRoute,private _router:Router,private rs:ResourcesService,private datePipe: DatePipe,private userService:UserService,private loc:Location,private ref:ChangeDetectorRef,private modalService: NgbModal) { }
 
  sub;
  id;
  title;
isadmin=false;
currentPlaying = -1;

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


	  mediaList=[];
	  mydate=new Date();
	  mydt;
	  restrat(x)
	{
		
		if(this.mediaList[x].attachment_name != null){
						var machine_id = this._event.getMachinId(); 
						this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
						var mediaid=this.mediaList[x].id;
						var param=new URLSearchParams();
						// param["machine_id"]=machine_id;
						// param["media_id"]=mediaid;
						// param["view_date"]=this.mydt;
						// param["user_id"]='';
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
						})
						$("#player").show();
						//$("#matradioplayer").hide();
						//$("#matradioplayer audio")[0].pause();
						//$(".text").text(this.mediaList[x].name);
						$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.mediaList[x].title+"</marquee>");
						$("#player audio")[0].src=this.mediaList[x].attachment_name;

						
						$("#srcforsong").html(this.mediaList[x].attachment_name);
						$("#setsrc").click();
						$("#playSong").click();
						//$("#player audio")[0].play();
		}
		else{
			$("#player").show();
			$("#matradioplayer").hide();
			$("#matradioplayer audio")[0].pause();
			$("#player audio")[0].src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
			
			$("#srcforsong").html("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();
		}
		
	}
	index=-1;
	previndex=-1;

	playerPauseEvent() {
		this.setindex();
	};
	playerPlayEvent() {
		this.set2();
	};

	restrat2(x){
		this.currentPlaying = x;
		if(this.index==x){
			// this.index=-1;
			//$("#player audio")[0].pause();
			$("#pauseSong").click();
		} else if(x==this.previndex) {
			this.index=x;
		  //$("#player audio")[0].play();
			$("#player").show();
		  	$("#playSong").click();
		}
		else {
		// Add Player List singer name and title
		localStorage.setItem('playerTitle', this.mediaList[x].title);
		localStorage.setItem('singerName', this.mediaList[x].author_name);
		let data = [];
		this._event.fire('showSingerName', data);
		// Add Player List singer name and title

		
		this.previndex=this.index;
		this.index=x;
		this.previndex=x;
					  $("#player").show();
					  $("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.mediaList[x].title+"</marquee>");
					  $("#player audio")[0].src=this.mediaList[x].attachment_name;//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
					  
					$("#srcforsong").html(this.mediaList[x].attachment_name);
					$("#setsrc").click();
					$("#playSong").click();
					  //$("#player audio")[0].play();
					  var machine_id = this._event.getMachinId(); 
										this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
										var mediaid=this.mediaList[x].id;
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

	
	urlid;
	back()
	{
		this.loc.back();
	}

	setindex(){
		this.previndex=this.index;
		this.index = -1;
		this.ref.detectChanges();
	  }
	  set2()
	  {
		this.index=this.previndex;
	  }
	  msgerr;

  loader=true;
  available=true;
  cid;
  data;
  title2;
  mediaObjects=[];
  mediaList2=[];
  slist=[];
  url;
	  


   menu = [
	{ name: 'gurbanilist', path: './gurbanilist', children: [] },
	
  ];
  validateAction(action) {
    let flag = this._user.isUserValidateForThisAction(action);

    return flag;
}
  breadcrumlist=[];
  change(path)
  {
	 this._router.navigate([path]);
  }
  ngOnInit() 
  { 

	document.getElementById("main2").scrollTo(0,0);
	  try{
	if(JSON.parse(localStorage.getItem('current_user')).role.name=="super admin")
	{
		  this.isadmin=true; 
	}

	
}
catch(e)
{
	
}
    var self = this;
	$('audio')[0].onpause = function() {
		// self.setindex();
	  };
	  $('audio')[0].onplay = function() {
		self.set2();
	  };
	
	  $("#resources").addClass("active");
      this.sub = this.route.params.subscribe(params => {
	  this.title = params['title'];
	  this.id=params['id'];
	  this.urlid=params['urlid'];
	  this.cid=params['cid']
	  this.title2=params['ctitle']
	  });
	  if(this.title2){
		this.breadcrumlist=[{name:"Media",path:"/resources"},
		{name:this.title2,path:"/artistlist/"+this.title2+"/"+this.cid}
		]
	  }
	  else{
		this.breadcrumlist=[
			{name:"Media",path:"/resources"}
		]
	  }
	  //this.url="media/category-media/";
	 this.url="media/resource-category-media-new/"; 
	  this.saveurl='';
	
	  this.saveurl="featured-api/save-prior-media?categories="+this.id;
	  	if(this.urlid==1){
			this.saveurl="featured-api/save-prior-media?subcategories="+this.id;
			this.url="media/resource-subcategory-media-new/";
			this.rs.get("categories/sub-categories/"+this.cid)
			.subscribe((res) => {
				this.data=res['featured_sub_categories'].filter((x)=> x.id == this.id);
				this.data=this.data[0];
			}, (error) =>{
				console.log(error);
			});
		}
		else{
			this.rs.get("categories/featured")
				.subscribe((res) => {
					this.data=res['featured_categories'].filter((x)=> x.id == this.id);
					this.data=this.data[0];
				}, (error) =>{
					console.log(error);
				});
		
		}
	  this.rs.get(this.url+this.id)
		.subscribe((res) => {
			this.loader=false;
			this.mediaList=!(this.urlid==1)?res['category_media']:res['subcategory_media'];
			//this.mediaList=this.mediaList.sort((a,b)=> {return a.title.trim().localeCompare(b.title.trim())})
			
			this.slist=this.mediaList.filter((x)=> x.priority_order_status!=0);
			/*this.slist.sort(function (a, b) {
				//if(a.priority_order_status==0 || b.priority_order_status==0){
				//	return 0;
				//}
                return a.priority_order_status - b.priority_order_status;
			  });*/
			  
			 var list=this.mediaList=this.mediaList.filter((x)=> x.priority_order_status==0 )
			 this.mediaList=[];
			 this.slist=this.slist.concat(list);
			 this.mediaList=this.slist; 
			  //this.mediaList.reverse();
			  

			for(var i=0;i<this.mediaList.length;i++)
            {
                if(this.mediaList[i].priority_order_status!=0)
                {
                   this.mediaObjects.push({id:this.mediaList[i].id,value:this.mediaList[i].title,display:this.mediaList[i].title,sort:this.mediaList[i].priority_order_status});   
                }
				this.mediaList2.push({id:this.mediaList[i].id,value:this.mediaList[i].title});
				this.mediaList2=this.mediaList2.sort((a,b)=> {return a.value.localeCompare(b.value)})

			}
			this.mediaObjects.sort(function (a, b) {
                return a.sort - b.sort;
              });

		}, (error) =>{
			console.log(error);
			this.msgerr=error;

			this.available=false;
			this.loader=false;
      
		});
	
	}
 

	get()
	{
		this.rs.get(this.url+this.id)
		.subscribe((res) => {
			this.loader=false;
			this.mediaList=[];
			this.slist=[];
			this.mediaObjects=[];
			this.mediaList2=[];

			this.mediaList=!(this.urlid==1)?res['category_media']:res['subcategory_media'];
			//this.mediaList=this.mediaList.sort((a,b)=> {return a.title.trim().localeCompare(b.title.trim())})
			
			this.slist=this.mediaList.filter((x)=> x.priority_order_status!=0);
			/*this.slist.sort(function (a, b) {
				//if(a.priority_order_status==0 || b.priority_order_status==0){
				//	return 0;
				//}
                return a.priority_order_status - b.priority_order_status;
			  });*/
			  
			 var list=this.mediaList=this.mediaList.filter((x)=> x.priority_order_status==0 )
			 this.mediaList=[];
			 this.slist=this.slist.concat(list);
			 this.mediaList=this.slist; 
			  //this.mediaList.reverse();
			  

			for(var i=0;i<this.mediaList.length;i++)
            {
                if(this.mediaList[i].priority_order_status!=0)
                {
                   this.mediaObjects.push({id:this.mediaList[i].id,value:this.mediaList[i].title,display:this.mediaList[i].title,sort:this.mediaList[i].priority_order_status});   
                }
				this.mediaList2.push({id:this.mediaList[i].id,value:this.mediaList[i].title});
				this.mediaList2=this.mediaList2.sort((a,b)=> {return a.value.localeCompare(b.value)})

			}
			this.mediaObjects.sort(function (a, b) {
                return a.sort - b.sort;
              });

		}, (error) =>{
			console.log(error);
			this.msgerr=error;

			this.available=false;
			this.loader=false;
      
		});
	
	}


	hidemodal()
    {
        this.modalService.dismissAll();
	}
	successmsg;
	success=false;
	err=false;
	saveurl;
	save(content)
	{
        this.modalService.open(content, { centered: true,windowClass: 'dark-modal' });
		var data;
		var featured_media_id=[];
		for(var i=0;i<this.mediaObjects.length;i++)
		{
				featured_media_id[i]={"media_id":this.mediaObjects[i].id.toString()};
		}
		var data2=new URLSearchParams();
		data2.set("featured_media_id",JSON.stringify(featured_media_id));
		this.rs.post(this.saveurl,data2).subscribe((res)=>{
			if(res['message']!=null)
			{
				this.hidemodal();
				this.successmsg=res['message'];
				this.success=true;
				this.err=false;
				this.get();
			}
			else{
				this.err=true;
				this.success=false;

				this.hidemodal();
			}
		}, (error) =>{
			console.log(error);
			this.err=true;
			this.success=false;
			this.hidemodal();
		});
	}


}
