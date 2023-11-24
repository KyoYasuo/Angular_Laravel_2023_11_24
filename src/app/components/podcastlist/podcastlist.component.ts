import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import { FileSaverService } from 'ngx-filesaver';
import { ResourcesService } from 'src/app/services/resources.services';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarComponent, LoadingBarModule, LoadingBarService } from '@ngx-loading-bar/core';
import { HttpService } from 'src/app/services/http.service';
import { EventService } from 'src/app/services/event.service';

declare var $;
declare var DeviceUUID;
@Component({
  selector: 'app-podcastlist',
  templateUrl: './podcastlist.component.html',
  styleUrls: ['./podcastlist.component.scss'],
  providers: [DatePipe]
})
export class PodcastlistComponent implements OnInit {
  podcastlist=[];
  podcastlist2=[];
  index=-1;
  index2=-1;
  loader=true;

  previndex=-1;
  previndex2=-1; 
    	
	openModal2(c)
	{

		this.modalService.dismissAll();
		this.modalService.open(c,{centered:true});
		//$("#exampleModalCenter").modal('show');
	}
	mydate=new Date();
	mydt;
  restrat(x){
    if(this.index==x)
    {
        this.index=-1;
        //$("#player audio")[0].pause();
			  $("#pauseSong").click();
    }
    else if(this.previndex==x)
    {
      //$("#player audio")[0].play();
      $("#player").show();
			$("#playSong").click();
    }
    else{
      this.index=x;
      this.previndex=x;
      $("#player").show();
      $("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.podcastlist[x].title+"</marquee>");
      $("#player audio")[0].src=this.podcastlist[x].attachment_name;
      
			$("#srcforsong").html(this.podcastlist[x].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
      //$("#player audio")[0].play();

      var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.podcastlist[x].id;
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

  restrat2(x){
		if(this.podcastlist2[x].type=="YOUTUBE"){
			localStorage.setItem("url",this.podcastlist2[x].attachment_name);
			var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.podcastlist2[x].id;
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
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.podcastlist2[x].title+"</marquee>");
			$("#player audio")[0].src=this.podcastlist2[x].attachment_name;
			$("#srcforsong").html(this.podcastlist2[x].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();
			
		
			// Add Player List singer name and title
			localStorage.setItem('playerTitle', this.podcastlist2[x].title);
			localStorage.setItem('singerName', this.podcastlist2[x].author_name);
			let data = [];
			this._event.fire('showSingerName', data);
			// Add Player List singer name and title
			
			var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.podcastlist2[x].id;
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

  restratsearch2(x){
		if(this.podcastlistsearch[x].type=="YOUTUBE"){
			localStorage.setItem("url",this.podcastlistsearch[x].attachment_name);
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
				this.router.navigate(['/videoplayer']);
			
			},(error)=>{
				console.log(error);
				this.router.navigate(['/videoplayer']);
			
			});
		}
		else
		{
			$("#player").show();
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.podcastlistsearch[x].title+"</marquee>");
			$("#player audio")[0].src=this.podcastlistsearch[x].attachment_name;
			$("#srcforsong").html(this.podcastlistsearch[x].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();
			
		
			// Add Player List singer name and title
			localStorage.setItem('playerTitle', this.podcastlistsearch[x].title);
			localStorage.setItem('singerName', this.podcastlistsearch[x].author_name);
			let data = [];
			this._event.fire('showSingerName', data);
			// Add Player List singer name and title
			
			var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.podcastlistsearch[x].id;
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
    if(this.index2==x)
    {
        this.index2=-1;
        //$("#player audio")[0].pause();
        $("#pauseSong").click();
    }
    else if(this.previndex2==x)
    {
      //$("#player audio")[0].play();
      $("#player").show();
			$("#playSong").click();
    }
    else{
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
  open(ev)
  {
    this.modalService.dismissAll();
    $('#exampleModalCenter').modal('hide');
  }
  constructor( private _event: EventService,
    private loading:LoadingBarService, private httpservice: HttpService,
    private _user: UserService,private route:ActivatedRoute,private router:Router,private _http: Http, private _FileSaverService: FileSaverService,private rs:ResourcesService,private ref:ChangeDetectorRef,private datePipe: DatePipe,private userService:UserService,private modalService: NgbModal) {

  }
  validateAction(action) {
    let flag = this._user.isUserValidateForThisAction(action);

    return flag;
}
  searchloader=false;
  is_search=false;
  podcastlistsearch=[];
  // somethingChanged(){
  //    var search = $("#search").val();
  //    if(search=="")
  //    {
  //     this.searchloader=false;
  //     this.podcastlistsearch=[];
  //     this.is_search=false;
  //    }
  // }
  search()
  {
    this.loading.start();
    var search = $("#search_val").val();
    this.searchtxt=search;
     this.previndex=-1;
     this.index=-1;
     this.previndex2=-1;
     this.index2=-1;
      this.searchloader=true;
      this.podcastlistsearch=[];
      this.is_search=true;
      this.rs.get("media/podcast-list?search="+search).subscribe((res) => {
        this.podcastlistsearch=res.result;
        this.searchloader=false;
        this.ref.detectChanges();
        this.loading.complete();
      }, (error) =>{
        console.log(error);
        this.searchloader=false;
        this.ref.detectChanges();
        this.loading.complete();
      });
  }


  search2()
  {
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
          this.rs.get("media/podcast-list?search="+this.searchtxt).subscribe((res) => {
            this.podcastlistsearch=res.result;
            this.searchloader=false;
            this.loader=false;
            this.ref.detectChanges();
          }, (error) =>{
            console.log(error);
            this.searchloader=false;
          });
     }

    
  }
  onSave() {
    this._http.get('assets/images/beer_can_opening.mp3', {
      responseType: ResponseContentType.Blob // This must be a Blob type
    }).subscribe(res => {
      this._FileSaverService.save((<any>res)._body, "myfile");
    });

  }
  setindex(){
    this.index=-1;
    this.index2=-1;
    this.ref.detectChanges();
  }
  set2()
  {
    this.index=this.previndex;
    this.index2=this.previndex2;
  }
  onKeydownEvent(event: KeyboardEvent): void {
    if (event.keyCode === 13) {
      this.search();
    }
  }
  searchtxt=null;
  id;
  type;
  isadmin=false;
  mediaObjects=[];
  mediaList2=[];
  saveurl;
  url;
  title_val;
  
	breadcrumlist=[];
	change(path)
  {
	 this.router.navigate([path]);
  }
  
  res;
	ngOnInit() {
  
    this.rs.get3(this.httpservice.getAPI() + "api/v1/media/totalCount").subscribe((res)=>{
      this.res=res;
    },(err)=>{

    })
		  this.breadcrumlist=[
        {name:"Home",path:"/home"}
		  ]
    this.title_val=localStorage.getItem("title");
    try{
      document.getElementById("main2").scrollTo(0,0);
      if(JSON.parse(localStorage.getItem('current_user')).role.name=="super admin")
      {
                this.isadmin=true; 
      }
    }
    catch(e)
    {

    }

    this.route.params.subscribe(params => {
      this.searchtxt=params['search'];
      this.id=params['id'];
      this.type=params['type'];
    });
    var self = this;
   $('audio')[0].onpause = function() {
      self.setindex();
    };
    $('audio')[0].onplay = function() {
      self.set2();
    };
    if(this.searchtxt==null || this.searchtxt==''){

      this.saveurl='';
	
      this.saveurl="featured-api/save-prior-podmedia?categories="+this.id;
     
       // var url="media/podcast-list";
       this.url="media/resource-category-podmedia-new/"+this.id; 
      //  if(this.id!=''){
      //       //url="media/podcast-subcategory-media/"+this.id;
      //       url="media/resource-subcategory-podmedia-new/"+this.id;
      //   }
      if(this.type=="2"){
        //url="media/podcast-subcategory-media/"+this.id;
        this.url="media/resource-subcategory-podmedia-new/"+this.id;
        this.saveurl="featured-api/save-prior-podmedia?subcategories="+this.id;
      }
        this.rs.get(this.url).subscribe((res) => {
          //if(this.id!='')
          if(this.type=="2")
          {
            this.podcastlist=res.subcategory_media;
            res.subcategory_media.forEach((e,index)=>{
              if(e.priority_order_status == 0){
                e.priority_order_status= res.subcategory_media.length+5;
                //this.podcastlist[index].priority_order_status == this.podcastlist.length + 1;
              }

              this.podcastlist2.push(e);
            })
            // for(var index in this.podcastlist)
            // {
            //   if(this.podcastlist[index].priority_order_status == 0){
            //     this.podcastlist[index].priority_order_status == this.podcastlist.length + 1;
            //   }
            // }
          }
          else{
             this.podcastlist=res.result;
            this.podcastlist.forEach((e,index)=>{
              if(e.priority_order_status == 0){
                e.priority_order_status = this.podcastlist.length+5;
                //this.podcastlist[index].priority_order_status == this.podcastlist.length + 1;
              }

              this.podcastlist2.push(e);
            })
          }

          
          this.podcastlist2.sort(function (a, b) {
            
            return a.priority_order_status - b.priority_order_status;
          });


          for(var i=0;i<this.podcastlist.length;i++)
          {
                if(this.podcastlist[i].priority_order_status!=0 && this.podcastlist[i].priority_order_status!= this.podcastlist.length+5)
                {
                   this.mediaObjects.push({id:this.podcastlist[i].id,value:this.podcastlist[i].title,display:this.podcastlist[i].title,sort:this.podcastlist[i].priority_order_status});   
                }
                this.mediaList2.push({id:this.podcastlist[i].id,value:this.podcastlist[i].title});
                this.mediaList2=this.mediaList2.sort((a,b)=> {return a.value.localeCompare(b.value)})
          }
          this.mediaObjects.sort(function (a, b) {
                    return a.sort - b.sort;
                  });

          this.loader=false;
          this.ref.detectChanges();
          setTimeout(()=>{
              this.ref.detectChanges();
          },50);
        }, (error) =>{
          console.log(error);
          this.loader=false;
        });
    }
    else{

     $("#search").val(this.searchtxt);
        this.search2();
    }
  }
  //follows=["arun","sham","suraj","ram","sham","amit","mohit","rohit"]
  openModal()
  {
    $("#exampleModalCenter").modal('show');
  }



  hidemodal()
    {
        this.modalService.dismissAll();
	  }
	successmsg;
	success=false;
	err=false;
	//saveurl;
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
        //this.get();
        this.podcastlist=[];
        this.mediaList2=[];
        this.mediaObjects=[];
        this.rs.get(this.url).subscribe((res) => {
          //if(this.id!='')
          if(this.type=="2")
          {
            this.podcastlist=res.subcategory_media;
          }
          else{
             this.podcastlist=res.category_podmedia;
          }

          this.podcastlist.sort(function (a, b) {
            return a.priority_order_status - b.priority_order_status;
          });


          for(var i=0;i<this.podcastlist.length;i++)
          {
                if(this.podcastlist[i].priority_order_status!=0)
                {
                   this.mediaObjects.push({id:this.podcastlist[i].id,value:this.podcastlist[i].title,display:this.podcastlist[i].title,sort:this.podcastlist[i].priority_order_status});   
                }
                this.mediaList2.push({id:this.podcastlist[i].id,value:this.podcastlist[i].title});
                this.mediaList2=this.mediaList2.sort((a,b)=> {return a.value.localeCompare(b.value)})
          }
          this.mediaObjects.sort(function (a, b) {
                    return a.sort - b.sort;
                  });

          this.loader=false;

          this.ref.detectChanges();
        }, (error) =>{
          console.log(error);
          this.loader=false;
        });
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
