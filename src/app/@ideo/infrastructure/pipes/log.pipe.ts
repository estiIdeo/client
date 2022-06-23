import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'log',
})
export class LogPipe implements PipeTransform {
  transform(text: any, debug?: boolean): void {
    console.log(text);
    if (debug) {
      debugger;
    }
  }
}
