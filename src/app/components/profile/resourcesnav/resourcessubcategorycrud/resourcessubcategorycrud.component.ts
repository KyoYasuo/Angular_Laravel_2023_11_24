import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
declare var $;
@Component({
  selector: 'app-resourcessubcategorycrud',
  templateUrl: './resourcessubcategorycrud.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
        width: 15% !important;
        left: 35%;
    }
  `],
  providers: [NgbModalConfig, NgbModal]
})
export class ResourcessubcategorycrudComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  nameinvalid=false;
  selectinvalid=false;

  listurl="categories/resources-subcategory-list";
  updateurl="categories/update-resources-subcategory/";
  addurl="categories/add-resources-subcategory";
  updatestatusurl="categories/update-resources-subcat-status/";
  deleteurl="categories/delete-resources-subcategory/";

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
this.fileinvalid=false;
    this.selectedCategory=4;
  }
  find(id):String
  {
    try{
    return this.allcategorylist.find(o => o.id == id).name;
    }
    catch(e)
    {
      return 'N/A';
    }
  }

  edit(content)
  {
    this.default();
   // this.getcategory();
    setTimeout(() => {
      this.msg="Update id "+this.info[0];
      this.mytxt=this.info[1];
      $("#inputtxt").val(this.info[1]);

      try{
      var id=null;
      id=this.categorylist.find(o => o.name == this.info[3]).id;
      if(id!=null)
      {
        this.selectedCategory=id;
      }
      else{
        this.selectedCategory=this.categorylist[0].id;
      }
    }
    catch(e)
    {
      this.selectedCategory=this.categorylist[0].id;
    }
     // this.selectedCategory=this.list
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
     //this.getcategory();
      this.default();
      this.msg="Add Media Sub category";
      this.btntxt="add"; 
      this.mytxt="";
      this.is_add=true;
      this.file=null;
      this.selectedCategory=this.categorylist[0].id;
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
      this.hidemodal();
      this.nextData();
		}, (err) => {
			console.log(err);
		});
  }
  onChange(deviceValue) {
  }
  selectedCategory=0;


  categorylist=[];

  allcategorylist=[];
  getcategory(){
    this.rs.get("categories/resources-list").subscribe((res) => {
      this.categorylist=[];
      // for(var i=0;i<res['result'];i++)
      // {
      //   if(res['result'][i].status==1)
      //   {
      //    this.categorylist.push(res['result'][i]);
      //   }
      // }
      //this.categorylist=res['result'];
      for (var i = 0; i < res['result'].length; i++){
            if (res['result'][i].status == 1) { 
                this.categorylist.push(res['result'][i]);
            }
       }
       this.allcategorylist=res['result'];
       this.selectedCategory=this.categorylist[0].id;
       this.categorylist=this.categorylist.sort((a,b)=> {return a.name.localeCompare(b.name)})
			 
		}, (err) => {
			console.log(err);
		});
  }
uploaddata='';
  upload(loader)
  {
    if(this.mytxt=="")
    {
      this.nameinvalid=true;
      return;
    }
    // else if(this.selectedCategory==null)
    // {
    //       this.selectinvalid=true;
    //       this.nameinvalid=false;
    //       return;
    // }
    this.modalService.open(loader, { centered: true,windowClass: 'dark-modal' });
		
      let formData = new FormData();
      if(this.file!=null){ 
       formData.append("image", this.file,this.file.name);
      }
      formData.append("name",this.mytxt);
      formData.append("category_id",this.selectedCategory.toString());
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
  msg;
  fileinvalid=false;
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
  ngOnInit() {
    this.getcategory();
    this.rs.get(this.listurl).subscribe((res) => {
      this.list=res["result"];
      this.dtTrigger.next();
		}, (err) => {
			console.log(err);
		});
    this.dtOptions = {
      paging: false,
      pageLength:100,
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
