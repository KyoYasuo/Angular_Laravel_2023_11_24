import { Pipe, PipeTransform } from '@angular/core';
//import * as moment from 'moment'

@Pipe({name: "Datefilter"})


export class DatefilterPipe implements PipeTransform {
  transform(value: string): string {
   
    let dd = value.substr(8, 2);
    let MM = value.substr(5, 2);

    var months = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'};
  

    let yyyy = value.substr(0, 4);

    let date = `${months[MM]} ${dd}, ${yyyy}`;
    return `${date}`;
  }
}

/* export class DatefilterPipe implements PipeTransform {
transform(date: any, format: string): any {
    if (date) {
     return moment(date).format(format);
    }
  }
} */