import { ViewChild, ElementRef } from "@angular/core";
import { MatSlider } from "@angular/material";
declare var $;
export class BaseAudioPlayerFunctions {

    @ViewChild('audioPlayer', {static: true}) player: ElementRef;
    timeLineDuration: MatSlider;

    loaderDisplay: boolean = false;
    isPlaying: boolean = false;
    currentTime: number = 0;
    volume: number = 0.1;
    duration: number = 0.01;
    
    currTimePosChanged(event) {
        this.player.nativeElement.currentTime = event.value;
    }
    currTimePosChangednext() {
        this.player.nativeElement.currentTime = this.player.nativeElement.currentTime+15;
    }

    currTimePosChangedprev() {
        this.player.nativeElement.currentTime = this.player.nativeElement.currentTime-15;
    }

    bindPlayerEvent(): void {
        this.player.nativeElement.addEventListener('playing', () => {
            this.isPlaying = true;
            this.duration = Math.floor(this.player.nativeElement.duration);
        });
        this.player.nativeElement.addEventListener('pause', () => {
            this.isPlaying = false;
        });
        this.player.nativeElement.addEventListener('timeupdate', () => {
            this.currentTime = Math.floor(this.player.nativeElement.currentTime);
        });
        this.player.nativeElement.addEventListener('volume', () => {
            this.volume = Math.floor(this.player.nativeElement.volume);
        });
        this.player.nativeElement.addEventListener('loadstart', () => {
            this.loaderDisplay = true;
        });
        this.player.nativeElement.addEventListener('loadeddata', () => {
            this.loaderDisplay = false;
            this.duration = Math.floor(this.player.nativeElement.duration);
        });
    };

    playBtnHandler(): void {
        if(this.loaderDisplay) {
            return;
        }
        if (this.player.nativeElement.paused) {
            console.log("play");
            this.player.nativeElement.play(this.currentTime);
           // $(".text").hide();
            //$(".text2")
           // $(".text2").toggleClass("in out");;
        } else {
            console.log("paused");
            this.currentTime = this.player.nativeElement.currentTime;
            this.player.nativeElement.pause();
           // $(".text").show();
            //$(".text2").toggleClass("in out");
        }
    };

    play(): void {
        setTimeout(() => {
            console.log("play");
            this.player.nativeElement.play();
            $("#text").hide();
            $("#text2").show();
        }, 0);
    };

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