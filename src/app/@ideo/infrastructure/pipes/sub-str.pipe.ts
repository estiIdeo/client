import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subStr',
})
export class SubStrPipe implements PipeTransform {
  transform(value: string | string[], length: number = 30): string {
    let valueString = Array.isArray(value) ? value.join(', ') : value;
    return `${valueString.substr(0, length)}${valueString.length > length ? '...' : ''}`;
  }
}
