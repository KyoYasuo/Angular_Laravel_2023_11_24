import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titlereplace' })

export class TitlereplacePipe implements PipeTransform {
    transform(value: string): string {
        var punjabiRepalce = value.replace('Punjabi', '');
        var englishRepalce = punjabiRepalce.replace('English', '')
        return englishRepalce;
    }
}
