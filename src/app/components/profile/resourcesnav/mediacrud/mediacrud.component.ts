import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { DomSanitizer } from '@angular/platform-browser';
//var getYoutubeTitle = require('get-youtube-title');
import * as getYoutubeTitle from 'get-youtube-title';
import getYouTubeID from 'get-youtube-id';
declare var $;
declare var moment;
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { HttpService } from 'src/app/services/http.service';


@Component({
  selector: 'app-mediacrud',
  templateUrl: './mediacrud.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
        width: 15% !important;
        left: 35%;
    }
  `],
  providers: [NgbModalConfig, NgbModal]
})
export class MediacrudComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  addurl="media/add";
  updateurl="media/update-media/";
  updatestatusurl="media/update-media-status/";
  deleteurl="media/delete-media/";
  listurl="media/list";


  constructor(private userService:UserService,private sanitizer: DomSanitizer,private rs:ResourcesService, private httpservice: HttpService,
    private modalService: NgbModal,config: NgbModalConfig,private http: HttpClient) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }
    transform(url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

  list=[];
  dtTrigger = new Subject();
  info:any;
  someClickHandler(info: any): void {
     this.info=info;
  }
  mytxt;
  btntxt;
  is_add=true;
  prevcategory=[]
  edit(content,item)
  {
    this.info=item;
    this.selectedCategory=[];
    this.prevcategory=[];

    this.prevtype='';
      this.fileinvalid=false;
      this.isvalidyoutubeurl=false;
      this.mytxtpodbean="";
      
      this.mytxtyoutube="";
      this.mytitle="";
      this.mytxturl="";
      this.titleinvalid=false;
      this.exturlinvalid=false;
      this.podbeaninvalid=false;
      this.nameinvalid=false;
      this.nameinvalidyoutube=false;
      this.fileinvalid=false;
      this.titleinvalid=false;
      
      
    // setTimeout(() => {
    //   this.msg="Update id "+this.info[0];
    //   this.mytitle=this.info[3];

    //   var listval=this.list.find(x => x.id == this.info[0] );
    //   this.prevtype=listval.type;
    //   var val2=listval['media_tag'];
    //   this.selectedTags=this.taglist.find(x => x.name == val2 ).id;
    //   var val=listval['media_categories'].toString().split(",");
    //     if(listval['shabad_id']!=null)
    //     {
    //       this.selectedShabad=listval['shabad_id'];
    //     }
    //   if(val!=""){
    //   for(var i=0;i<val.length;i++)
    //   {
    //     try{
    //      var ids=this.categorieslist.find(x => x.name == val[i] ).id;
    //      this.selectedCategory.push(ids);
    //      this.prevcategory.push(ids);
    //     }
    //     catch(e)
    //     {
    //       console.log(e);
    //     }
    //   }
    // }

    // var id=this.list.find(x => x.id == this.info[0] ).attachment_name;
    //   if(this.info[6]=="YOUTUBE")
    //   {
    //          this.selectedType=2;
    //          this.mytxtyoutube=id;
    //   }
    //   else if(this.info[6]=="S3")
    //   {
    //     this.selectedType=0;
    //   }
    //   else if(this.info[6]=="IMAGE")
    //   {
    //     this.selectedType=3;
    //     this.mytxtpodbean=id;
    //   }
    //   else if(this.info[6]=="EXTERNAL")
    //   {
    //     this.selectedType=4;
    //     this.mytxturl=id;
    //   }
    //   $("#inputtxt").val(this.info[1]);
    //   this.btntxt="update";
    //   this.is_add=false;
    //   this.file=null;
    //   this.isvalidyoutubeurl=false;
    //   this.modalService.open(content);
    // }, 100);
      this.msg="Update id "+this.info.id;
      this.mytitle=this.info.title;

      var listval=this.info;//this.list.find(x => x.id == this.info.id );
      this.prevtype=listval.type;
      var val2=listval['media_tag'];
      this.selectedTags=this.taglist.find(x => x.name == val2 ).id;
      var val=listval['media_categories'].toString().split(",");
      var val2=listval['media_subcategories'].toString().split(",");
    
        if(listval['shabad_id']!=null)
        {
          this.selectedShabad=listval['shabad_id'];
        }
    if(val!=""){
      for(var i=0;i<val.length;i++)
      {
        try{
         var ids=this.categorieslist.find(x => x.name == val[i] ).id;
         this.selectedCategory.push(ids);
         this.prevcategory.push(ids);
        }
        catch(e)
        {
          console.log(e);
        }
      }
    }
    if(val2!=""){
      for(var i=0;i<val2.length;i++)
      {
        try{
         var ids=this.subcategorylist.find(x => x.name == val2[i] ).id;
         this.selectedSubCategory.push(ids);
        // this.prevcategory.push(ids);
        }
        catch(e)
        {
          console.log(e);
        }
      }
    }

    var id=this.list.find(x => x.id == this.info.id ).attachment_name;
      if(this.info[6]=="YOUTUBE")
      {
             this.selectedType=2;
             this.mytxtyoutube=id;
      }
      else if(this.info[6]=="S3")
      {
        this.selectedType=0;
      }
      else if(this.info[6]=="IMAGE")
      {
        this.selectedType=3;
        this.mytxtpodbean=id;
      }
      else if(this.info[6]=="EXTERNAL")
      {
        this.selectedType=4;
        this.mytxturl=id;
      }
      $("#inputtxt").val(this.info.author_name);
      this.btntxt="update";
      this.is_add=false;
      this.file=null;
      this.isvalidyoutubeurl=false;
      this.modalService.open(content);
    
  }
  file:File=null;
  resData ;
  add(content)
  {
      this.msg="Add media";
      this.btntxt="add"; 
      this.mytxt="";
      this.is_add=true;
      this.file=null;
      this.prevtype='';
      this.fileinvalid=false;
      this.isvalidyoutubeurl=false;
      this.mytxtpodbean="";

      this.mytxtyoutube="";
      this.mytitle="";
      this.mytxturl="";
      this.titleinvalid=false;
      this.exturlinvalid=false;
      this.podbeaninvalid=false;
      //this.selectedTags=this.taglist[1].id;
      this.selectedTags=this.taglist.find(x=> x.name=="Kirtan").id;
      this.selectedShabad='';
      this.selectedType=0;
      this.modalService.open(content);
  }

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

  nextData()
  {
    
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.data();
     // const self=this;
   dtInstance.draw()
      // Destroy the table first
     // dtInstance.destroy();
      
      //dtInstance.draw();
      //this.dtElement.dtTrigger.next();
      // Call the dtTrigger to rerender again
      //this.dtTrigger.next();
    });
  }
  onChanged(ev,id,loader){
   this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
	
   var url=this.updatestatusurl+id;
   var param=new URLSearchParams();
   var status="0";
   if(ev){
     status="1";
   }
   param.set("status",status);
   this.rs.post(url,param).subscribe((data: any) => {
    this.resData = data;

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
  },(err)=>{
         this.err=true;
         this.success=false;
         this.successmsg="something went wrong";

    this.updatedatatable();
  });
  }
  updatedatatable()
  {
    this.hidemodal();
    this.nextData();

    // this.rs.get(this.listurl).subscribe((res) => {
    //   this.list=[];
    //   this.list=res["data"];

   	// }, (err) => {
    //   console.log(err);
    //   this.hidemodal();
		// });
  }

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
  open()
  {
    window.open("./shabad/1/1");
  }
  onChange($event)
  {
    this.fileinvalid=false;
    this.podbeaninvalid=false;
    this.exturlinvalid=false;
    this.nameinvalidyoutube=false;
  }
  prevtype;
  nameinvalid=false;
  nameinvalidyoutube=false;
  invalidmsg;
  mytxtyoutube='';

  timeupload=true;
  success=false;
  err=false;
  successmsg;
titleinvalid=false;
mytxtpodbean;

selectedVideotype=1;
videotype=[{name:"Featured",id:1},{name:"Discussion",id:0}]
uploaddata='';

upload(loader)
{



    if(this.selectedType==1 || this.selectedType==0){
                  if(this.file==null && this.is_add)
                  {
                    //this.nameinvalid=true;
                    this.fileinvalid=true;
                    this.invalidmsg="pls select mp3 file"
                    return;
                  }
                  else if(this.file==null && !this.is_add && this.prevtype!="AUDIO" && this.prevtype!="S3")
                  {
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
   
  
}

else{
  
}




  var ref=this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
            
  this.rs.get("media/list?q="+this.mytitle.toString()+"&whole_word=yes").subscribe((res)=>{
    /*if(res.result.data.length==1){    
        alert("title already exists");
        ref.close();
    }
    else{*/
      this.upload2();
    //}
  },(err)=>{
        alert("something went wrong");
        ref.close();
  })
}
  upload2()
  {
    let formData = new FormData();
    formData.set("user_id",this.userService.getLoggedInUser().id);
	
   var loadingstart=false;
    if(this.selectedType==1 || this.selectedType==0){
                  if(this.file==null && this.is_add)
                  {
                    //this.nameinvalid=true;
                    this.fileinvalid=true;
                    this.invalidmsg="pls select mp3 file"
                    return;
                  }
                  else if(this.file==null && !this.is_add && this.prevtype!="AUDIO" && this.prevtype!="S3")
                  {
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

                  if(this.timeupload)
                  {
                    if(this.time!=0)
                    {
                      formData.append("duration",this.time);
                      this.timeupload=false;
                    }
                  }
                  this.titleinvalid=false;
                  this.fileinvalid=false;
                  if(this.file!=null){
                    formData.append("attachment_name", this.file,this.file.name);
                  }
                    formData.append("title",this.mytitle);
                    formData.append("author_id",this.selectedArtist);
                    formData.append("type",this.selectedType==1?"AUDIO":"S3");
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
                    formData.set("fid","0");
                 
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
  formData.append("fid",this.selectedVideotype.toString());

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
  formData.set("fid","0");
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
  

   this.titleinvalid=false;
   this.exturlinvalid=false;
  
   formData.append("attachment_name", "");
   formData.append("title",this.mytitle);
   formData.append("author_id",this.selectedArtist);
   formData.append("type","EXTERNAL");
   formData.append("external_url",this.mytxturl);
   formData.append("youtube_url","");
   formData.set("fid","0");
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
 
 loadingstart=true;
 
}



          //this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
                  

if(loadingstart){

  $("#audio").prop("src", this.mytxturl);
  this.waitingfordata=true;
          var x=setInterval(()=>{
            if(this.errdata)
            {
              clearInterval(x);
              this.errdata=false;
              this.waitingfordata=false;
              Swal.fire('','Error getting time info from url','error');
              this.modalService.dismissAll();
            }
            else if(!this.waitingfordata)
            {

              clearInterval(x);
              this.errdata=false;
              this.waitingfordata=false;
                        var url;
                        if(this.is_add){
                          url=this.addurl;
                        }
                        else{
                          url=this.updateurl+this.info.id;
                                  }
                        this.uploaddata='0%';
                        
                        if(this.time!=0)
                        {
                          formData.append("duration",this.time);
                          this.timeupload=false;
                        }
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
                else{
                  
                }
          },1000);
    }
    else{
      var url;
          if(this.is_add){
            url=this.addurl;
          }
          else{
            url=this.updateurl+this.info.id;
                    }
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
          
  }
  delete(loader,item)
  {
   // setTimeout(() => {
    
      var id=item.id;
      this.uploaddata='';
      if(confirm("Are you sure to delete "+id)) {
        this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
		
        var url=this.deleteurl+item.id;
        this.rs
        .get(url
        ).subscribe((data: any) => {
          this.resData = data;

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
        },(err)=>{
               this.err=true;
               this.success=false;
               this.successmsg="something went wrong";

          this.updatedatatable();
        });
      }
   // },100);

  }
  msg;
  mediaartist=[];
  taglist=[];
  categorieslist=[];
  subcategorylist=[];
  selectedArtist;
  selectedType=0;
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
time;//,{id:3,name:"Podbean"}
  type=[{id:0,name:"S3"},{id:1,name:"local"},{id:2,name:"Youtube"},{id:4,name:"External Url"}]
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
  waitingfordata=false;
  errdata=false;
  
  ngOnInit() {
    // $('.audio1').onplay = function() {
    //   $("audio").not(this).each(function(index, audio) {
    //       audio.pause();
    //   });
    // };

    document.addEventListener('play', function(e){
      var audios = document.getElementsByTagName('audio');
      for(var i = 0, len = audios.length; i < len;i++){
          if(audios[i] != e.target){
              audios[i].pause();
          }
      }
  }, true);
    $("#audio").on("loadedmetadata", function(e) {
      console.log(e);
  });
  $("#audio").on("canplaythrough", (e)=>{
    var seconds = e.currentTarget.duration;
    var duration = moment.duration(seconds, "seconds");
    
    var time = "";
    var hours = duration.hours();
    if (hours > 0) { time = hours + ":" + duration.minutes() + ":" + duration.seconds(); }
    else{
       time = hours + duration.minutes() + ":" + duration.seconds();
    }
    this.time=time;
    this.timeupload=true;

    this.errdata=false;
    this.waitingfordata=false;
}); 
$('#audio').on('error', (e)=> {
     console.log(e)
    this.errdata=true;
    this.waitingfordata=false;
});

$("tbody tr").on( 'play', 'audio', function(){
  $("audio").not(this).each(function(index, audio) {
      audio.pause();
  });
} );

    // this.rs.get(this.listurl).subscribe((res) => {
    //   this.list=res["data"];
    //   this.dtTrigger.next();
		// }, (err) => {
		// 	console.log(err);
    // });
    
//getartist
    this.rs.get("media-authors/list").subscribe((res) => {
      this.mediaartist=res["result"];
      this.selectedArtist=this.mediaartist[0].id;
      this.mediaartist=this.mediaartist.sort((a,b)=> {return a.name.localeCompare(b.name)})
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
      var d=this.categorieslist.filter((item)=> item.status!=0);
      this.categorieslist=[];
      this.categorieslist=d;
      this.categorieslist=this.categorieslist.sort((a,b)=> {return a.name.localeCompare(b.name)})
		
      //this.selectedCategory[0]=this.categorieslist[0].id;
		}, (err) => {
			console.log(err);
    });

    this.rs.get("categories/resources-subcategory-list").subscribe((res) => {
      this.subcategorylist=res["result"];
      var d=this.subcategorylist.filter((item)=> item.status!=0);
      this.subcategorylist=[];
      this.subcategorylist=d;
      this.subcategorylist=this.subcategorylist.sort((a,b)=> {return a.name.localeCompare(b.name)})
		
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
    
 

    // this.rs.get('media/podcast-list').subscribe((res) => {
    //   this.podcastlist=res.result;
    //   this.selectedPodcast=this.podcastlist[0].id;
    // }, (error) =>{
    //   console.log(error);
      
    // });
    // serverSide: true,
    // processing: true,
    // ajax: (dataTablesParameters: any, callback) => {
    //   that.http
    //     .post<DataTablesResponse>(
    //       that.listurl,
    //       dataTablesParameters, {}
    //     ).subscribe(resp => {
    //       that.list = resp.data;

    //       callback({
    //         recordsTotal: resp.recordsTotal,
    //         recordsFiltered: resp.recordsFiltered,
    //         data: []
    //       });
    //     });
    // },
    // columns: [{
    //   data: 'id'
    // }, {
    //   data: 'author_name'
    // }, {
    //   data: 'lastName'
    // },{
    //   data: 'type'
    // },{
    //   data: 'attachment_name'
    // },{
    //   data: 'title'
    // },{
    //   data: 'media_categories'
    // },{
    //   data: 'media_tag'
    // },{
    //   data: 'type'
    // },{
    //   data: 'shabad_id'
    // },{
    //   data: 'status'
    // }],
    const that = this;
    this.dtOptions = {

      pagingType: 'full_numbers',
      pageLength: 30,
      serverSide: true,
      processing: true,
      search:true,
      ajax: (dataTablesParameters: any, callback) => {
        var p=dataTablesParameters.start==0?"1":(dataTablesParameters.start/30)+1;
            
        if(dataTablesParameters.search.value==''){
            that.http
              .get<DataTablesResponse>(
                this.httpservice.getAPI() + 'api/v1/'+this.listurl+"?page="+p,
              ).subscribe(resp => {
                that.list = resp['result']['data'];
                callback({
                  recordsTotal: resp['result']['total'],
                  recordsFiltered: resp['result']['total'],
                  data: []
                });
              });
          }
          else{
            that.http
              .get<DataTablesResponse>(
                this.httpservice.getAPI() + 'api/v1/media/list?page='+p+'&q='+dataTablesParameters.search.value,
              ).subscribe(resp => {
                that.list = resp['result']['data'];
                callback({
                  recordsTotal: resp['result']['total'],
                  recordsFiltered: resp['result']['total'],
                  data: []
                });
              });
          }
      },
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.someClickHandler(data);
        });
        return row;
      }
    };
  }
 
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
