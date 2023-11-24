import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { OwlCarousel } from 'ngx-owl-carousel';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';

declare var $;
declare var DeviceUUID;
import Swal from 'sweetalert2';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe]
})

export class HomeComponent implements OnInit {

	email=''; podcastTodayAutherName: any;

  submit(){
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    if($("#email").val()!=''){
      if(!regex.test($("#email").val())){
       Swal.fire('','Input valid email','info');
        return;
      }
          let url=new URLSearchParams();
          url.set("email",$("#email").val());
          this.rs.post("media/subs",url).subscribe((res)=>{
              if(res.status=="200") {
                  Swal.fire('', 'subscribed successfully', 'success');
              } else {
                Swal.fire('Oops...', res.message, 'error');
              }
          },(err)=>{
             console.log(err);
          });
     }
     else{
       Swal.fire('','Enter email','info');
     }

  }

  constructor(private _event: EventService,private rs:ResourcesService,private router:Router,private datePipe: DatePipe,private userService:UserService, private httpservice: HttpService) { }


  	F_podcast : any = {
		margin:10,
		dots: false,
		nav: true,
		loop: true,
		items: 3,
		autoplay:true,
    	//autoplayTimeout:3000,
    	autoplayHoverPause:true,
    	autoplayTimeout: 4000,
    	smartSpeed: 2000,
    	animateIn: 'linear',
    	animateOut: 'linear',
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

	archive_options : any = {
		margin:12,
		dots: false,
		nav: true,
		items: 4,
		navText: [ '<i class="fas fa-chevron-right fa-flip-both" style="color:white"></i>', '<i class="fas fa-chevron-right"  style="color:white"></i>' ],
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
			items: 4,
		}
		}
	}

	Options : any = {
		margin:20,
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
			items: 6,
		  }
		},
		onInitialized: function(){
			var div = $('.box');
			var width = div.width();
			div.css('height', width);

			var div2 = $('.box2');
			var width2 = div2.width();
			div2.css('height', width2);
		},
		onResized: function(){
			var div = $('.box');
			var width = div.width();
			div.css('height', width);

			var div2 = $('.box2');
			var width2 = div2.width();
			div2.css('height', width2);
		},
	  }


	podcastTodaySrc;

	goShabadADay(commnetry_id, page_id){
		this.router.navigate(['commentary/'+page_id+'/'+commnetry_id]);
	}
	  
	restrat(val, lang){

		//$("#player").hide();
		//$("#player audio")[0].pause();

		$("#player").show();
		$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.title+"</marquee>");

		  if (lang == 'e'){
			$("#player audio")[0].src = this.englishPodcastSrc;
		  }else if(lang =='p'){
			  $("#player audio")[0].src = this.punjabiPodcardSrc;
		  }else{
			  $("#player audio")[0].src = this.podcastTodaySrc;
		  }


		//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"//"http://103.246.184.34:8000/jak";
		
		// Add singer name and title
		localStorage.setItem('playerTitle', this.title);
		localStorage.setItem('singerName', this.podcastTodayAutherName);
		
		let data = [];
		this._event.fire('showSingerName', data);
		// Add singer name and title
		
		  if (lang == 'e') {
			  $("#srcforsong").html(this.englishPodcastSrc);
		  } else if (lang == 'p') {
			  $("#srcforsong").html(this.punjabiPodcardSrc);
		  } else {
			  $("#srcforsong").html(this.podcastTodaySrc);
		  }
		
			$("#setsrc").click();
			$("#playSong").click();
			
		//$("#player audio")[0].play();
		
	}


		podcast(x){

			$("#player").show();
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.featuredObjects[x].value+"</marquee>");
			$("#player audio")[0].src=this.featuredObjects[x].media;//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"//"http://103.246.184.34:8000/jak";
			// Add singer name and title
			localStorage.setItem('playerTitle', this.featuredObjects[x].value);
			localStorage.setItem('singerName', this.featuredObjects[x].author_name);
			let data = [];
			this._event.fire('showSingerName', data);
			// Add singer name and title
			
			$("#srcforsong").html(this.featuredObjects[x].media);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();
			
		}

	mydate=new Date();
	mydt;
		restratarchive(x)
		{

			//$("#player").hide();
		    //$("#player audio")[0].pause();
			$("#player").show();
			$("#mq").html("<marquee behavior='scroll' class='text' direction='left'>"+this.archivelist[x].title+"</marquee>");
			$("#player audio")[0].src=this.archivelist[x].attachment_name;//"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"//"http://103.246.184.34:8000/jak";
			// Add singer name and title
			localStorage.setItem('playerTitle', this.archivelist[x].title);
			localStorage.setItem('singerName', this.archivelist[x].author_name);
			let data = [];
			this._event.fire('showSingerName', data);
			// Add singer name and title
			
			$("#srcforsong").html(this.archivelist[x].attachment_name);
			$("#setsrc").click();
			$("#playSong").click();
			//$("#player audio")[0].play();
			var machine_id = this._event.getMachinId(); 
			this.mydt = this.datePipe.transform(this.mydate, 'yyyy-MM-dd');
			var mediaid=this.archivelist[x].id;
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

		categoryclick(x){
		
			localStorage.setItem("title",this.categoriesObjects[x].value);
				  
			if(this.categoriesObjects[x].podcast_subcats.length==0)
			{
                 this.router.navigate(['podcastlist',this.categoriesObjects[x].id,'','1']);
			}
			else{
				  localStorage.setItem("list",JSON.stringify(this.categoriesObjects[x].podcast_subcats)); 
				  localStorage.setItem("title",this.categoriesObjects[x].value);
				  this.router.navigate(['podcastsubcategory']); 
			}
		}

		searchval;
		search(){
			var search = $("#search_val").val();
			this.router.navigate(['/podcastlist','',search]);
		}

		onKeydownEvent(event: KeyboardEvent): void {
			if (event.keyCode === 13) {
			  this.search();
			}
		  }
		title;

	categoriesObjects=[];

	featuredObjects=[];
	time="00:50:28";
	
	archivelist=[];

	dateObj

	@ViewChild('owlElement',null) owlElement: OwlCarousel
	
	ngAfterViewInit(): void {
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.
		// var div = $('.box');
		// var width = div.width();
		// div.css('height', width);
		
		// var div2 = $('.box2');
		// var width2 = div2.width();
		// div2.css('height', width2);
		
	}
	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		
	//$("app-header").show();
	}
	send(val)
	{
     window.location.href=val;
	}

	setSelected(id)
	{			
		$(".active1").removeClass("active1");
		 $("#"+id).addClass("active1");
	}
	commentary_status=false;
	commentary; desc= '';

	englishPodcastSrc : any;
	punjabiPodcardSrc: any;

	shabad_id: any; shabad_page_id: any;

	//desc='In this episode,Chetandeep Singh present his understanding of the shabad "bisr gai sabh tai parai" ( ਬਿਸਰਿ ਗਈ <br _ngcontent-jgt-c29="">ਸਭ ਤਾਤ&zwj;ਿ ਪਰਾਈ) followed by a discussion and Q&amp;A with the panelists of Khoj Gurbani';
  ngOnInit() {

	document.getElementById("main2").scrollTo(0,0);

	this.setSelected("home");
	
	  this.rs.get("media/podcast-index?time=1234567890" ).subscribe((res) => {

		if(res.result.length==0){
			this.podcastTodaySrc="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
			this.englishPodcastSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
			this.punjabiPodcardSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
			this.time="00:6:00";
			this.title="Bisar gai sabh tai parai ( ਬਿਸਰਿ ਗਈ ਸਭ ਤਾਤ‍ਿ ਪਰਾਈ)";
			this.podcastTodayAutherName = '';
			this.shabad_id = 1;
			this.shabad_page_id = 1;
		} else {
			let titleString = res.result[0].title;
			let titleEnglish = titleString.replace(/English/g, "");
			let titlePunjabi = titleEnglish.replace(/Punjabi/g, "")
			this.title = titlePunjabi;
			
			this.podcastTodaySrc = res.result[0].media_data;
			
			this.shabad_id = res.result[0].ShabadID;
			this.shabad_page_id = res.result[0].page_id;

			this.englishPodcastSrc = res.result[0].englishPodcastSrc;
			this.punjabiPodcardSrc = res.result[0].punjabiPodcardSrc;
			
			this.time=res.result[0].time;
			this.dateObj= res.result[0].created_at;
			this.time=res.result[0].duration;
			this.desc=res.result[0].description;

			this.commentary_status=res.result[0].commentry_status;
			this.podcastTodayAutherName = res.result[0].author_name;

			if(this.commentary_status) {
				this.commentary=res.result[0].commentry_desc;
			}
		}
	}, (error) =>{
		console.log(error);
	});

	this.rs.get("media/archive-latest").subscribe((res) => {
		this.archivelist=res.result;
		this.archivelist=this.archivelist.filter((item)=> item.status == 1);
		for(var i=0;i<this.archivelist.length;i++)
		{
			this.archivelist[i].thumbnail= this.httpservice.getAPI() + "uploads/thumbnail/"+this.archivelist[i].thumbnail;
		}

		var val=Math.ceil(this.archivelist.length/4);
			for(var i=0;i<val;i++){
				var arr=[];
				for(var k=(i*4);k<((i+1)*4);k++){
					arr.push(this.archivelist[k]);
				}
				arr=arr.filter((x)=>x!=undefined);
				this.archivelength.push(arr);
			}
	}, (error) =>{
		console.log(error);
	});

        this.rs.get("featured-api/podcast-listing").subscribe((res) => {
			
			var cat_result=res.result.cat_result;
			var media_result=res.result.media_result;

			for(var i=0;i<cat_result.length;i++){
				if(cat_result[i].featured!=0) {
					this.categoriesObjects.push({id:cat_result[i].id,value:cat_result[i].title,sort:cat_result[i].featured_display_order,category_image:cat_result[i].category_image,podcast_subcats:cat_result[i].podcast_subcats,description: cat_result[i].description});   
				}
			}
			
			for(var i=0;i<media_result.length;i++){
				if(media_result[i].featured!=0){
					this.featuredObjects.push({id:media_result[i].id,value:media_result[i].title,sort:media_result[i].featured_display_order,media:media_result[i].media,thumbnail:media_result[i].thumbnail, author_name: media_result[i].author_name });   
				}
			
			}
			
			this.categoriesObjects.sort(function (a, b) {
				return a.sort - b.sort;
			});
			
			this.featuredObjects.sort(function (a, b) {
				return a.sort - b.sort;
			});

		//   this.featuredObjects.forEach((e)=>{
		// 	  this.featuredObjects.push(e);
		//   })

			var val=Math.ceil(this.featuredObjects.length/3);
			for(var i=0;i<val;i++){
				var arr=[];
				for(var k=(i*3);k<((i+1)*3);k++){
					arr.push(this.featuredObjects[k]);
				}

				arr=arr.filter((x)=>x!=undefined);
				this.featuredlength.push(arr);
			}
		}, (error) =>{
			console.log(error);
		});
  }

  	featuredlength=[];
	archivelength=[];
}
