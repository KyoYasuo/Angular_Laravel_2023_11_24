import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcesService } from 'src/app/services/resources.services';
declare var $;
declare var DeviceUUID;
import { DatePipe, Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { saveAs } from 'file-saver';
import { HttpService } from 'src/app/services/http.service';
import { ResponseContentType } from '@angular/http';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-artistgurbanilist',
  templateUrl: './artistgurbanilist.component.html',
  styleUrls: ['./artistgurbanilist.component.scss'],
  providers: [DatePipe]
})
export class ArtistgurbanilistComponent implements OnInit {
 
  constructor( private _event: EventService, private _user: UserService,private route:ActivatedRoute,private router:Router,private rs:ResourcesService,private ref:ChangeDetectorRef,
    private datePipe: DatePipe,private userService:UserService,private http:HttpService, private httpservice:HttpService, private location: Location ) { }

  sub;
  id;
  gurbanilist=[];
  index=-1;
  previndex=-1;
  title;
  mydate=new Date();
	mydt;
  loader=true;
  artistimg;
  artistdesc;
  currentPlaying = -1;
  hasTwoLine = false;
  validateAction(action) {
    let flag = this._user.isUserValidateForThisAction(action);

    return flag;
}
  download(x,id)
  {
    var v2=x.split("/");
    var mytitle=v2[v2.length-1].split(".")[0];
    saveAs(this.httpservice.getAPI() + "api/v1/media/download?media_id="+id,mytitle);
    
   // this.downloadapi("{{ httpservice.getAPI() }}api/v1/media/download?media_id="+id,mytitle);
    // return this.http
    // .get("media/download?media_id="+id, {
    //   responseType: ResponseContentType.Blob,
    // })
    // .map(res => {
    //   return {
    //     filename: mytitle,
    //     data: res.blob()
    //   };
    // })
    // .subscribe(res => {
    //     var url = window.URL.createObjectURL(res.data);
    //     var a = document.createElement('a');
    //     document.body.appendChild(a);
    //     a.setAttribute('style', 'display: none');
    //     a.href = url;
    //     a.download = res.filename;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove(); // remove the element
    //   }, error => {
    //   });
  }
  playerPauseEvent() {
		this.setindex();
	};
	playerPlayEvent() {
		this.set2();
	};
  wrap(text) {
    if(text.includes('(')) {
      this.hasTwoLine = true;
    }
    return text.replace('(', '<br />(');
  }
  restrat2(x){
    this.currentPlaying = x;
    if(this.index==x)
    {

        // this.previndex=-1;
        //$("#player audio")[0].pause();
        $("#pauseSong").click();
    }
    else if(x==this.previndex)
    {
      this.index=x;
      //$("#player audio")[0].play();
      $("#player").show();
      $("#playSong").click();
    }
    else{
			
				localStorage.setItem('playerTitle', this.gurbanilist[x].title);
				localStorage.setItem('singerName', this.gurbanilist[x].author_name);
				let data = [];
				this._event.fire('showSingerName', data);
				
		          		this.previndex=this.index;
                  this.index=x;
                  this.previndex=x;
                  $("#player").show();
                  $("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.gurbanilist[x].title+"</marquee>");
                  $("#player audio")[0].src=this.gurbanilist[x].attachment_name;//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
                  
                  $("#srcforsong").html(this.gurbanilist[x].attachment_name);
                  $("#setsrc").click();
                  $("#playSong").click();
                  //$("#player audio")[0].play();
                  var machine_id = this._event.getMachinId(); 
									this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
									var mediaid=this.gurbanilist[x].id;
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
    this.previndex=this.index;
    this.index = -1;
    this.ref.detectChanges();
  }
  set2()
  {
    this.index=this.previndex;
  }
  urlid;
  available=true;
  msgerr="Something went wrong";
  breadcrumlist=[];

  change(path){
	    
      if(path == '/artistfulllist'){ 
        this.location.back();
      }else{  
        this.router.navigate([path]);
      } 
     
  }

  ngOnInit() {
    let timestamp = Math.floor((new Date()).getTime() / 1000);
		let old_timestamp = localStorage.getItem('timestamp');
		let flag = true;
		if(old_timestamp) {
			let diff = timestamp - parseInt(old_timestamp);
			if(diff>86400) {
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

		this.breadcrumlist=[{name:"Media",path:"/resources"}, {name:"Ragi Directory", path:"/artistfulllist"} ]

			document.getElementById("main2").scrollTo(0,0);
    //$.createEventCapturing(['play']);  
    // $('audio').on('playing', function() { 
    //   //  this.set2();
    // });
    var self = this;
   $('audio')[0].onpause = function() {
      // self.setindex();
    };
    $('audio')[0].onplay = function() {
      self.set2();
    };
  
    this.sub = this.route.params.subscribe(params => {
      this.title=params['title'];
      this.id=params['id'];
      //this.urlid=params['urlid'];
    });
    
    var url;
    url="media/featured-artist-gurbani/";
    this.rs.get(url+this.id)
		.subscribe((res) => {
      this.gurbanilist=res.result;
      this.gurbanilist=this.gurbanilist.filter((item)=> !item.attachment_name.toString().match(/youtube\.com/) )
      
      this.loader=false;
		}, (error) =>{
      console.log(error);

      this.loader=false;
      this.msgerr=error;
      
		});
	
  }

}
