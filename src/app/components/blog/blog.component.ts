import { Component, OnInit, TemplateRef } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { HttpService } from './../../services/http.service';
import { UserService } from './../../services/user.service';
import { URLS } from './../../config/urls.config';
import { environment } from './../../../environments/environment';
import { ResourcesService } from 'src/app/services/resources.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
 

@Component({
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
	arr=[['a','A'],['b','B'],['c','C'],['d','D'],['e','E'],['f','F'],['g','G'],['h','H'],['i','I'],['j','J'],['k','K'],['l','L'],['m','M'],['n','N'],['o','O'],['p','P'],['q','Q'],['r','R'],['s','S'],['t','T'],['u','U'],['v','V'],['w','W'],['x','X'],['y','Y'],['z','Z']];
	arr2=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	list = [];

	artistlist={};
  loader=true;
  available=true;
  msgerr;
  valarr=[];
  firsttitle="A";
   indexItem = '0';
  secondtitle="B";
  firstarr=[];
  secondarr=[];
  clicked(i,index)
  { 
     this.indexItem = index;
     this.firsttitle=i;
     this.secondtitle=this.arr2[index+1];

     this.firstarr=this.artistlist[i];
     this.secondarr=this.artistlist[this.secondtitle];

     try{
		//  $('html,body').animate({
		//   scrollTop: $("#"+index).offset().top},
		//   'slow');
		$("#"+i)[0].scrollIntoView(true);
		document.getElementById("main2").scrollTop -= 100;
     }
     catch(e)
     {

     }
  }

	modalRef: BsModalRef;
	blogData: any = null;

	blogs: Array<any> = [];
	latestBlogs: Array<any> = [];
	blogPagination: object = {
		page: 1,
		limit: 9
	}
	currentPage: number = 1;

	isGetBlogsApiRunning: Boolean = false;
	isGetLatestBlogsApiRunning: Boolean = false;

	onKeydownEvent(event: KeyboardEvent): void {
		if (event.keyCode === 13) {
			if($("#search_val").val().toString().length==0){
				return;
			}
		  this._router.navigate(['/blogsearch',$("#search_val").val()]);
		}
	  }
	constructor(
		private _http: HttpService,
		private _activeRoute: ActivatedRoute,
		private _router: Router,
		private _modalService: BsModalService,
		private _user: UserService,
		private rs:ResourcesService,
		private modalService: NgbModal
		) {
		this._activeRoute.queryParams.subscribe(qParam => {
			if (qParam['page']) {
        		this.blogPagination['page'] = qParam['page'];
			}
        	this.getBlogs();
      	});
	}

	
	featuredArtistsClicked(x,i){
		// if(i==0){
		//   this.router.navigate(['artistgurbanilist',this.firstarr[x].id,this.firstarr[x].name]);
		// }
		// else{
			//   this.router.navigate(['artistgurbanilist',this.secondarr[x].id,this.secondarr[x].name]);
		// }
		this._router.navigate(['artistgurbanilist',x.id,x.name]);
		
	}

	err=false;
	success=false;
	successmsg;
	delete(loader,id)
  {
      if(confirm("Are you sure to delete "+id)) {
        this.modalService.open(loader, { centered: true,windowClass: 'dark-modal',backdrop:'static' });
		
        var url="blog-delete/"+id;
        this.rs
        .get(url
        ).subscribe((data: any) => {
		 
			this.modalService.dismissAll();
			if(data.status=="success")
			{
				this.err=false;
                this.success=true;
				this.successmsg=data.message;
				this.getBlogs();
			}
			else{
				this.err=true;
                this.success=false;
                this.successmsg="something went wrong";
			}
          //this.updatedatatable();
        },(err)=>{

			this.modalService.dismissAll();
               this.err=true;
                this.success=false;
                this.successmsg="something went wrong";

//          this.updatedatatable();
        });
  
   }
}
edit(loader,blog, template: TemplateRef<any>){
	this.blogData = blog;
	
	this.modalRef = this._modalService.show(template, { class: 'modal-lg', ignoreBackdropClick: true });
}
  
	isadmin=false;
	setSelected(id)
		{			
			$(".active1").removeClass("active1");
			 $("#"+id).addClass("active1");
		}
	ngOnInit() {
		this.setSelected("blog");
		this.getLatestBlogs();
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
	}

	getBlogs() {

		this.isGetBlogsApiRunning = true;

		let url = URLS.blogs;

		let params = {
			page: this.blogPagination['page'],
			is_approved: 1,
			limit: this.blogPagination['limit'],
			//paginate: 1
		}

		this._http.get(url, params)
		.subscribe((res) => {
			let result = res.data;

			if (result.length == 0) {
				this.isGetBlogsApiRunning = false;
				return;
			}

			//this.blogs=this.blogs.concat(result.data);
			this.blogs=result;
			this.blogs.forEach((blog) => {
				if (blog['image']) {
					blog['image_url'] = environment.BACKEND_URL + "/uploads/media/medium/" + blog['image'];
				}
			});
			this.valarr = [];
			this.artistlist = [];
			for(var i=0;i<this.arr.length;i++)
           {
              var val=this.blogs.filter((x)=> x.news_title.trim().toString().charAt(0) == this.arr[i][0] || x.news_title.trim().toString().charAt(0) == this.arr[i][1])
              //val=val.filter((x)=>x.status==1);
              if(val.length!=0){  
				this.valarr.push(this.arr[i][1]);
				val.sort(function(a, b) {
					var textA = a.news_title.toUpperCase();
					var textB = b.news_title.toUpperCase();
					return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				});
                this.artistlist[this.arr[i][1]]=val;
              }
		   }
		   

			this.blogPagination['total_items'] = result.total;
			this.currentPage = result.current_page;

			this.isGetBlogsApiRunning = false;
		}, (error) =>{
			console.log(error);
			this.isGetBlogsApiRunning = false;
		});
	}


	getBlogs2() {

		this.isGetBlogsApiRunning = true;

		let url = URLS.blogs;

		let params = {
			page: this.blogPagination['page'],
			is_approved: 1,
			limit: this.blogPagination['limit'],
			//paginate: 1
		}

		this._http.get(url, params)
		.subscribe((res) => {
			let result = res.data;

			
			if (result.length == 0) {
				this.isGetBlogsApiRunning = false;
				return;
			}
			this.blogs=result;
			this.blogs.forEach((blog) => {
				if (blog['image']) {
					blog['image_url'] = environment.BACKEND_URL + "/uploads/media/medium/" + blog['image'];
				}
			});

			this.blogPagination['total_items'] = result.total;
			this.currentPage = result.current_page;

			this.isGetBlogsApiRunning = false;
		}, (error) =>{
			console.log(error);
			this.isGetBlogsApiRunning = false;
		});
	}

	getLatestBlogs() {

		this.isGetLatestBlogsApiRunning = true;

		let url = '/blogs'
		let params = {
			//paginate: 1,
			limit: 3,
			is_approved: 1,
		}

		this._http.get(url, params)
		.subscribe((res) => {
			let result = res.data;

			if (result.length == 0) {
				this.isGetLatestBlogsApiRunning = false;
				return;
			}

			this.latestBlogs = result;

			this.isGetLatestBlogsApiRunning = false;

		}, (error) =>{
			console.log(error);
			this.isGetLatestBlogsApiRunning = false;
		});
	}

	fixShortDesc(txt){
		return txt.replace(/&nbsp;/g," ");
	}

	pageChanged(event) {
		//this._router.navigate(['blog'], { queryParams: { page: event.page } });
		this.currentPage++;
		this.blogPagination['page'] = this.currentPage;
		this.getBlogs();
		//this._router.navigate(['blog'], { queryParams: { page: this.currentPage } });
	}
	pageChanged2(event) {
		//this._router.navigate(['blog'], { queryParams: { page: event.page } });
		this.currentPage++;
		this.blogPagination['page'] = this.currentPage;
		this.getBlogs();
		//this._router.navigate(['blog'], { queryParams: { page: this.currentPage } });
	}

	openAddBlogPopup(template: TemplateRef<any>) {
		this.blogData = null;
		this.modalRef = this._modalService.show(template, { class: 'modal-lg', ignoreBackdropClick: true });
	}

	
	addBlog(blog) {
		this.getBlogs();
		this.getLatestBlogs();
	}

	validateAction(action) {
	  	let flag = this._user.isUserValidateForThisAction(action);

	  	return flag;
	}
}
