import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, first, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CacheInterceptorService implements HttpInterceptor {
  private readonly store: Record<string, Observable<HttpEvent<any>>> = {};

  constructor(@Inject('httpCachePeriod') private cachePeriod: number) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // need to be 'true' or number
    const isCached = req.params.get('cached');

    // Don't cache if it's not cashable
    if (!isCached || req.method !== 'GET') {
      return next.handle(req);
    }

    const cachePeriod = !isNaN(+isCached) && !isNaN(parseInt(isCached)) ? parseInt(isCached) : this.cachePeriod;
    // Check if observable is in cache, otherwise call next.handle

    const paramsToDelete = ['cached']
    let newParams = new HttpParams()
    req?.params.keys().forEach(i => (!paramsToDelete?.includes(i) && isNaN(+i)) ? (newParams = newParams.set(i, req.params?.get(i))) : null) // remove all prams in prams to delete list and all number params
    const newReq = req.clone({ params: newParams })
    const cachedObservable =
      this.store[newReq.urlWithParams] ||
      (this.store[newReq.urlWithParams] = next.handle(newReq).pipe(
        // Filter since we are interested in caching the response only, not progress events
        filter((res) => res instanceof HttpResponse),
        // Share replay will cache the response
        shareReplay(null, (cachePeriod || 300000))
      ));
    // pipe first() to cause the observable to complete after it emits the response
    // This mimics the behavior of Observables returned by Angular httpClient.get()
    // And also makes toPromise work since toPromise will wait until the observable completes.
    return cachedObservable.pipe(first());
  }
}

