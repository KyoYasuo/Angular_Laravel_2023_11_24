import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { YtPlayerService,PlayerOptions, StateChange, StateType } from 'yt-player-angular';
import { EmbedVideoService } from 'ngx-embed-video';
 declare var $;
 declare var Vimeo;
 declare var Plyr;
@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoplayerComponent implements OnInit {

  constructor(private route:ActivatedRoute,private embedService: EmbedVideoService
 ) { }

  sub;
  id;
  videoId;

  // public onStateChange(stateChange: StateChange): void {
  //   var type=StateType[stateChange.type];
  //   if(type=="PlaybackProgress")
  //   {
  //     this.ytservice.setSize(window.innerWidth,window.innerHeight-92);
  //     this.ytservice.play();
  //   }
  // }

  type;
  audioplayer;
  ngOnInit() {
    this.id=localStorage.getItem("url");
    this.type=localStorage.getItem("type");
    // this.sub = this.route.params.subscribe(params => {
    //   this.id = params['id'];
    //   this.type=params['type'];
    // });
    $('audio').each(function(){
      this.pause(); // Stop playing
      this.currentTime = 0; // Reset time
    }); 
    setTimeout(()=>{
      $("#player").hide();
		$("#matradioplayer").hide();
    },100)
      var player = new Plyr('#player',{
        autoplay:true,
        youtube:{autoplay:true}
      });
      player.on('ready', () => {
        player.play();
      });
      this.type=1;
      this.id=this.id+"?origin={{ httpservice.getWEB() }}";
      if(this.type==1)
      {
        //  this.videoId=this.id; 
        //  $("#player2").hide(); 
        //  $("#made-in-ny").hide(); 
        player.source = {
          type: 'video',
          sources: [
            {
                src: this.id,
                provider: 'youtube'
            },
           ],
        }
        //player.play;

           
      }
      else if(this.type==2){
        player.source = {
          type: 'video',
          sources: [
            {
                src: this.id,
                provider: 'vimeo'
            },
           ],
        }
        player.play();
                      //   var options = {
                      //     id: this.id,
                      //     width: window.innerWidth,
                      //     height:window.innerHeight-92,
                      //     loop: true
                      // };
                      
                      // var player = new Vimeo.Player('made-in-ny', options);

                      // player.on('loaded',function(){
                      //   player.play();
                      // });

                      // $("#player1").hide(); 
                      // $("#made-in-ny").hide();
        }
        else{
          player.source = {
            type: 'video',
            sources: [
              {
                  src: this.id,
                  type: 'video/mp4'
              },
             ],
          }
          player.play;

         //$("#player2").hide(); 
         //$("#made-in-ny").hide();
        }

      // var player = new Plyr('#player');
      // if(this.type==1)
      // {
      //   player.source = {
      //     type: 'video',
      //     sources: [
      //       {
      //           src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      //           type: 'video/mp4'
            
      //       },
      //      ],
      //   }
      //   player.play();  
      // }
      // else if(this.type==2){
                        
      // }

      
      
      
        //this.ytservice.setSize(1920,1080);
     // this.ytservice.setSize(window.innerWidth,window.innerHeight-75);
      //this.ytservice.play();
     // this.yt_iframe_html = this.embedService.embed("https://www.youtube.com/watch?v="+this.id,{attr: { width: window.innerWidth, height: window.innerHeight-102 }});
      //$("iframe").attr("src", $("iframe").attr("src").replace("autoplay=0", "autoplay=1"))







      this.audioplayer = new Plyr('#audioplayer',{
        /*autoplay:true,
        youtube:{autoplay:true}*/
      });
      /*audioplayer.on('ready', () => {
        audioplayer.play();
      });*/
      this.audioplayer.source = {
        type: 'audio',
        sources: [
          {
              src: "https://d2bcuzrp05g45m.cloudfront.net/1582485966_balbir.mp3",
              type: 'audio/mp3'
          },
          ],
      }
      //audioplayer.play;
      //audioplayer.currentTime = 10;

  }
  settime(){
    
    this.audioplayer.currentTime = 10;
  }

}
