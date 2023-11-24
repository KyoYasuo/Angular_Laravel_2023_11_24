import { Component, OnInit, Input, ViewChild, AfterViewChecked, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { AudioPlayerService } from '../../service/audio-player-service/audio-player.service';
import { MatSlider, MatPaginator, MatTableDataSource } from '@angular/material';
import { Track } from '../../model/track.model';
import { BaseAudioPlayerFunctions } from '../base/base-audio-player-components';
import { Options } from 'ng5-slider';
declare var rangeslider;
declare var $;
import {SuiPopupConfig, PopupPlacement} from "ng2-semantic-ui";
declare var slider;
declare var Plyr;
@Component({
    selector: 'mat-advanced-audio-player',
    templateUrl: './mat-advanced-audio-player.component.html',
    styleUrls: ['./mat-advanced-audio-player.component.css'],
    // encapsulation: ViewEncapsulation.None
})
export class MatAdvancedAudioPlayerComponent extends BaseAudioPlayerFunctions implements OnInit, AfterViewInit {
    resstr = "00:00";
    setvalue = null;
    displayedColumns: string[] = ['title', 'status'];
    timeLineDuration: MatSlider;

    dataSource = new MatTableDataSource<Track>();

    paginator: MatPaginator;

    playlistData: Track[];
    clickTime(){
        if(this.setvalue){
            this.audioplayer.currentTime = this.setvalue;
        }
    }
    hidehover(){
        $("#spanhover").hide();
    }
    hover(e){
        let screenwidth = $("body").width();
        let offsetLeft = $("#playerSlider")[0].offsetLeft;
        let l = $("#playerSlider").width();
        let mousePosition = 0;
        if(e.x < 0){
            mousePosition = screenwidth + e.x - offsetLeft ;
            $("#spanhover").css('left', screenwidth + e.x - 15);
        }
        else {
            mousePosition = e.x - offsetLeft ;
            $("#spanhover").css('left', e.x - 15);
        }
        let oo = this.duration /200;
        let k = mousePosition / l;
        let res = Math.round((k * this.duration - (1 - k) * oo) * 100) / 100 ;
        if(k <= 1 && res > 0){
            $("#spanhover").show();
            res = Math.round(res);
            this.setvalue = res;
            this.resstr = "00:00";
            if(res > 3600){
                let hours = Math.floor(res / 3600);
                res = res - hours * 3600;
                let minutes = Math.floor(res / 60);
                res = res - minutes * 60;
                this.resstr = '' + hours + ":" + (minutes < 10?"0"+minutes:minutes) + ":" +  (res < 10?"0"+res:res);
            }
            else {
                let minutes = Math.floor(res / 60);
                res = res - minutes * 60;
                this.resstr = '' + (minutes < 10?"0"+minutes:minutes) + ":" +  (res < 10?"0"+res:res);
            }
            
        }
        else {
            this.setvalue = null;
            //alert('greska !!!!');
        }
        //console.log(this.resstr);
    }
    inputMove(e){
        $("#spanhoverMobile").show();
        setTimeout(function(){
            $("#spanhoverMobile").hide();
        }, 2000);
        $("#playerSlider")[0].offsetLeft;
        let mousePosition = Math.round(e.value / this.duration * 100) / 100 * $("#playerSliderMobile").width() + 10; 
        $("#spanhoverMobile").css('left', mousePosition);
        let res = e.value;
        this.setvalue = res;
        this.resstr = "00:00";
    
        if(res > 3600){
            let hours = Math.floor(res / 3600);
            res = res - hours * 3600;
            let minutes = Math.floor(res / 60);
            res = res - minutes * 60;
            this.resstr = '' + hours + ":" + (minutes < 10?"0"+minutes:minutes) + ":" +  (res < 10?"0"+res:res);
        }
        else {
            let minutes = Math.floor(res / 60);
            res = res - minutes * 60;
            this.resstr = '' + (minutes < 10?"0"+minutes:minutes) + ":" +  (res < 10?"0"+res:res);
        }
        if(this.resstr == "00:00"){
            $("#playerSliderMobile .mat-slider-wrapper").css('left', "2px");
            $("#playerSliderMobile .mat-slider-wrapper").css('right', "2px");
        }else{
            $("#playerSliderMobile .mat-slider-wrapper").css('left', "2px");
            $("#playerSliderMobile .mat-slider-wrapper").css('right', "2px");
        }
    }
    stop()
    {
      $("#player").hide();
     $("#player audio")[0].pause();
     this.pause();
    }

    pause(){
        this.audioplayer.pause();
    }



    @Input()
    displayTitle = true;

    @Input()
    displayPlaylist = true;

    @Input()
    pageSizeOptions = [10, 20, 30];

    @Input()
    expanded = true;

    @Input()
    displayVolumeControls = true;


    constructor(private playlistService: AudioPlayerService,globalConfig:SuiPopupConfig) {
        super();
        globalConfig.placement=PopupPlacement.TopRight;
    }
    value: number = 100;
   
    VolumeDown()
    {
        this.value=this.value-1;
    }

    VolumeUp()
    {
        this.value=this.value+1;
    }
    ngOnInit() {

        $("#text2").hide();
        $("#text").show();
        // $('.text').marquee({
        //     duration: 5000
        // });

        

        this.setDataSourceAttributes();
        this.bindPlayerEvent();
        this.player.nativeElement.addEventListener('ended', () => {
            /*if (this.checkIfSongHasStartedSinceAtleastTwoSeconds()) {
                this.nextSong();
            }*/
        });
        this.playlistService.setPlaylist(this.playlistData);
        this.playlistService.getSubjectCurrentTrack().subscribe((playlistTrack) => {
            this.playlistTrack = playlistTrack;
        });
        this.player.nativeElement.currentTime = 0;
        this.playlistService.init();
    }

    ngAfterViewInit(){
        this.audioplayer = new Plyr('#audioPlayerNew',{
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
                    src: "",
                    type: 'audio/mp3'
                },
                ],
            }
            this.audioplayer.on('playing', () => {
                this.isPlaying = true;
                this.duration = Math.floor(this.audioplayer.duration);
            });
           
            
            this.audioplayer.on('play', () => {                
                $("#playerPlayEvent").click();
            });
            this.audioplayer.on('pause', () => {
                $("#playerPauseEvent").click();
                this.isPlaying = false;
            });
            this.audioplayer.on('timeupdate', () => {
                this.currentTime = Math.floor(this.audioplayer.currentTime);
            });
            this.audioplayer.on('volume', () => {
                this.volume = Math.floor(this.audioplayer.volume);
            });
            this.audioplayer.on('loadstart', () => {
                this.loaderDisplay = true;
            });
            this.audioplayer.on('loadeddata', () => {
                this.loaderDisplay = false;
                this.duration =  Math.floor(this.audioplayer.duration);
            });
            this.audioplayer.on('ended', () => {
                if (this.checkIfSongHasStartedSinceAtleastTwoSeconds()) {
                    this.nextSong();
                }
                else this.audioplayer.restart();
            });
            this.audioplayer.currentTime = 0;
            //this.audioplayer.resetOnEnd = true;
            $(".plyr").hide();
            
    }

    @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    setDataSourceAttributes() {
        let index = 1;
        if (this.playlistData) {
            this.playlistData.forEach(data => {
                data.index = index++;
            });
            this.dataSource = new MatTableDataSource<Track>(this.playlistData);
            this.dataSource.paginator = this.paginator;
        }
    }

    nextSong(): void {
        if (((this.playlistService.indexSong + 1) % this.paginator.pageSize) === 0 ||
            (this.playlistService.indexSong + 1) === this.paginator.length) {
            if (this.paginator.hasNextPage()) {
                this.paginator.nextPage();
            } else if (!this.paginator.hasNextPage()) {
                this.paginator.firstPage();
            }
        }
        this.currentTime = 0;
        this.duration = 0.01;
        this.playlistService.nextSong();
        $("#srcforsong").html(this.playlistTrack[1].link);
        $("#setsrc").click();
        this.play();
    };

    previousSong(): void {
        this.currentTime = 0;
        this.duration = 0.01;
        if (!this.checkIfSongHasStartedSinceAtleastTwoSeconds()) {
            if (((this.playlistService.indexSong) % this.paginator.pageSize) === 0 ||
                (this.playlistService.indexSong) === 0) {
                if (this.paginator.hasPreviousPage()) {
                    this.paginator.previousPage();
                } else if (!this.paginator.hasPreviousPage()) {
                    this.paginator.lastPage();
                }
            }
            this.playlistService.previousSong();
        } else {
            this.resetSong();
        }
        $("#srcforsong").html(this.playlistTrack[1].link);
        $("#setsrc").click();
        this.play();
    };

    resetSong(): void {
        this.player.nativeElement.src = this.playlistTrack[1].link;
    };

    selectTrack(index: number): void {
        console.log('selectTrack(index: number): void: ' + index);
        this.playlistService.selectATrack(index);
        $("#srcforsong").html(this.playlistTrack[1].link);
        $("#setsrc").click();
        setTimeout(() => {
            this.audioplayer.play();
        }, 0);
    };

    change()
    {
        console.log(this.value);
        this.volume=this.value/100;
        this.player.nativeElement.volume=this.volume;
        
    }
    checkIfSongHasStartedSinceAtleastTwoSeconds(): boolean {
        return this.player.nativeElement.currentTime > 2;
    };

    @Input()
    set playlist(playlist: Track[]) {
        this.playlistData = playlist;
        this.ngOnInit();
    }
}