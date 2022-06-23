import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acronym',
})
export class AcronymPipe implements PipeTransform {
  transform(value: string[]): string {
    return value?.reduce((prev, curr, i) => {
      prev += curr.toUpperCase()?.[0] || '';
      return prev;
    }, '');
  }
}
