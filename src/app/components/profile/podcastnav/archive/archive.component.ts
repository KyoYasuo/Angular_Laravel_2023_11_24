import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
declare var $;

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  nameinvalid=false;
  selectinvalid=false;

  listurl="media/archive-list";
  updateurl="media/update-archive-media/";
  addurl="media/archive-add";
  updatestatusurl="media/update-archive-media-status/";
  deleteurl="media/delete-archive-media/";

  constructor(private rs:ResourcesService,
    private modalService: NgbModal,config: NgbModalConfig,private http: HttpClient) { 
      config.backdrop = 'static';
      config.keyboard = false;
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


  default()
  {
    this.nameinvalid=false;
    this.selectinvalid=false;

   // this.selectedCategory=4;
    this.prevtype='';
    this.file=null;
    this.file2=null;
    this.nameinvalid=false;
    this.fileinvalid=false;
    this.descinvalid=false;
    this.invalidmsg='';
    this.exturlinvalid=false;
    this.selectedLg=1;
    this.mytitle='';
    this.mydesc='';
    this.selectedCategory=[];
    this.selectedSubCategory=[];
    this.selectedShabad='';
    
  }

  edit(content)
  {
    this.default();
    //this.getcategory();
    setTimeout(() => {
      this.msg="Update id "+this.info[0];
      this.mytxt=this.info[1];
      $("#inputtxt").val(this.info[1]);
      this.btntxt="update";
      this.is_add=false;
      this.file=null;

      var listval=this.list.find(x => x.id == this.info[0] );
      this.mytitle=listval.title;
      this.mydesc=listval.description;
      this.selectedShabad=listval.shabad_id;
      // if(listval['language']=="e")
      // {
      //     this.selectedLg=1;
      // }
      // else{
      //   this.selectedLg=2;
      // }
      if(listval['type']=="EXTERNAL")
      {
        this.selectedType=4;
        this.mytxturl=listval['attachment_name'];
      }
      else{
        this.selectedType=1;
        
      }
      this.prevtype=listval['type'];
      // var catval=listval['media_categories'].toString().split(",");
      // for(var i=0;i<catval.length;i++)
      // {
      //   try{
      //    var ids=this.categorieslist.find(x => x.name == catval[i] ).id;
      //    this.selectedCategory.push(ids);
      //    //this.prevcategory.push(ids);
      //   }
      //   catch(e)
      //   {
      //     console.log(e);
      //   }
      // }

      // var subcatval=listval['media_subcategories'].toString().split(",");
      
      // for(var i=0;i<subcatval.length;i++)
      // {
      //   try{
      //    var ids=this.subcategorylist.find(x => x.name == subcatval[i] ).id;
      //    this.selectedSubCategory.push(ids);
      //    //this.prevcategory.push(ids);
      //   }
      //   catch(e)
      //   {
      //     console.log(e);
      //   }
      // }
      this.modalService.open(content);
    }, 100);
  }
  file:File=null;
  resData ;
  add(content)
  {
     this.default();
      this.msg="Add Archive Media";
      this.btntxt="add"; 
      this.mytxt="";
      this.is_add=true;
      this.file=null;
      this.modalService.open(content);
  }

  hidemodal()
  {
      this.modalService.dismissAll();
  }

  nextData()
  {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
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
    this.rs.get(this.listurl).subscribe((res) => {
      this.list=[];
      this.list=res["result"];
      this.hidemodal();
      this.nextData();
		}, (err) => {
      console.log(err);
      this.hidemodal();
      alert("error getting data");
		});
  }
  onChange(deviceValue) {
  }
  //selectedCategory=0;


  categorylist=[];
  
  uploaddata='';
  mydesc='';
  descinvalid=false;
  file2:File;
  mytxturl='';
  exturlinvalid=false;
  prevtype;
  upload(loader)
  {

    let formData = new FormData();
    
    if(this.selectedType==1)
    {
        
        if(this.file==null && this.is_add)
        {
          this.fileinvalid=true;
          this.invalidmsg="Please select mp3 file";
          return;
        }
        else if(this.file==null && !this.is_add && this.prevtype!='AUDIO')
        {
          this.fileinvalid=true;
          this.invalidmsg="Please select mp3 file";
          return;
        }
        else if(this.mytitle.toString().trim().length==0)
        {
          this.nameinvalid=true;
          return;
        }
        else if(this.mydesc.toString().trim().length==0)
        {
          this.descinvalid=true;
          return;
        }
        formData.set("thumbnail",this.file2);
        formData.set("attachment_name",this.file);
        formData.set("description",this.mydesc);
        formData.append("title",this.mytitle);
        formData.append("type","AUDIO");
        
    }
    else{
      if(this.mytxturl.toString().trim().length==0)
      {
        this.exturlinvalid=true;
        return;
      }
      else if(this.mytitle.toString().trim().length==0)
        {
          this.nameinvalid=true;
          return;
        }
        else if(this.mydesc.toString().trim().length==0)
        {
          this.descinvalid=true;
          return;
        }
        if(this.file2!=null){
            formData.set("thumbnail",this.file2);
        }
        else{
            formData.set("thumbnail",'');
        }
      formData.set("description",this.mydesc);
      formData.append("title",this.mytitle);
      formData.append("type","EXTERNAL");
      formData.append("external_url",this.mytxturl);
    }
    
    if(this.selectedLg==1)
    {
      formData.append("language",'e');
    }
    else{
      formData.append("language",'p');
    }
    var catid=[];
    for(var i=0;i<this.selectedCategory.length;i++)
    {
        catid[i]={"cat_id":this.selectedCategory[i]};
    }
    formData.append("category",JSON.stringify(catid));
    
    var subid=[];
    for(var i2=0;i2<this.selectedSubCategory.length;i2++)
    {
        subid[i2]={"sub_cat_id":this.selectedSubCategory[i2]};
    }
    formData.append("sub_category",JSON.stringify(subid));
    formData.append("shabad_id",this.selectedShabad);
                  
    // else if(this.selectedCategory==null)
    // {
    //       this.selectinvalid=true;
    //       this.nameinvalid=false;
    //       return;
    // }
    this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
		
      var url;
      if(this.is_add){
        url=this.addurl;
      }
      else{
        url=this.updateurl+this.info[0];
      }
      this.uploaddata='0%';
        this.rs
        .postMultipart(url,
          formData
        ).subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploaddata = Math.round(100 * event.loaded / event.total).toString() +"%";
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
  success=false;
  err=false;
  successmsg;
  delete(loader)
  {
    setTimeout(() => {
    
      var id=this.info[0];
      if(confirm("Are you sure to delete "+id)) {
        this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
		
        var url=this.deleteurl+this.info[0];
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
    },100);

  }
  msg;
  fileinvalid=false;
  invalidmsg="";
  // handleFileInput(ev)
	// {
  //   if(ev[0].type.toString().split("/")[0]=="audio"){
  //     this.file=ev[0];
  //     this.fileinvalid=false;
  //     var i=this.file.name.lastIndexOf(".");
  //     var val=this.file.name.toString().substring(0,i);
  //     this.mytxt=val;//this.file.name;

  //     this.invalidmsg="";
  //     $("#lbl").text(ev[0].name);
  //   }
  //   else{
  //    this.fileinvalid=true;
  //    this.mytxt="";
  //    this.file=null;

  //    this.invalidmsg="select valid file"
  //     $("#lbl").text("Choose mp3 file");
  //   }
   
  //   //this.file=ev[0];
	// 	//$("#lbl").text(ev[0].name);
  // }
  
  type=[{id:1,name:"Audio"},{id:4,name:"External Url"}]
  selectedType=1;
  mytitle;
  
  fileinvalid2=false;
          
  invalidmsg2="";

  handleFileInput(ev,type)
	{
    if(type==1){
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
              $("#lbl").text("Select audio file");
              }
      }
      else{
        if(ev[0].type.toString().split("/")[0]=="image"){
          this.file2=ev[0];
          this.fileinvalid2=false;
          
          this.invalidmsg2="";
          $("#lbl2").text(ev[0].name);

          var objectUrl = URL.createObjectURL(this.file);
          $("#audio").prop("src", objectUrl);
        }
        else{
        this.fileinvalid2=true;
        this.file2=null;
        this.invalidmsg2="select valid file"
        $("#lbl2").text("Select image file");
        }
      }
  }

  onSearchChange(searchValue: string): void {  
    var v2=searchValue.split("/");
    this.mytitle=v2[v2.length-1].split(".")[0];
  }
  shabadlist=[];
  selectedShabad;
  categorieslist=[];
  subcategorylist=[];
  selectedCategory;
  selectedSubCategory;
  selectedLg=1;
  lg=[{id:1,name:"english"},{id:2,name:"punjabi"}];


  onChanged2(ev,id,loader){
    this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
     
    //var url="media/today-podcast?url="+media+"&title="+title;
    var url="media/today-podcast?id="+id;
    
    var param=new URLSearchParams();
   
    this.rs.get(url).subscribe((data: any) => {
     this.resData = data;
 
     this.successmsg=this.resData["message"];
     if(this.resData["message"]!=null && this.resData["status"]=="200")
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
 
  ngOnInit() {
    document.addEventListener('play', function(e){
      var audios = document.getElementsByTagName('audio');
      for(var i = 0, len = audios.length; i < len;i++){
          if(audios[i] != e.target){
              audios[i].pause();
          }
      }
  }, true);
    this.rs.get(this.listurl).subscribe((res) => {
      this.list=res["result"];
      this.dtTrigger.next();
		}, (err) => {
			console.log(err);
    });
    
    // this.rs.get("categories/podcast-list").subscribe((res) => {
    //   this.categorieslist=res["result"];
    //   var d=this.categorieslist.filter((item)=> item.status!=0);
    //   this.categorieslist=[];
    //   this.categorieslist=d;
    //   //this.selectedCategory[0]=this.categorieslist[0].id;
		// }, (err) => {
		// 	console.log(err);
    // });

    // this.rs.get("categories/podcast-subcategory-list").subscribe((res) => {
    //   this.subcategorylist=res["result"];
    //   var d=this.subcategorylist.filter((item)=> item.status!=0);
    //   this.subcategorylist=[];
    //   this.subcategorylist=d;
    //   //this.selectedSubCategory[0]=this.subcategorylist[0].id;
		// }, (err) => {
		// 	console.log(err);
    // });

    // this.rs.get("shabad-data/list").subscribe((res) => {
    //   this.shabadlist=res["result"];

    //   //this.selectedSubCategory[0]=this.subcategorylist[0].id;
		// }, (err) => {
		// 	console.log(err);
    // });

    // this.rs.get("categories/resources-list").subscribe((res) => {
    //   this.categorieslist=res["result"];

    //   //this.selectedCategory[0]=this.categorieslist[0].id;
		// }, (err) => {
		// 	console.log(err);
    // });

    // this.rs.get("categories/resources-subcategory-list").subscribe((res) => {
    //   this.subcategorylist=res["result"];

    //   //this.selectedSubCategory[0]=this.subcategorylist[0].id;
		// }, (err) => {
		// 	console.log(err);
    // });

    this.dtOptions = {

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
