import { Injectable, EventEmitter, Type, Injector } from '@angular/core';
import { BaseHttpService } from '../../@core/base/base-http-service';
import { of, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LazyLoadEvent } from '../../@ideo/components/table/events/lazy-load.event';
import { BaseParentHttpService } from 'src/app/@core/base/base-parent-http-service';

export interface CacheModel<T = any> {
  service: Type<BaseHttpService<T>> | Type<BaseParentHttpService<number, T>>;
  TParentId?: number;
  id: number;
  parsedKey?: (item: T) => (T[keyof T] | string);
  key?: keyof T;
  evt?: LazyLoadEvent;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService<T = any> {
  // best practice it to save the key besides the all item
  public dict: { [serviceName: string]: { [id: string]: (EventEmitter<T | T[]>) | (T | T[])  /** | ({ [key: string]: (EventEmitter<T> | T) })*/ } } = {};
  constructor(private _injector: Injector) { }
  clear() {
    this.dict = {};
  }
  getCache(cache: CacheModel<T>): Observable<T | T[] | T[keyof T] | string> {
    const service = this._injector.get(cache.service) as BaseHttpService<T> | BaseParentHttpService<number, T>;
    const serviceName: string = service.entityName; // must be uniq
    // console.log(serviceName)
    const { key, id, evt, TParentId, parsedKey } = cache;
    if (!id || !service || !serviceName) {
      return of(null);
    }
    if (serviceName in this.dict && id in this.dict[serviceName]) {
      const item = this.dict[serviceName][id]
      if (item instanceof EventEmitter) {
        return this.mySubscribe(serviceName, id, key, parsedKey, item);
      } else {
        return of(this.fixValue(item, key, parsedKey))
      }
    } else {
      if (!(serviceName in this.dict)) {
        this.dict[serviceName] = {};
      }
      return this.createEventEmitterAndSubscribe(serviceName, id, key, parsedKey, TParentId, evt, service);
    }
  }

  private fixValue = (item: T | T[], key: CacheModel<T>['key'], parsedKey: CacheModel<T>['parsedKey']): T | T[] | T[keyof T] | string => {
    if (Array.isArray(item)) {
      return item
    }
    else if (!!parsedKey) {
      const resParse = parsedKey(item as T)
      return resParse
    } else {
      const resKey = (item as T)?.[key] || item
      return resKey
    }
  }

  private mySubscribe: (serviceName: string, id: number, key: CacheModel<T>['key'], parsedKey: CacheModel<T>['parsedKey'], itemEvent: EventEmitter<T | T[]>) => Observable<T | T[] | T[keyof T] | string> = (
    serviceName: string, id: number, key: CacheModel<T>['key'], parsedKey: CacheModel<T>['parsedKey'], itemEvent: EventEmitter<T | T[]>) => itemEvent
      .pipe(
        map((item: T | T[]) => {
          this.dict[serviceName][id] = item
          return this.fixValue(item, key, parsedKey)
        }),
        tap(x => !!itemEvent?.length && itemEvent?.complete),
      );

  private createEventEmitterAndSubscribe = (
    serviceName: string, id: number, key: CacheModel<T>['key'], parsedKey: CacheModel<T>['parsedKey'], TParentId: number, evt: CacheModel<T>['evt'], service: CacheModel<T>['service'] | any /** BaseHttpService<T> | BaseParentHttpService<number, T> */
  ) => {
    const itemEvent: EventEmitter<T | T[]> = new EventEmitter<T | T[]>()
    this.dict[serviceName][id] = itemEvent
    const buildArgs = (param: number | LazyLoadEvent) =>
      !!TParentId
        ? [TParentId, param, { 200: 'false', cached: 'true' }, null]
        : [param, null, { 200: 'false', cached: 'true' }];
    const call = (call: Observable<any>) =>
      call?.toPromise()?.then((res) => !!res && itemEvent.next(res as T | T[]));
    if (!evt) {
      call(service.get(...buildArgs(id)));
    } else {
      call(service.getAll(...buildArgs(evt)));
    }
    return this.mySubscribe(serviceName, id, key, parsedKey, itemEvent)
  };
}
