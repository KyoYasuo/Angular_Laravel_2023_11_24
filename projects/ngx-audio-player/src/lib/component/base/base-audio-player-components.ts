import { ViewChild, ElementRef } from "@angular/core";
import { MatSlider } from "@angular/material";
declare var $;
export class BaseAudioPlayerFunctions {

    @ViewChild('audioPlayer', {static: true}) player: ElementRef;
    @ViewChild('audioPlayerNew', {static: true}) audioPlayerNew: ElementRef;
    timeLineDuration: MatSlider;

    playlistTrack: any;
    loaderDisplay: boolean = false;
    isPlaying: boolean = false;
    currentTime: number = 0;
    volume: number = 0.1;
    duration: number = 0.01;
    audioplayer;
    
    currTimePosChanged(event) {
        this.audioplayer.currentTime = event.value;
    }
    currTimePosChangednext() {
        this.audioplayer.currentTime = this.audioplayer.currentTime+15;
    }

    currTimePosChangedprev() {
        this.audioplayer.currentTime = this.audioplayer.currentTime-15;
    }

    bindPlayerEvent(): void {
        this.player.nativeElement.addEventListener('playing', () => {
            /*this.isPlaying = true;
            this.duration = Math.floor(this.player.nativeElement.duration);
            let x = $("#radioPlayer");
            $(x).hide();
            
            $('#vid').trigger('pause');
            $("#radioPlayer").hide();*/
        });
        

        this.player.nativeElement.addEventListener('pause', () => {
            //this.isPlaying = false;
        });
        this.player.nativeElement.addEventListener('timeupdate', () => {
            //this.currentTime = Math.floor(this.player.nativeElement.currentTime);
        });
        this.player.nativeElement.addEventListener('volume', () => {
            //this.volume = Math.floor(this.player.nativeElement.volume);
        });
        this.player.nativeElement.addEventListener('loadstart', () => {
            //this.loaderDisplay = true;
        });
        this.player.nativeElement.addEventListener('loadeddata', () => {
            /*this.loaderDisplay = false;
            this.duration = Math.floor(this.player.nativeElement.duration);*/
        });
    };

    
    playBtnHandler(): void {
        if(this.loaderDisplay) {
            return;
        }
        if (this.audioplayer.paused) {
            console.log("play");
            this.audioplayer.currentTime = this.currentTime;
            
            this.audioplayer.play();
            //this.player.nativeElement.play(this.currentTime);
           // $(".text").hide();
            //$(".text2")
           // $(".text2").toggleClass("in out");;
        } else {
            console.log("paused");
            //this.currentTime = this.player.nativeElement.currentTime;
            this.currentTime =this.audioplayer.currentTime;
            this.audioplayer.pause();
            //this.player.nativeElement.pause();
           // $(".text").show();
            //$(".text2").toggleClass("in out");
        }
    };

    play(): void {
        $("#closePlayerRadio").click();
        $("#playerSliderMobile .mat-slider-wrapper").css('left', "2px");
        $("#playerSliderMobile .mat-slider-wrapper").css('right', "2px");
        setTimeout(() => {
            this.audioplayer.play();
            //this.player.nativeElement.play();
            $("#text").hide();
            $("#text2").show();
        }, 0);
    };
    setsrc(){
        let x = $("#srcforsong").html().replaceAll('&amp;', '&');
        this.audioplayer.source = {
            type: 'audio',
            sources: [
                {
                    src: x,
                    type: 'audio/mp3'
                },
                ],
        }
    }

    toggleVolume() {
        if (this.volume === 0) {
            this.setVolume(1.0);
        } else {
            this.setVolume(0);
        }
    }

    change()
    {
        console.log("changed");
    }

    private setVolume(vol) {
        this.volume = vol;
        this.player.nativeElement.volume = this.volume;
    }

}