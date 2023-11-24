import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import * as getYoutubeTitle from 'get-youtube-title';
import getYouTubeID from 'get-youtube-id';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpEventType } from '@angular/common/http';
declare var $;
declare var moment;

@Component({
  selector: 'app-modelcontent',
  templateUrl: './modelcontent.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
        width: 15% !important;
        left: 35%;
    }
  `],
  providers: [NgbModalConfig, NgbModal]
})
export class ModelcontentComponent implements OnInit {

  constructor(private rs:ResourcesService,config: NgbModalConfig,private modalService: NgbModal) { 
    config.backdrop = 'static';
		config.keyboard = false;
  }

	mytxtyoutube='';

	file:File=null;
	nameinvalidyoutube=false;
	hidemodal()
	{
	  this.mytitle="";
	  this.file=null;
	  this.mytxtyoutube="";
	  this.selectedType=1;
	  this.selectedTags=2;
	  this.selectedCategory=[];
	  this.selectedSubCategory=[];
	  this.exturlinvalid=false;
	  this.fileinvalid=false;
	  this.podbeaninvalid=false;
	  this.nameinvalidyoutube=false;
	  this.modalService.dismissAll();
  
	}
  

	mediaartist=[];
	taglist=[];
	categorieslist=[];
	subcategorylist=[];
	selectedArtist;
	selectedType=1;
	selectedTags;
	selectedCategory=[];
	selectedSubCategory=[];
	podcastlist=[];
	selectedPodcast;
	selectedShabad='';
	shabadlist=[];
  mytitle='';
  fileinvalid=false;
  podbeaninvalid=false;
  exturlinvalid=false;
  mytxturl='';
  time;
  isvalidyoutubeurl=true;
  onSearchChange(searchValue: string): void {  
    var v2=searchValue.split("/");
    this.mytitle=v2[v2.length-1].split(".")[0];
    if(this.selectedType==2)
    {
      var id = getYouTubeID(searchValue);
      var self=this;
      if(id!=null){
           this.mytxtyoutube="https://www.youtube.com/embed/"+id;
           this.isvalidyoutubeurl=false;
            getYoutubeTitle(id, function (err, title) {
                if(!err)
                {
                 self.settitle(title);
                }
            });
       }
    }
  }
  settitle(t)
  {

    this.mytitle=t;
  }
  msg;
  btntxt;
  mytxt;
  mytxtpodbean;
  titleinvalid=false;
  resData;
  successmsg='';

  success=false;
  err=false;
  invalidmsg='';

  addurl="media/add";
  updatedatatable()
  {
       
      this.hidemodal();
  }
  handleFileInput(ev)
  {
  if(ev[0].type.toString().split("/")[0]=="audio"){
	this.file=ev[0];
	this.fileinvalid=false;
	var i=this.file.name.lastIndexOf(".");
	var val=this.file.name.toString().substring(0,i);
	this.mytitle=val;//this.file.name;

   this.invalidmsg="";
	$("#lbl").text(ev[0].name);

	var objectUrl = URL.createObjectURL(this.file);
	$("#audio").prop("src", objectUrl);
  }
  else{
   this.fileinvalid=true;
   this.mytitle="";
   this.file=null;

   this.invalidmsg="select valid file"
   $("#lbl").text("");
  }
  }

  add(content)
  {
      
      this.msg="Add media";
      this.btntxt="add"; 
      this.mytxt="";
      this.file=null;
      this.fileinvalid=false;
      this.isvalidyoutubeurl=false;
      this.mytxtpodbean="";
      
      this.mytxtyoutube="";
      this.mytitle="";
      this.mytxturl="";
      this.titleinvalid=false;
      this.exturlinvalid=false;
	  this.podbeaninvalid=false;
	  this.selectedTags=this.taglist.find(x=> x.name=="Kirtan").id;
	  this.selectedShabad="1";//this.shabadId.toString();//this.shabadlist.find(x => x.id == this.pageId ).id;
      this.modalService.open(content, { centered: true });
  }
  type=[{id:1,name:"Audio"},{id:2,name:"Youtube"},{id:3,name:"Podbean"},{id:4,name:"External Url"}]
  uploaddata='';
  is_add=true;
  upload(loader)
  {
    let formData = new FormData();
   
    if(this.selectedType==1){
                  if(this.file==null && this.is_add)
                  {
                    //this.nameinvalid=true;
                    this.fileinvalid=true;
                    this.invalidmsg="pls select mp3 file"
                    return;
                  }
                  else if(this.mytitle.toString().trim().length == 0 )
                  {
                    this.titleinvalid=true;
                    this.fileinvalid=false;
                    return;
                  }

                  this.titleinvalid=false;
                  this.fileinvalid=false;
                  if(this.file!=null){
                    formData.append("attachment_name", this.file,this.file.name);
                  }
                    formData.append("title",this.mytitle);
                    formData.append("author_id",this.selectedArtist);
                    formData.append("type","AUDIO");
                    formData.append("youtube_url","");
                    formData.append("podbean_url","");
                   // formData.append("time",this.time);
                    var catid=[];
                    for(var i=0;i<this.selectedCategory.length;i++)
                    {
                        catid[i]={"cat_id":this.selectedCategory[i]};
                    }
                    formData.append("category",JSON.stringify(catid));
                    formData.append("new_category","");
                    
                    var subid=[];
                    for(var i2=0;i2<this.selectedSubCategory.length;i2++)
                    {
                        subid[i2]={"sub_cat_id":this.selectedSubCategory[i2]};
                    }
                    formData.append("sub_category",JSON.stringify(subid));
                    formData.append("tag_id",this.selectedTags);
                    formData.append("shabad_id",this.selectedShabad);
                  
                 
          }
else if(this.selectedType==2)
{
  if(this.mytxtyoutube.toString().trim().length == 0)
  {
    this.nameinvalidyoutube=true;
    this.titleinvalid=false;
    return;
  }
  else if(this.isvalidyoutubeurl)
  {
    this.nameinvalidyoutube=true;
    this.titleinvalid=false;
    return;
  }
   else if(this.mytitle.toString().trim().length == 0)
   {
     this.titleinvalid=true;
     return;
   }
  
   this.titleinvalid=false;
   this.nameinvalidyoutube=false;
  formData.append("attachment_name", "");
  formData.append("title",this.mytitle);
  formData.append("author_id",this.selectedArtist);
  formData.append("type","YOUTUBE");
  formData.append("youtube_url",this.mytxtyoutube);
  formData.append("podbean_url","");
  var catid=[];
  for(var i=0;i<this.selectedCategory.length;i++)
  {
      catid[i]={"cat_id":this.selectedCategory[i]};
  }
  formData.append("category",JSON.stringify(catid));
  formData.append("new_category","");
  
  var subid=[];
  for(var i2=0;i2<this.selectedSubCategory.length;i2++)
  {
      subid[i2]={"sub_cat_id":this.selectedSubCategory[i2]};
  }
  formData.append("sub_category",JSON.stringify(subid));
  formData.append("tag_id",this.selectedTags);
  formData.append("shabad_id",this.selectedShabad);

}

else if(this.selectedType==3)
{

  if(this.mytxtpodbean.toString().trim().length == 0)
   {
     this.podbeaninvalid=true;
     this.titleinvalid=false;
     return;
   }
   else if(this.mytitle.toString().trim().length == 0)
   {
     
    this.titleinvalid=true;
     return;
   }
   
   this.titleinvalid=false;
   this.podbeaninvalid=false;
  
   this.titleinvalid=false;
  formData.append("attachment_name", "");
  formData.append("title",this.mytitle);
  formData.append("author_id",this.selectedArtist);
  formData.append("type","IMAGE");
  formData.append("youtube_url","");
  //this.podcastlist.find(x => x.id === this.selectedPodcast).media;
  // formData.append("podbean_url",
  // this.podcastlist.find(x => x.id === this.selectedPodcast).media);
  formData.append("podbean_url",
  this.mytxtpodbean);

  var catid=[];
  for(var i=0;i<this.selectedCategory.length;i++)
  {
      catid[i]={"cat_id":this.selectedCategory[i]};
  }
  formData.append("category",JSON.stringify(catid));
  formData.append("new_category","");
  var subid=[];
  for(var i2=0;i2<this.selectedSubCategory.length;i2++)
  {
      subid[i2]={"sub_cat_id":this.selectedSubCategory[i2]};
  }
  formData.append("sub_category",JSON.stringify(subid));
  formData.append("tag_id",this.selectedTags);
  formData.append("shabad_id",this.selectedShabad);

}

else{
  

  // if(this.mytxturl.toString().trim().length == 0)
  // {
  //   this.exturlinvalid=true;
  //   this.titleinvalid=false;
  //   return;
  // }
  //   if(this.mytitle.toString().trim().length == 0)
  //   {
      
  //    this.titleinvalid=true;
  //     return;
  //   }
    
   this.titleinvalid=false;
   this.exturlinvalid=false;
  
   formData.append("attachment_name", "");
   formData.append("title",this.mytitle);
   formData.append("author_id",this.selectedArtist);
   formData.append("type","EXTERNAL");
   formData.append("external_url",this.mytxturl);
   formData.append("youtube_url","");
   //this.podcastlist.find(x => x.id === this.selectedPodcast).media;
   formData.append("podbean_url",
   "");
   var catid=[];
   for(var i=0;i<this.selectedCategory.length;i++)
   {
       catid[i]={"cat_id":this.selectedCategory[i]};
   }
   formData.append("category",JSON.stringify(catid));
   formData.append("new_category","");
   
   var subid=[];
   for(var i2=0;i2<this.selectedSubCategory.length;i2++)
   {
       subid[i2]={"sub_cat_id":this.selectedSubCategory[i2]};
   }
   formData.append("sub_category",JSON.stringify(subid));
   formData.append("tag_id",this.selectedTags);
   formData.append("shabad_id",this.selectedShabad);
 
 
 
}



          this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
                  
          var url;
            url=this.addurl;
          this.uploaddata='0%';
            this.rs
            .postMultipart(url,
              formData
            ).subscribe((event) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.uploaddata = Math.round(100 * event.loaded / event.total) + "%";
              }
              else if (event.type === HttpEventType.Response){
                            this.resData = event.body;
             
              this.successmsg=this.resData["message"];
              if(this.resData["message"]!=null && this.resData["success"]=="200")
              {
                  this.success=true;
                  this.err=false;
              }
              else{

                this.success=false;
                this.err=true;
              }
              this.updatedatatable();
            }
            },(err)=>{
                  this.err=true;
                  this.success=false;
                  this.successmsg="something went wrong";
              this.updatedatatable();
            });
  }
	ngOnInit() {
		
		  
	  //getartist
		  this.rs.get("media-authors/list").subscribe((res) => {
			this.mediaartist=res["result"];
			this.selectedArtist=this.mediaartist[0].id;
			  }, (err) => {
				  console.log(err);
		  });
	  
		  this.rs.get("resource-tag/list").subscribe((res) => {
			this.taglist=res["result"];
	  
			this.selectedTags=this.taglist[1].id;
			  }, (err) => {
				  console.log(err);
		  });
	  
		  this.rs.get("categories/resources-list").subscribe((res) => {
			this.categorieslist=res["result"];
	  
			//this.selectedCategory[0]=this.categorieslist[0].id;
			  }, (err) => {
				  console.log(err);
		  });
	  
		  this.rs.get("categories/resources-subcategory-list").subscribe((res) => {
			this.subcategorylist=res["result"];
	  
			//this.selectedSubCategory[0]=this.subcategorylist[0].id;
			  }, (err) => {
				  console.log(err);
		  });
	  
		  this.rs.get("shabad-data/list").subscribe((res) => {
			this.shabadlist=res["result"];
	  
			//this.selectedSubCategory[0]=this.subcategorylist[0].id;
			  }, (err) => {
				  console.log(err);
		  });
	}

}
