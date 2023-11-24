import { Component, OnInit } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
declare var moment;
declare var $;
@Component({
  selector: 'app-mediadurationupload',
  templateUrl: './mediadurationupload.component.html',
  styleUrls: ['./mediadurationupload.component.scss']
})
export class MediadurationuploadComponent implements OnInit {

  constructor(private rs:ResourcesService,private modal:NgbModal) { }

  list;
  i=98;
  updateddata=[];
  v=0;
  success=0;
  error=0;
  items=[1];
  ngOnInit() {

        this.rs.get("media/media-list-noduration").subscribe((res)=>{
               this.list=res.result;  
               //this.seturl(this.i); 
        },(err)=>{
          
        });


    $("#audio").on("loadedmetadata", function(e) {
    });
    const self=this;
    $("#audio").on("canplaythrough", (e)=>{
      var seconds = e.currentTarget.duration;
      var duration = moment.duration(seconds, "seconds");
      
      var time = "";
      var hours = duration.hours();
      if (hours > 0) { time = hours + ":" + duration.minutes() + ":" + duration.seconds(); }
      else{      
      time = hours + duration.minutes() + ":" + duration.seconds();
      }

      self.updateddata.push({id:this.list[this.i]['id'],"duration":time,"attachment_name":this.list[this.i]['attachment_name']})
      self.i++;
      self.success++;
      
      
      if(self.i != this.list.length){

        self.seturl(self.i);
      }
      else{
        self.update();
      }
    }); 
    $('audio').on('error', (e)=> {
      this.errdesc.push(e);
      self.updateddata.push({id:this.list[this.i]['id'],"duration":"N/A","attachment_name":this.list[this.i]['attachment_name']})
      self.i++;
      self.error++;
      if(self.i != this.list.length){
        self.seturl(self.i);
        //self.error++;
      }
      else{
        self.update();
      }
      
      
    });
  }

  errdesc=[];
  update()
  {
    //alert("update");
    let formdata=new URLSearchParams();
    formdata.set("media",JSON.stringify(this.updateddata));
    var obj;
    this.rs.post("media/media-duration-update",formdata).subscribe((res)=>{
      swal.fire('','done','success');
      this.get();
    },(err)=>{
      swal.fire('',err,'error');
      this.get();
    })
  }

  get()
  {
    this.rs.get("media/media-list-noduration").subscribe((res)=>{
      this.list=res.result;
      if(this.list.length==0)
      {
        this.items=[];
      } 
      this.modal.dismissAll();
        
      //this.seturl(this.i); 
      },(err)=>{
        this.modal.dismissAll();
      
      });
  }
  start(c,x)
  {
    this.i=0;
    this.updateddata=[];
    this.errdesc=[];
    this.success=0;
    this.error=0;
    this.seturl(this.i);
    this.modal.open(c,{centered:true,backdrop:'static'});
  }
  seturl(i)
  {
    //if(i!=this.list.length-1){
    $("#audio").prop("src", this.list[i].attachment_name);
    //}
  }

}
