import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  public static groupBy<T, K>(list: T[], getKey: (item: T) => K): { [key: string]: T[] } {
    if (!list?.length) {
      return null;
    }

    const map = new Map<K, T[]>();
    list.forEach((item) => {
      const key = getKey(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });

    let entries = map.entries();

    return Array.from(entries).reduce((acc, cur, i) => {
      let objKey = (cur[0] as K) + '';
      acc[objKey] = cur[1];
      return acc;
    }, {});
  }

  public static iterate(obj: any, callback: (obj: any, property: string) => void) {
    for (let property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (!(obj[property] instanceof Array) && typeof obj[property] == 'object') {
          this.iterate(obj[property], callback);
        } else {
          callback(obj, property);
        }
      }
    }
  }
}
