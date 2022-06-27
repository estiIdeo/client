import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ErrorMessages } from '@app/@shared/models/error-messages.model';
import { environment } from '@env/environment';
import { IntelligenceKeys } from '@app/@shared/types/IntelligenceKeys.type';
import { translateType } from '@app/@shared/types/translate.type';


@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly serverUrl: string = environment.serverUrl;

  public getOptions(messages?: ErrorMessages, entityName?: boolean | string) {
    return !!messages || !!entityName
      ? {
        params: {
          autoNotification: 'true',
          entity: entityName,
          ...messages,
        },
      }
      : {};
  }

  constructor(private http: HttpClient) { }

  public uploadFile(file: File, action: IntelligenceKeys<'Media'> = 'Media', entityName?: 'Portal.Common.Media' | IntelligenceKeys<translateType>, errorMessages?: ErrorMessages): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('enctype', 'multipart/form-data');
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.serverUrl}/api/${action}`, formData, { headers: headers, ...this.getOptions(errorMessages, entityName) as HttpParams });
  }

  public getFile(mediaId: number,): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/api/Media/${mediaId}`);
  }

  public downloadFile(action: string, name?: string, body: any = null): void {
    let obs: Observable<any>;
    let headers = { 'Access-Control-Expose-Headers': 'Content' };
    if (!!body) {
      obs = this.http.post(`${this.serverUrl}/${action}`, body, { headers, responseType: 'blob' });
    } else {
      obs = this.http.get(`${this.serverUrl}/${action}`, { headers, responseType: 'blob' });
    }
    obs.subscribe((x) => this.createLinkAndDownload(x, name));
  }

  public createLinkAndDownload(file: Blob | any, name?: string) {
    let src = window.URL.createObjectURL(file.body || file);
    var link = document.createElement('a');
    link.download = name;
    link.href = src;
    link.target = '__ifra';
    link.click();
    link.remove();
  }

  public deleteMedia(id: number) {
    // TODO:  function to delete files // if user upload and cancel for exam
  }
}
