import { Injectable } from '@angular/core';
import { IdeoModule } from '../../ideo.module';

@Injectable({
  providedIn: 'root',
})
export class StringHelperService {
  constructor() { }
  private randomStrs: string[] = [];

  public randomStr(size: number = 5, numericOnly: boolean = false): string {
    let rand: string = '';
    for (let i = 0; i < 4; i++) {
      rand += Math.random()
        .toString(36)
        .replace(numericOnly ? /[^0-9]+/g : /[^a-z]+/g, '');
    }
    let str = rand.substr(0, size);
    if (!this.randomStrs.includes(str)) {
      this.randomStrs.push(str);
      return str;
    } else {
      return this.randomStr(size, numericOnly);
    }
  }

  public paddLeft(val: string, size: number, char: string = '0'): string {
    let s = val + '';
    while (s.length < size) s = char + s;
    return s;
  }

  public toPascal(str: string): string {
    return !!str && !!str.length ? `${str.charAt(0).toUpperCase()}${str.substr(1)}` : '';
  }

}
