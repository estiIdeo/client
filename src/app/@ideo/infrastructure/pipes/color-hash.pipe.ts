import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorHash',
})
export class ColorHashPipe implements PipeTransform {
  transform(value: string): unknown {
    return this.stringToColour(value);
  }

  private stringToColour(str: string) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
}
