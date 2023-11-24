import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
declare var $;

@Component({
  selector: 'app-mediaartistcrud',
  templateUrl: './mediaartistcrud.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
        width: 15% !important;
        left: 35%;
    }
  `],
  providers: [NgbModalConfig, NgbModal]
})
export class MediaartistcrudComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;



  addurl="media-authors/add";
  updateurl="media-authors/update/";
  updatestatusurl="media-authors/update-status/";
  deleteurl="media-authors/delete/";
  listurl="media-authors/list";

mydesc="";
msg;

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
  edit(content)
  {
    setTimeout(() => {
      this.msg="Update id "+this.info[0];
      this.mytxt=this.info[1];
      this.mydesc=this.info[3];
      $("#inputtxt").val(this.info[1]);
      this.btntxt="update";
      this.is_add=false;
      this.file=null;
      this.modalService.open(content, { centered: true });
    }, 100);
  }
  file:File=null;
  resData ;
  add(content)
  {
      this.msg="Add Media Artist";
      this.btntxt="add"; 
      this.mytxt="";
      this.mydesc="";
      this.is_add=true;
      this.file=null;
      this.modalService.open(content, { centered: true });
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
      //this.list=this.list.sort((a,b)=> {return a.name.localeCompare(b.name)})
      this.hidemodal();
      this.nextData();
		}, (err) => {
			console.log(err);
		});
  }
  nameinvalid=false;
  uploaddata='';
  upload(loader)
  {
    if(this.mytxt=="")
    {
      this.nameinvalid=true;
      return;
    }
    this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
		
      let formData = new FormData();
      if(this.file!=null){ 
       formData.append("image", this.file,this.file.name);
      }
      formData.append("name",this.mytxt);
      formData.append("description",this.mydesc);
      
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
        ).subscribe((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploaddata = Math.round(100 * event.loaded / event.total).toString() + "%";
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

  default()
  {
    this.nameinvalid=false;
this.fileinvalid=false;
  }
  fileinvalid=false;
  delete(loader)
  {
    setTimeout(() => {
    
      var id=this.info[0];

      this.uploaddata='';
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
  handleFileInput(ev)
	{
    this.fileinvalid=false;
    if(ev[0].type.toString().split("/")[0]=="image")
    {
       this.file=ev[0];
       $("#lbl").text(ev[0].name);
    }
    else{
      this.fileinvalid=true;
      $("#lbl").text("Choose Image");
    }
	}
  list2=[];
  ngOnInit() {
    this.rs.get(this.listurl).subscribe((res) => {
      this.list=res["result"];
    for(var i=0;i<this.list.length;i++)
    {
      if(this.list[i].name.toString().includes("Bhai")){
        this.list[i].name2=this.list[i].name.toString().substr(5);
      }
      else {
        this.list[i].name2=this.list[i].name;
      }
    }
    
      this.list=this.list.sort((a,b)=> {return a.name2.localeCompare(b.name2)})
      this.dtTrigger.next();
		}, (err) => {
			console.log( err);
		});
    this.dtOptions = {
      paging: false,
      pageLength:100,
      order:[],
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
