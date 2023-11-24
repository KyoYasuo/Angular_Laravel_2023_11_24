import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ResourcesService } from 'src/app/services/resources.services';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $;
import { UiSwitchModule } from 'ngx-toggle-switch';
@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
        width: 15% !important;
        left: 35%;
    }
  `],
  providers: [NgbModalConfig, NgbModal]
})
export class PodcastComponent implements OnInit {
  form: FormGroup;
	mediaList=[];
	mediaObjects=[];
	artistList=[];
	artistObjects=[];
	categoriesList=[];
	categoriesObjects=[];
	ngOnInit()
	{
		this.fetchData();
    }
    autocompleteItemsAsObjects = [
        {value: 'Item1', id: 0, extra: 0},
        {value: 'item2', id: 1, extra: 1},
        'item3'
    ];

    fetchData()
    {
        this.rs.get("featured-api/podcast-listing").subscribe((res) => {
			

			  var media_result=res.result.media_result;
			  
			  var cat_result=res.result.cat_result;
			  
			  var author_result=res.result.author_result;
			  
			  for(var i=0;i<media_result.length;i++)
			  {
				  if(media_result[i].featured!=0)
				  {
                    this.mediaObjects.push({id:media_result[i].id,value:media_result[i].title,display:media_result[i].title,sort:media_result[i].featured_display_order});   
				  }
                  this.mediaList.push({id:media_result[i].id,value:media_result[i].title});
                  this.mediaList=this.mediaList.sort((a,b)=> {return a.value.localeCompare(b.value)})
			 
              }
			  for(var i=0;i<cat_result.length;i++)
			  {
				  if(cat_result[i].featured!=0)
				  {
                    this.categoriesObjects.push({id:cat_result[i].id,value:cat_result[i].title,display:cat_result[i].title,sort:cat_result[i].featured_display_order});   
				  }
                  this.categoriesList.push({id:cat_result[i].id,value:cat_result[i].title});
                  
                  this.categoriesList=this.categoriesList.sort((a,b)=> {return a.value.localeCompare(b.value)})
			  }
			  for(var i=0;i<author_result.length;i++)
			  {
				  if(author_result[i].featured!=0)
				  {
                    this.artistObjects.push({id:author_result[i].id,value:author_result[i].title,display:author_result[i].title,sort:author_result[i].featured_display_order});   
				  }
                  this.artistList.push({id:author_result[i].id,value:author_result[i].title});
                  this.artistList=this.artistList.sort((a,b)=> {return a.value.localeCompare(b.value)})
              }
              
              this.mediaObjects.sort(function (a, b) {
                return a.sort - b.sort;
              });

              this.categoriesObjects.sort(function (a, b) {
                return a.sort - b.sort;
              });
              this.artistObjects.sort(function (a, b) {
                return a.sort - b.sort;
              });
		}, (error) =>{
			console.log(error);
		});

    }
    success=false;
    err=false;
    successmsg;
    hidemodal()
    {
        this.modalService.dismissAll();
    }
    
	save(content,x)
	{
        this.modalService.open(content, { centered: true,windowClass: 'dark-modal' });
		
		var data;
		if(x==1)
		{
			var featured_media_id=[];
			for(var i=0;i<this.mediaObjects.length;i++)
			{
					featured_media_id[i]={"media_id":this.mediaObjects[i].id.toString()};
			}
            //data={featured_media_id:featured_media_id};

            var data2=new URLSearchParams();
            data2.set("featured_media_id",JSON.stringify(featured_media_id));
            this.rs.post("featured-api/save-podcast-media",data2).subscribe((res)=>{

                if(res['message']!=null)
                {
                    this.successmsg=res['message'];
                    this.success=true;
                    this.err=false;

                    this.hidemodal();
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
		else if(x==2){
			var featured_author_id=[];
			for(var i=0;i<this.artistObjects.length;i++)
			{
				featured_author_id[i]={"author_id":this.artistObjects[i].id};
			}
            //data={"featured_author_id":featured_author_id};
            var data2=new URLSearchParams();
            data2.set("featured_author_id",JSON.stringify(featured_author_id));
            
            this.rs.post("featured-api/save-podcast-author",data2).subscribe((res)=>{

                if(res['message']!=null)
                {
                    this.successmsg=res['message'];
                    this.success=true;
                    this.err=false;

                    this.hidemodal();
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
            });;
		}
		else{

			var featured_category_id=[];
			for(var i=0;i<this.categoriesObjects.length;i++)
			{
				featured_category_id[i]={"cat_id":this.categoriesObjects[i].id};
			}
            //data={"featured_category_id":featured_category_id};
            var data2=new URLSearchParams();
            data2.set("featured_category_id",JSON.stringify(featured_category_id));
            
            this.rs.post("featured-api/save-podcast-category",data2).subscribe((res)=>{

                if(res['message']!=null){

                    
                    this.successmsg=res['message'];
                    this.success=true;
                    this.err=false;
                        this.hidemodal();
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
            });;
		}
	}
    constructor(private rs:ResourcesService,config: NgbModalConfig, private modalService: NgbModal) {
        config.backdrop = 'static';
        config.keyboard = false;
    }

}
