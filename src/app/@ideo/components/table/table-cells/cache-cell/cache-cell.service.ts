import { Injectable, EventEmitter } from '@angular/core';
import { TableColumn } from '../../models/table-column';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CacheCellService {
  public dict: { [key: string]: { [key: string]: any } } = {};
  constructor() { }
  getCache(item: any, col: TableColumn<any>, fieldName: string) {
    return new Promise<any>((resolve, rej) => {
      const mySubscribe = () => {
        const s = this.dict[col.field]?.[fieldId].pipe(take(1)).subscribe((res: any) => {
          s.unsubscribe();
          this.dict[col.field][fieldId] = res;
          resolve(this.dict?.[col.field]?.[fieldId]);
          return;
        });
        return s;
      };

      const createEventEmitterAndSubscribe = () => {
        this.dict[col.field][fieldId] = new EventEmitter();
        const s = mySubscribe();
        this.getFunc(item)?.then((res) => {
          if (!!res) {
            this.dict[col.field][fieldId].next(res);
          } else {
            s.unsubscribe();
            resolve(null);
          }
        });
      };

      const fieldId = item?.[fieldName];
      if (!fieldId) {
        resolve(null);
        return;
      }
      if (col.field && col.field in this.dict && fieldId in this.dict?.[col.field]) {
        if (this.dict[col.field][fieldId] instanceof EventEmitter) {
          mySubscribe();
        } else {
          resolve(this.dict?.[col.field]?.[fieldId]);
          return;
        }
      } else {
        if (col.field && !(col.field in this.dict)) this.dict[col.field] = {};
        createEventEmitterAndSubscribe();
      }
    });
  }

  getFunc: (item: any) => Promise<any>;
}
