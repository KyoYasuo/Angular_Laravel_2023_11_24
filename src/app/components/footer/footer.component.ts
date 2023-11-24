import { Component, OnInit } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { EventService } from '../../services/event.service';

declare var $;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  
  currentYear: any; userRoleId : any; userData: any = [];

  constructor(private rs:ResourcesService, private _event: EventService) { 

    this.currentYear = new Date().getFullYear();

      this.userData = [{role_id: ''}];
      this._event.on('setRoleId').subscribe((e) => {

        if(localStorage.getItem('current_user') != null){
          this.userData = JSON.parse(localStorage.getItem('current_user'));
          this.userRoleId = this.userData.role_id;
        }else{
          this.userRoleId = '';
        }
       localStorage.setItem('userRoleId', this.userRoleId);
      })
  }

  ngOnInit() {
  } 
  email='';
  submit()
  {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    if($("#email").val()!=''){
      if(!regex.test($("#email").val()))
      {
       Swal.fire('','Input valid email','info');
        return;
      }
          let url=new URLSearchParams();
          url.set("email",$("#email").val());
          this.rs.post("media/subs",url).subscribe((res)=>{
              if(res.status=="200")
              {
                  //alert("subscribed successfully");
                  Swal.fire('', 'subscribed successfully', 'success');
              }
              else{
                Swal.fire('Oops...', 'Something went wrong!', 'error');
              }
          },(err)=>{
             console.log(err);
          });
     }
     else{
       Swal.fire('','Enter email','info');
     }

  }

}
