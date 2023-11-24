import { Component, OnInit, TemplateRef } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ResourcesService } from 'src/app/services/resources.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';
import { URLS } from 'src/app/config/urls.config';
import { environment } from 'src/environments/environment.prod';
import { LoadingBarService } from '@ngx-loading-bar/core';
 
@Component({
  selector: 'app-blogsearch',
  templateUrl: './blogsearch.component.html',
  styleUrls: ['./blogsearch.component.scss']
})
export class BlogsearchComponent implements OnInit {

	modalRef: BsModalRef;
	blogData = null;
	blogs: Array<any> = [];
	latestBlogs: Array<any> = [];
	blogPagination: object = {
		page: 1,
		limit: 9
	}
	currentPage: number = 1;

	isGetBlogsApiRunning: Boolean = false;
	isGetLatestBlogsApiRunning: Boolean = false;
  search;
	constructor(
		private _http: HttpService,
		private _activeRoute: ActivatedRoute,
		private _router: Router,
		private _modalService: BsModalService,
		private _user: UserService,
		private rs:ResourcesService,
    private modalService: NgbModal,
    private loadingBar:LoadingBarService
		) {
		this._activeRoute.queryParams.subscribe(qParam => {
			this._activeRoute.params.subscribe((params) => {
           this.search = params.id;
           $("#search_val").val(this.search);
           this.getBlogs();
          });
      	});
	}

	err=false;
	success=false;
	successmsg;
	
edit(loader,blog, template: TemplateRef<any>){
	this.blogData = blog;
	this.modalRef = this._modalService.show(template, { class: 'modal-lg', ignoreBackdropClick: true });
}
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
				this.getBlogs2();
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
  
	isadmin=false;
	setSelected(id)
		{			
			$(".active1").removeClass("active1");
			 $("#"+id).addClass("active1");
    }
    breadcrumlist=[];
    change(path)
    {
     this._router.navigate([path]);
    }
    ngOnInit() {
    
        this.breadcrumlist=[
          {name:"Blog",path:"/blog"}
        ]
  
		this.setSelected("blog");
		//this.getLatestBlogs();
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


	onKeydownEvent(event: KeyboardEvent): void {
		if (event.keyCode === 13) {
			if(this.search.length==0){
				return;
      }
     // this.getBlogs();
		  this._router.navigate(['/blogsearch',this.search]);
		}
	  }
	getBlogs() {

    this.loadingBar.start();
		this.isGetBlogsApiRunning = true;

		let url = URLS.blogs;

		let params = {
			page: this.blogPagination['page'],
			is_approved: 1,
			limit: this.blogPagination['limit'],
			paginate: 1
		}
    var param=new URLSearchParams();
     param.set("search_keyword",this.search);
    //{{ httpservice.getAPI() }}api/v1/blogs-search?search_keyword=a
		this.rs.post("blogs-search",param).pipe()
		.subscribe((res) => {
			let result = res;

			if (result.data.length == 0) {
				this.isGetBlogsApiRunning = false;
				this.loadingBar.complete();
				return;
			}

			this.blogs=result.data;
			this.blogs.forEach((blog) => {
				if (blog['image']) {
					blog['image_url'] = environment.BACKEND_URL + "/uploads/media/medium/" + blog['image'];
				}
			});

			// this.blogPagination['total_items'] = result.total;
			// this.currentPage = result.current_page;

      this.isGetBlogsApiRunning = false;
      
      this.loadingBar.complete();
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
			paginate: 1
		}

		this._http.get(url, params)
		.subscribe((res) => {
			let result = res.data;

			if (result.data.length == 0) {
				this.isGetBlogsApiRunning = false;
				return;
			}

			this.blogs=result.data;
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
			paginate: 1,
			limit: 3,
			is_approved: 1,
		}

		this._http.get(url, params).pipe()
		.subscribe((res) => {
			let result = res.data;

			if (result.data.length == 0) {
				this.isGetLatestBlogsApiRunning = false;
				return;
			}

			this.latestBlogs = result.data;

      setTimeout(() => {
        
			this.isGetLatestBlogsApiRunning = false;

      }, 1000);
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
