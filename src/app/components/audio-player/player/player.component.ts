import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from './../../../services/player.service';
import { Subscription } from "rxjs";

@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {

    @Input() audioData = [];

    eventSubscriptions: Subscription[] = [];

    isPlaying: boolean = false;
    isRepeat: boolean = false;
    seekTime: any = 0;
    seekTimeKey: any;
    durationTime: any = 0;
    seekPercentage: any = 0;

    constructor(private playerService: PlayerService) { }

    ngOnInit() {
        if (this.audioData.length == 0) {
            return;
        }

        this.audioData.forEach((audio) => {
            audio['playing'] = false;
            audio['active'] = false;
        });

        this.getTracks(this.audioData);

        this.playerServiceEvents();
    }

    playerServiceEvents() {
        let event = this.playerService.playerEvents;

        this.eventSubscriptions.push(
            event.onEnd$
            .subscribe(event$ => this.onEnd()),

            event.playing$
            .subscribe(event$ => this.playing(event$)),

            event.onStop$
            .subscribe(event$ => {
                this.seekPercentage = 0;
            })
        );
    }

    ngOnDestroy() {
        this.eventSubscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.eventSubscriptions = [];
    }


    togglePlay():void {
        if (this.isPlaying) {
            this.pauseTrack();
        } else {
            this.playTrack();
        }
    }

    getTracks(tracks):void {
        // this.audioData = tracks;
        this.playerService.init(tracks);
    }

    selectTrack(track):void {
        this.playerService.playSelectedTrack(track);
    }

    playTrack() {
        this.playerService.play();
    }

    pauseTrack() {
        this.playerService.pause();
    }

    stop() {
        if(this.isPlaying) {
            this.playerService.stop();
        }
    }

    next() {
        this.playerService.playNext();
    }

    previous() {
        this.playerService.playPrevious();
    }

    forward() {
        this.playerService.fastForward(30);
        this.updateSeektime();
    }

    backward() {
        this.playerService.fastBackword(30);
        this.updateSeektime();
    }

    repeat() {
        this.isRepeat = !this.isRepeat;
        this.playerService.repeat(this.isRepeat);
    }

    playing(playing) {
        this.isPlaying = playing;
        this.seekTime = this.getSeektime();
        this.durationTime = this.getDurationTime();

        if (this.isPlaying) {
            this.updateSeektime();
            this.seekTimeKey = setInterval(() => {
                this.updateSeektime();
            }, 1000);
        }else{
            if (this.seekTimeKey) {
                clearInterval(this.seekTimeKey);
            }
        }
    }

    onEnd() {
        if (this.isRepeat) {
            this.stop();
            this.playTrack();
            return;
        }
        this.playerService.playNext();
    }

    getSeektime() {
        // return this.playerService.getSeekTime();
        return this.formatTime(Math.round(this.playerService.getSeekTime()));
    }

    updateSeektime(){
        this.seekTime = this.getSeektime();

        let coreSeekTime = this.playerService.getSeekTime() || 0;
        this.seekPercentage = (((coreSeekTime / this.playerService.getDuration()) * 100) || 0) + '%';
    }

    getDurationTime() {
        return this.formatTime(Math.round(this.playerService.getDuration()));
    }

    formatTime(secs) {
       var minutes = Math.floor(secs / 60) || 0;
       var seconds = (secs - minutes * 60) || 0;

       return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    setSeekPosition(event) {
        if (!this.isPlaying) return[]

        let elemRef = document.querySelectorAll('.seek-bar-wrapper');
        let seekBarWrapperDivWidth = elemRef[0].clientWidth;
        let seekBarDivPos = elemRef[0].getBoundingClientRect();

        // position of seek bar in px where clicked
        let selectedSeekPXPos = event.clientX - Math.round(seekBarDivPos.left);

        // position of seek bar in percentage where clicked
        let selectedSeekPXPerPos = selectedSeekPXPos * 100 / seekBarWrapperDivWidth;

        let selecedSeekTime = this.playerService.getDuration() / 100 * selectedSeekPXPerPos;
        selecedSeekTime = Math.round(selecedSeekTime);

        this.playerService.moveOnSelectedSeek(selecedSeekTime);
        this.updateSeektime();
    }
}
