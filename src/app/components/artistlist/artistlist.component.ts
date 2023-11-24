import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcesService } from 'src/app/services/resources.services';
declare var $;
@Component({
  selector: 'app-artistlist',
  templateUrl: './artistlist.component.html',
  styleUrls: ['./artistlist.component.scss']
})
export class ArtistlistComponent implements OnInit {

  constructor(private rs:ResourcesService,private route:ActivatedRoute,private router:Router) { }

  sub;
  id;
  title;


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


	//   restrat()
	// {
	// 	$("#player").show();
	// 	$("audio")[0].src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    //     $("audio")[0].play();
	// }
	featuredSubCategoriesList = [];
loader=true;
change(path)
{
   this.router.navigate([path]);
}
breadcrumlist=[];
  ngOnInit() {
	document.getElementById("main2").scrollTo(0,0);
	  this.breadcrumlist=[{name:"Media",path:"/resources"}
	]
	  $("#resources").addClass("active");
       this.sub = this.route.params.subscribe(params => {
	    this.title=params['title'];
		this.id = params['id'];
	  });
	  this.rs.get("categories/sub-categories/"+this.id)
		.subscribe((res) => {
			this.featuredSubCategoriesList=res['featured_sub_categories'];
			this.loader=false;
		}, (error) =>{
			console.log(error);
		});
  }
  artistClick(x)
	  {
			this.router.navigate([ '/gurbanilist',this.featuredSubCategoriesList[x].name,this.featuredSubCategoriesList[x].id,"1",this.id,this.title]);
		
	  }

}
