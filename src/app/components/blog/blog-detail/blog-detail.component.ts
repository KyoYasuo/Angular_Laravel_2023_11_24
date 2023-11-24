import { Component, OnInit, TemplateRef } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { HttpService } from './../../../services/http.service';
import { UserService } from './../../../services/user.service';
import { USER_ROLES_IDS } from './../../../config/user.config';
import { URLS } from './../../../config/urls.config';
import { environment } from './../../../../environments/environment';
import { BsModalService } from 'ngx-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from 'src/app/services/resources.services';
declare var moment;
import Swal from 'sweetalert2';

@Component({
	selector: 'app-blog-detail',
	templateUrl: './blog-detail.component.html',
	styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
	modalRef;
	onUpdatePost(template: TemplateRef<any>) {
		this.modalRef = this._modalService.show(template, { class: 'modal-lg', ignoreBackdropClick: true });
	}
	
	addBlog(blog) { 
	}

	blogData: any = null;
	blogId: number;
	blog: object = {};
	latestBlogs: Array<any> = [];
	isGetBlogDetailApiRunning: Boolean = false;
	isGetLatestBlogsApiRunning: Boolean = false;

	user: object = {};
	userRoles: object = USER_ROLES_IDS;

	addCommentForm: FormGroup;
	commentSubmitted: boolean = false;
	addCommentAPIRunnning: boolean = false;
        userdata :any;
        userAdmin: any;
	constructor(
		private _http: HttpService,
		private _activeRoute: ActivatedRoute,
		private _modalService:BsModalService,
		private _router: Router,
		private _user: UserService,
		private _formBuilder: FormBuilder,private modalService:NgbModal,private rs:ResourcesService) {
		this._activeRoute.params.subscribe((params) => {
			this.blogId = params.id;
			this.getBlogDetail();
      	});
	}
	breadcrumlist=[];
	change(path)
  {
	 this._router.navigate([path]);
  }
  
edit(loader,blog, template: TemplateRef<any>){
	this.blogData = blog;
	this.modalRef = this._modalService.show(template, { class: 'modal-lg', ignoreBackdropClick: true });
}
  delete(loader,id)
  {
        this.modalService.open(loader, { centered: true,windowClass: 'dark-modal',backdrop:'static' });
		
        var url="blog-delete/"+id;
        this.rs
        .get(url
        ).subscribe((data: any) => {
		 
			this.modalService.dismissAll();
			this._router.navigate(['my-account/posts']);
        },(err)=>{

			this.modalService.dismissAll();
this.getBlogDetail();
        });
  
   }
  approve(id,val,loader)
	{
		this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
		
		var param=new URLSearchParams();
		
		param.set("media_id",id);
		param.set("status",val);
		this.rs.post("blogs-approval",param).subscribe((res)=>{
			this.modalService.dismissAll();
			this.getBlogDetail();
		},(err)=>{
			this.modalService.dismissAll();
			this.getBlogDetail();
		})
	}

	onClickLatestPost(){
		document.getElementById("main2").scrollTo(0,0);
	}
	
	
	ngOnInit() {
  
		  this.breadcrumlist=[
			  {name:"Glossary",path:"/blog"}
		  ]
		this.getLatestBlogs();
                let user_123 = JSON.parse(window.localStorage.getItem("current_user"));
                if(user_123){
                    
                    if(user_123.role_id == '4'){
                        this.userdata = true
                    }else{
                        this.userdata = false
                    }
                }else{
                    this.userdata = false
                }
                
		if (this._user.isUserLogin()) {
            this.user = this._user.getLoggedInUser();
        }

        this.addCommentForm = this._formBuilder.group({
        	comment : ['', Validators.required]
		});
		document.getElementById("main2").scrollTop = 0;
		
	}

	get f() { return this.addCommentForm.controls; }

	getBlogDetail() {
		this.isGetBlogDetailApiRunning = true;

		let url = '/blog/' + this.blogId;

		this._http.get(url)
		.subscribe((res) => {
			if (!res.data) {
				this.isGetBlogDetailApiRunning = false;
				return
			}

			
                        let comment = []
                        if(!this.userdata && this.user['role_id'] != 3 && this.user['role_id'] != 4){
                            for(let data of res.data.comments){
                                if(data.comment_approve=='1' && data.delete_approve=='0'){
                                    comment.push(data); 
                                }
                            }
                            res.data.comments = comment;
                        }else{
                            for(let data of res.data.comments){
                                if(data.delete_approve=='0'){
                                    comment.push(data); 
                                }
                            }
                            res.data.comments = comment;
                        }
						this.blog = res.data;
			if (this.blog['image']) {
				this.blog['image_url'] = environment.BACKEND_URL + "/uploads/media/" + this.blog['image'];
			}

			this.isGetBlogDetailApiRunning = false;

			/*
			setTimeout(function(){
				$('p:has(br)').css('height', '9px');
			}, 20);
			*/
			/*var arr = $("#textBlog").children();
			
			for(let w = 0; w < arr.length; w++){
				$(arr[w]).css('margin-bottom', 0);
			}*/
		}, (error) =>{
			console.log(error);
			this.isGetBlogDetailApiRunning = false;
		});
	}
	gettime(dt)
	{
		let endDate = new Date(dt*1000).toISOString();
		var purchaseDate = moment(new Date().toISOString());
		//purchaseDate=moment(purchaseDate.format("YYYY-MM-DD HH:mm:ss"))
		let diffMs = moment.duration(purchaseDate.diff(moment(endDate)));//(purchaseDate.getTime() - endDate.getTime()); // milliseconds
		let diffDays = diffMs.days();
		let diffHrs = diffMs.hours();
		let diffMins = diffMs.minutes();
		

		// let diffDays = Math.floor(diffMs / 86400000); // days
		// let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
		// let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

		if(diffDays>=1)
		{
			return diffDays+" days ago";
		}
		else if(diffHrs>=1)
		{
			return diffHrs+" hours ago";
		}
		else if(diffMins>=1)
		{
			return diffMins+" mintues ago";
		}
		else {
			return diffMs.seconds()+" seconds ago";
		}
	}
	getLatestBlogs() {
		this.isGetLatestBlogsApiRunning = true;

		let url = URLS.blogs;
		let params = {
			paginate: 1,
			limit: 3
		}

		this._http.get(url, params)
		.subscribe((res) => {
			let result = res.data;

			if (result.data.length == 0) {
				this.isGetLatestBlogsApiRunning = false;
				return;
			}

			this.latestBlogs = result.data;
			this.isGetLatestBlogsApiRunning = false;

		}, (error) =>{
			console.log(error);
			this.isGetLatestBlogsApiRunning = false;
		});
	}

	validateAction(action) {
		let flag = this._user.isUserValidateForThisAction(action);

		return flag;
	}
	hasOneOpened = false;
	editComm(comment){
		this.hasOneOpened = true;
		this.blog['comments'].forEach((comm) => {
			comm.editing = false;
		});
		comment.editing = true;
	}
	onPostEditComment(comment){
		this.addCommentAPIRunnning = true;
		this.commentSubmitted = true;

		if(!comment['comment_text'] || comment['comment_text'].trim() == ""){
			comment.error = true;
			this.addCommentAPIRunnning = false;
			return;
		}

		let params:any = {};
		let userr : any = this.user;
		params['comment_id'] = comment['comment_id'];
		params['comment_text'] = comment['comment_text'];
		params['post_id'] = this.blogId;
		params['role_id'] = userr.role_id;
		params['auto_approve'] = userr.auto_approve;
		params['message'] = params['comment'];
		let url = URLS.updatecomment;
		this._http.post(url, params)
		.subscribe((res) => {
			comment = res.data;
			this.blog['comments'].forEach((comm) => {
				comm.editing = false;
			});
			this.hasOneOpened = false;
			//this.blog['comments'] =  res.data;
			//set comment to blank
			this.addCommentForm = this._formBuilder.group({
				comment : ['', Validators.required]
			});
			this.commentSubmitted = false;
			this.addCommentAPIRunnning = false;
		}, (err) => {
			this.addCommentAPIRunnning = false;
		});
	}
	onPostComment(){
		this.addCommentAPIRunnning = true;
		this.commentSubmitted = true;

		if (this.addCommentForm.invalid) {
			this.addCommentAPIRunnning = false;
			return;
		}
                let userr : any = this.user;
                
		let params = this.addCommentForm.value;
		params['post_id'] = this.blogId;
		params['role_id'] = userr.role_id;
		params['auto_approve'] = userr.auto_approve;
		params['message'] = params['comment'];
		delete params['comment']; 
		let url = URLS.comments;
		this._http.post(url, params)
		.subscribe((res) => {
			
			let comment = res.data.attributes;
			comment['user'] = this.user;

			this.blog['comments'].push(comment);
			Swal.fire('',this.user['auto_approve'] || this.user['role_id'] == '4' || this.user['role_id'] == '3'?'Comment added':'Your comment will be posted once approved','success');
			//set comment to blank
			this.addCommentForm.reset();
			this.commentSubmitted = false;
			this.addCommentAPIRunnning = false;
		}, (err) => {
			console.log(err);
			this.addCommentAPIRunnning = false;
		});
	}
	fixShortDesc(txt){
		return txt.replace(/&nbsp;/g," ");
	}
	approveRejectComment(type, commentId) {
		let url = URLS.comments + '/' + commentId;
		if (type == 'approve') {
			url += '/approve';
		} else {
			url += '/reject';
		}

		this._http.put(url, {})
		.subscribe((res) => {
			let commentData = res.data.attributes;
                        this.getBlogDetail();
			this.blog['comments'].forEach((comment) => {
				if (comment['comment_id'] == commentId) {
					comment['comment_approve'] = commentData['comment_approve'];
				}
			});

		}, (err) => {
			console.log(err);
		});
	}
	name_avatar(name) {
		name = name.match(/\b(\w)/g).join('');
		if(name.length>2){
			name = name.substring(0,1)+name.substr(name.length-1);
		}
		return name;
	}
}
