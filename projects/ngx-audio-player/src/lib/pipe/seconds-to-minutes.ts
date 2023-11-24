import { Pipe, PipeTransform } from '@angular/core';
/*
 * Transform seconds to minutes:seconds
 * Example : 270 -> 02:30
*/
@Pipe({name: 'secondsToMinutes'})
export class SecondsToMinutesPipe implements PipeTransform {
    transform(time: number): string {
        if(time > 0){
            if(time > 3600){
                let hours = ("0" + Math.floor(time / 3600)).slice(-2);
                time = time%3600;
                let minutes = ("0" + Math.floor(time / 60)).slice(-2);
                let seconds = ("0" + time % 60).slice(-2);
                return `${hours}:${minutes}:${seconds}`;
            }
            let minutes = ("0" + Math.floor(time / 60)).slice(-2);
            let seconds = ("0" + time % 60).slice(-2);
            return `${minutes}:${seconds}`;
        }
        return "00:00";
    }
}