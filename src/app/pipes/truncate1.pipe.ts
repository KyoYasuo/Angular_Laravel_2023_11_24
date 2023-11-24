import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate1' })

export class TruncatePipe1 implements PipeTransform {
    transform(value: string, limit: number = 20, trail: string = '...'): string {
        //return value.length > limit ? value.substring(0, limit) + trail : value;
        return value.length > limit ? value.split(' ').slice(0,4).join(' ') : value;
    }
}
