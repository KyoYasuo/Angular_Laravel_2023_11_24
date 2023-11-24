import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from './services/event.service';
import { Subscription } from 'rxjs';
import { Track } from 'ngx-audio-player';
import { Router } from '@angular/router';
import { NgcCookieConsentService, NgcInitializeEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import {AudioPlayerService} from 'ngx-audio-player/lib/service/audio-player-service/audio-player.service'
 declare var $;
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy{

	/**
     * Get alert configration and set message
     */
    alerts: any = []; playerTitle: any; singerName: any;

    eventSubscriptions: Subscription[] = [];

	private popupOpenSubscription: Subscription;
	private popupCloseSubscription: Subscription;
	private initializeSubscription: Subscription;
	private statusChangeSubscription: Subscription;
	private revokeChoiceSubscription: Subscription;
	private noCookieLawSubscription: Subscription;

    constructor(private _event: EventService,private route:Router,private ccService: NgcCookieConsentService,private modalService: NgbModal) {

    let data = []; this._event.fire('setRoleId', data);
		// created by sagar P to show name on media player
		this._event.on('showSingerName').subscribe((e) => {
			if(localStorage.getItem('singerName') != 'undefined'){
				this.singerName = localStorage.getItem('singerName');
			}else{ this.singerName = '';}
			
			if(localStorage.getItem('playerTitle') != 'undefined'){
				if(this.singerName == ''){
					this.playerTitle = localStorage.getItem('playerTitle');
				}else{
					this.playerTitle = '(' +localStorage.getItem('playerTitle') + ')';
				}
				

			}else{ this.playerTitle = '';}
		})
		// created by sagar P
    }

    /**
     * initial
     */

	msbapDisplayTitle = false; 
	msbapDisplayVolumeControls = true; 

	msaapDisplayTitle = false;
	msaapDisplayPlayList = false;
	msaapDisplayVolumeControls = true;
     
	msaapPlaylist: Track[] = [
	{
	  title: 'Audio One Title',
	  link: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3'
	},
  ];
  private id: string = 'qDuKsiwS5xw';
    ngOnInit() { 
		if(localStorage.getItem('app_download')!='1'){
			localStorage.setItem('app_download', '1');
			$('#modal').modal('show');
		}
		// subscribe to cookieconsent observables to react to main events
		this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
			() => {
			  // you can use this.ccService.getConfig() to do stuff...
			});
	   
		  this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
			() => {
			  // you can use this.ccService.getConfig() to do stuff...
			});
	   
		  this.initializeSubscription = this.ccService.initialize$.subscribe(
			(event: NgcInitializeEvent) => {
			  // you can use this.ccService.getConfig() to do stuff...
			});
	   
		  this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
			(event: NgcStatusChangeEvent) => {
			  // you can use this.ccService.getConfig() to do stuff...
			  if (event.status === 'allow') {
				this.ccService.close(false); // Hide revoke button after accepting cookies
			  }
			});
	   
		  this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
			() => {
			  // you can use this.ccService.getConfig() to do stuff...
			});
	   
			this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
			(event: NgcNoCookieLawEvent) => {
			  // you can use this.ccService.getConfig() to do stuff...
			});

		this.listenAlertEvent();
		if(window.location.pathname == "/"){
			// this.route.navigate(['/home']);
			}
		//$("#t").css("min-height",$("#t").height());
		$("#player").hide();

		// Edit for designing perpose ..
		// this.route.navigate(['/home']);

		//$("#matradioplayer").hide();
		// setTimeout(()=>{

		//   $(".mat-button")[0].click();
		//   $(".mat-butoon")[1].click();
		// },2000);
    }

    /**
     * Subscribe and Listen alerts Events
     */
    listenAlertEvent() {
    	this.eventSubscriptions.push(
	    	this._event.on('show_alert')
	        .subscribe((e) => {
	            this.alerts.push(e.alert);
	        })
    	);
    }

    open2()
    {
      $("#exampleModalCenter").modal('hide');
      $("#exampleModalCenter3").modal('show');
    }
    stop()
    {
      $("#player").hide();
						$("#player audio")[0].pause();
						$("#pauseSong").click();
    }
    ngOnDestroy() {
		// unsubscribe to cookieconsent observables to prevent memory leaks
		this.popupOpenSubscription.unsubscribe();
		this.popupCloseSubscription.unsubscribe();
		this.initializeSubscription.unsubscribe();
		this.statusChangeSubscription.unsubscribe();
		this.revokeChoiceSubscription.unsubscribe();
		this.noCookieLawSubscription.unsubscribe();
		this.eventSubscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.eventSubscriptions = [];
  }
  open(ev)
{
	$('#exampleModalCenter').modal('hide');
}

	radio: any = {
		isPlayingRadio: false,
		src: "",
		img: "",
		title: ""
	}; 
	playRadio(){			
		if(this.radio.isPlayingRadio){
			$('#vid').trigger('pause');
			this.radio.isPlayingRadio = false;
		}
		else {
			$('#vid').trigger('play');
			this.radio.isPlayingRadio = true;
		}
	}
	stopRadio(){
		
		$('#vid').trigger('pause');
		$('#radioPlayer').hide();
	}
}