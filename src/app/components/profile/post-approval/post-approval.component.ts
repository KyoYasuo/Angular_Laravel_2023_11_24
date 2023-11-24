import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { URLS } from './../../../config/urls.config';
import { MEDIA_TYPE } from './../../../config/media.config';
import { AUDIO_TAG_IDS, VEDIO_CATEGORY_IDS } from './../../../config/global.config';
import { HttpService } from './../../../services/http.service';
import { environment } from './../../../../environments/environment';
import { ResourcesService } from 'src/app/services/resources.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-post-approval',
	templateUrl: './post-approval.component.html',
	styleUrls: ['./post-approval.component.scss']
})
export class PostApprovalComponent implements OnInit {
	modalRef: BsModalRef;

	posts: Array<any> 	= [];

	selectedPostForEdit: Object = {};

	videos: Array<any> 	= [];
	audios: Array<any> 	= [];
	comments: Array<any> 	= [];

	siteUrl = environment.OFFICIAL_SITE_URL;

	constructor(private _http: HttpService,
				private _modalService: BsModalService,private rs:ResourcesService,private modalService: NgbModal) { }

	ngOnInit() {
		this.getPosts();
		//this.getVideos();
		//this.getAudios();
		this.getComments();
		this.getUnapprovedAudios();
		this.getUnapprovedComment();
	}
	deleteurl="media/delete-media/";

	deleteItem(id,loader)
	{
		if(confirm("Are you sure to reject "+id)) {
		  this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
		  var url=this.deleteurl+id;
		  this.rs
		  .get(url
		  ).subscribe((data: any) => {

			this.modalService.dismissAll();
			this.getUnapprovedAudios();
		  },(err)=>{

			this.modalService.dismissAll();
				 alert("something went wrong");
		  });
		}
  
	}
  

	approve(id,val,loader)
	{
		this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
		
		var param=new URLSearchParams();
		
		param.set("media_id",id);
		param.set("status",val);

		this.rs.post("media/update-approval-status",param).subscribe((res)=>{
			this.modalService.dismissAll();
			this.getUnapprovedAudios();
		},(err)=>{
			this.modalService.dismissAll();
			alert("something went wrong");
            console.log(err);
		})
	}
  

	getPosts() {
		let url = URLS.blogs;

		let params = {
			is_approved: 0
		}

		this._http.get(url, params)
		.subscribe((res) => {
			let data = res.data;

			if (data.length == 0) {
				return;
			}

			this.posts = data;
		}, (error) =>{
			console.log(error);
		});
	}

	openEditPostPopup(template: TemplateRef<any>, post) {
		this.selectedPostForEdit = post;
		this.modalRef = this._modalService.show(template, { class: 'modal-lg', ignoreBackdropClick: true });
	}

	onPostUpdate(post) {
		this.posts.forEach((p, i) => {
			if (p.news_id == post['news_id']) {
				this.posts[i] = post;
			}
		});
	}

	openAddPostPopup(template: TemplateRef<any>) {
		this.modalRef = this._modalService.show(template, { class: 'modal-lg', ignoreBackdropClick: true });
	}

	addPost(blog) {
		this.getPosts();
	}

	getVideos() {
		let url = URLS.media + "/protected";
		let params = {
			type: MEDIA_TYPE.video,
			category_ids: Object.values(VEDIO_CATEGORY_IDS).toString(),
			status: 0,
			includes: 'created_by_user'
		}

		this._http.get(url, params)
		.subscribe((res) => {
			let result = res.data;

			if (result.length == 0) {
				return;
			}

			this.videos = result;
		}, (error) =>{
			console.log(error);
		});
	}

	getAudios() {
		let url = URLS.media + "/protected";
		let params = {
			type: MEDIA_TYPE.audio,
			tag_ids: Object.values(AUDIO_TAG_IDS).toString(),
			status: 0,
			includes: 'created_by_user'
		}

		this._http.get(url, params)
		.subscribe((res) => {
			let result = res.data;

			if (result.length == 0) {
				return;
			}

			this.audios = result;
		}, (error) =>{
			console.log(error);
		});
	}


	audioslist=[];
	getUnapprovedAudios() {
		//let url = environment. + "get-unapproved-media";
		let params = {
		}

		this.rs.get("media/get-unapproved-media")
		.subscribe((res) => {
			let result = res['result'];

			if (result.length == 0) {
				return;
			}

			this.audioslist = result;
		}, (error) =>{
			console.log(error);
		});
	}


	commentList=[];
	getUnapprovedComment() {
		let params = {
		}
		this.rs.get("commentary/get-unapproved-comments")
		.subscribe((res) => {
			let result = res['result'];

			if (result.length == 0) {
				return;
			}
			this.commentList = result;
		}, (error) =>{
			console.log(error);
		});
	}

	getComments() {
		let url = URLS.comments_list;

		let params = {
			sort 			: 'comment_id',
			direction 		: 'desc',
			comment_approve : 0
		}

		this._http.get(url, params)
		.subscribe((res) => {
			let result = res.data;

			if (result.length == 0) {
				return;
			}
                        let comment2 = []
                        for(let data of result){
                                if(data.delete_approve=='0'){
                                    comment2.push(data); 
                                }
                            }
			this.comments = comment2;
		}, (error) =>{
			console.log(error);
		});
	}
}
