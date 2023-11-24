import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcesService } from 'src/app/services/resources.services';
declare var $;

@Component({
  selector: 'app-podcastsubcategory',
  templateUrl: './podcastsubcategory.component.html',
  styleUrls: ['./podcastsubcategory.component.scss']
})
export class PodcastsubcategoryComponent implements OnInit {
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


	featuredSubCategoriesList = [];
  loader=true;
  ngOnInit() {
	  // $("#resources").addClass("active");
    //    this.sub = this.route.params.subscribe(params => {
	  //   this.title=params['title'];
		// this.id = params['id'];
	  // });
	  // this.rs.get("categories/sub-categories/"+this.id)
		// .subscribe((res) => {
			

			

		// 	this.featuredSubCategoriesList=res['featured_sub_categories'];
		// 	this.loader=false;
		// }, (error) =>{
		// 	console.log(error);
    // });
    this.featuredSubCategoriesList=JSON.parse(localStorage.getItem("list"));
    this.title=localStorage.getItem("title");
  }
  artistClick(x)
	  {
      //,this.featuredSubCategoriesList[x].name,this.featuredSubCategoriesList[x].id
      this.router.navigate([ '/podcastlist',this.featuredSubCategoriesList[x].id,'','2']);
		
	  }

}
