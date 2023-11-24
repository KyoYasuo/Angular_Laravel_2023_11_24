import { Component, OnInit } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artistfulllist',
  templateUrl: './artistfulllist.component.html',
  styleUrls: ['./artistfulllist.component.scss']
})

export class ArtistfulllistComponent implements OnInit {

  artistlist = {}; loader = true; available = true; msgerr; valarr = []; firsttitle = "A"; indexItem = '0'; secondtitle = "B"; firstarr = []; secondarr = [];

  constructor( private rs:ResourcesService, private router:Router ) { }

  clicked(i,index) {

     this.indexItem = index;
     this.firsttitle=i;
     this.secondtitle=this.arr2[index+1];

     this.firstarr=this.artistlist[i];
     this.secondarr=this.artistlist[this.secondtitle];

     try{
        $("#"+index)[0].scrollIntoView(true);
        document.getElementById("main2").scrollTop -= 100;
     } catch(e){
      console.log(e);
     }
  }

  arr=[['a','A'],['b','B'],['c','C'],['d','D'],['e','E'],['f','F'],['g','G'],['h','H'],['i','I'],['j','J'],['k','K'],['l','L'],['m','M'],['n','N'],['o','O'],['p','P'],['q','Q'],['r','R'],['s','S'],['t','T'],['u','U'],['v','V'],['w','W'],['x','X'],['y','Y'],['z','Z']]
  arr2=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  list=[];  

  ngOnInit() {
    let timestamp = Math.floor((new Date()).getTime() / 1000);
		let old_timestamp = localStorage.getItem('timestamp');
		let flag = true;
		if(old_timestamp) {
			let diff = timestamp - parseInt(old_timestamp);
			if(diff>(86400 * 7)) {
				localStorage.setItem('timestamp', timestamp.toString());
			}
      else {
        flag = false;
      }
		}
		else {
			localStorage.setItem('timestamp', timestamp.toString());
		}
		if(flag===true){
			(<any>$('#modal')).modal('show');
		}
    document.getElementById("main2").scrollTo(0,0);

    this.rs.get('media-authors/alphabet-list').subscribe((res)=>{

      this.list=res['result'];
        for(var i=0;i<this.list.length;i++) {
          if (this.list[i].name.toString().includes("Ustad") || this.list[i].name.toString().includes("Gyani") || this.list[i].name.toString().includes("Giani") ) {
            this.list[i].name2 = this.list[i].name.toString().substr(6);
          } else if (this.list[i].name.toString().includes("Bhai") || this.list[i].name.toString().includes("Prof") || this.list[i].name.toString().includes("Bibi") || this.list[i].name.toString().includes("Sant") ){
            this.list[i].name2 = this.list[i].name.toString().substr(5);
          } else if (this.list[i].name.toString().includes("Dr.") || this.list[i].name.toString().includes("Sri") ) {
            this.list[i].name2 = this.list[i].name.toString().substr(4);
          } else if (this.list[i].name.toString().includes("Dr")) {
            this.list[i].name2 = this.list[i].name.toString().substr(3);
          } else {
            this.list[i].name2=this.list[i].name;
          }

          //replace: Ustad, Gyani, Giani, Bhai, Prof, Bibi, Sant, Dr., Sri, Dr, 

        }

        for(var i=0;i<this.arr.length;i++){
          var val=res['result'].filter((x)=> x.name2.trim().toString().charAt(0) == this.arr[i][0] || x.name2.trim().toString().charAt(0) == this.arr[i][1])
          val=val.filter((x)=>x.status==1);
          if(val.length!=0){  
            this.valarr.push(this.arr[i][1]);
            this.artistlist[this.arr[i][1]]=val;
          }
        }
 
        this.clicked("A",0);
        this.arr2=Object.keys(this.artistlist);
        this.loader=false;
   
    },(err)=>{
        this.available=false;
        this.loader=false;
        this.msgerr=err;
    })
  }

  featuredArtistsClicked(x,i){
    // if(i==0){
    //   this.router.navigate(['artistgurbanilist',this.firstarr[x].id,this.firstarr[x].name]);
    // }
    // else{
		//   this.router.navigate(['artistgurbanilist',this.secondarr[x].id,this.secondarr[x].name]);
    // }
    this.router.navigate(['artistgurbanilist',x.id,x.name]);
	}
}
