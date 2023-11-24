import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
declare var $;
@Component({
  selector: 'app-dailypodcast',
  templateUrl: './dailypodcast.component.html',
  styleUrls: ['./dailypodcast.component.scss']
})
export class DailypodcastComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  
  constructor(private rs:ResourcesService,
    private modalService: NgbModal,config: NgbModalConfig) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }
  list=[];
  dtTrigger = new Subject();
  info:any;
  someClickHandler(info: any): void {
     this.info=info;
  }
  resData;
  successmsg;

  success=false;
  err=false;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  updatedatatable()
  {
    this.rs.get("media/podcast-list").subscribe((res) => {
      this.list=[];
      this.list=res["result"];
      this.hidemodal();
      this.nextData();
		}, (err) => {
			console.log(err);
		});
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
 
  updatestatusurl="media/update-podcast-media-status/";
  onChanged2(ev,id,loader){
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
  onChanged(ev,id,loader){
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
  
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
    $(".dataTables_info").css("display","block");
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
    this.rs.get('media/podcast-list').subscribe((res) => {
      this.list=res.result;
      this.dtTrigger.next();
    }, (error) =>{
      console.log(error);
    });
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
