import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FileService } from '../services/file.service';

@Injectable({
  providedIn: 'root',
})
export class ExportInterceptorService implements HttpInterceptor {
  constructor(private fileService: FileService) {} //, private notifications: NotificationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let isExport = req.params.get('export');

    if (!isExport) return next.handle(req);

    // this.notifications.info('Downloading file...');

    req = req.clone({
      responseType: 'blob',
    });

    return next.handle(req).pipe<any>(
      tap((x) => {
        if (x && x.body) {
          let name: string;
          try {
            let keyValPair = (x.headers.get('content-disposition') as string).split(';').reduce((prv, curr, i) => {
              let splitted = curr.split('=');
              if (splitted?.length > 1) {
                prv[splitted[0].trim()] = splitted[1].trim();
              }
              return prv;
            }, {});
            name = keyValPair['filename'];
          } catch (e) {
            name = document.title;
          }
          this.fileService.createLinkAndDownload(x, name);
        }
      })
    );
  }
}
