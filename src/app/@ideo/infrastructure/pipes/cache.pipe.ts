import { Pipe, PipeTransform } from '@angular/core';
import { CacheService, CacheModel } from '../../../@shared/services/cache.service';
import { of, Observable } from 'rxjs';

@Pipe({
    name: 'cache',
})
export class cachePipe implements PipeTransform {
    constructor(private cacheService: CacheService<any>) {
    }
    /** return some observable to async pipe will use memory cache if the configuration will be right */
    transform(cache: CacheModel<any> | any): Observable<unknown> {
        if (!cache?.['service']) {
            return of(cache)
        }
        else {
            return this.cacheService.getCache(cache)
        }
    }
}