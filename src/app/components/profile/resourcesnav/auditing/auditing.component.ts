import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { HttpService } from 'src/app/services/http.service';
declare var $;

@Component({
  selector: 'app-auditing',
  templateUrl: './auditing.component.html',
  styleUrls: ['./auditing.component.scss']
})
export class AuditingComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;


  addurl="categories/add-resources-category";
  updateurl="categories/update-resources-category/";
  updatestatusurl="categories/update-resources-status/";
  deleteurl="categories/delete-resources/";
  listurl="media/audit-list";
  msg;

  constructor(private rs:ResourcesService, private httpservice: HttpService,
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
      this.msg="Add Media category";
      this.btntxt="add"; 
      this.mytxt="";
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
    //   this.hidemodal();
		// });
  }

  nameinvalid=false;
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
      var url;
      if(this.is_add){
        url=this.addurl;
      }
      else{
        url=this.updateurl+this.info[0];
      }
        this.rs
        .postMultipart(url,
          formData
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
  handleFileInput(ev)
	{
    this.file=ev[0];
		$("#lbl").text(ev[0].name);
	}
  ngOnInit() {

    document.addEventListener('play', function(e){
      console.log(e.target['classList'][0]);
      var audios = document.getElementsByTagName('audio');
      for(var i = 0, len = audios.length; i < len;i++){
          if(audios[i] != e.target){
              audios[i].pause();
          }
      }
  }, true);
    // this.rs.get(this.listurl).subscribe((res) => {
    //   this.list=res["result"];
    //   this.dtTrigger.next();
		// }, (err) => {
		// 	console.log(err);
    // });
    
    const that = this;
    this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 30,
        serverSide: true,
        processing: true,
        ajax: (dataTablesParameters: any, callback) => {
          var p=dataTablesParameters.start==0?"1":(dataTablesParameters.start/30)+1;
          that.http
            .get<DataTablesResponse>(
              this.httpservice.getAPI() + 'api/v1/'+this.listurl+"?page="+p,
             ).subscribe(resp => {
               (resp);
              that.list = resp['result']['data'];
              callback({
                recordsTotal: resp['result']['total'],
                recordsFiltered: resp['result']['total'],
                data: []
              });
            });
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

