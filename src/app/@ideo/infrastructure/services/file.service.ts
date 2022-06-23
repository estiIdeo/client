import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly serverUrl: string = environment.serverUrl;

  constructor(private http: HttpClient) { }

  public uploadFile(file: File, action: string = 'Media'): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('enctype', 'multipart/form-data');
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.serverUrl}/${action}`, formData, { headers: headers });
  }

  public getMedia(mediaId: number, responseType: 'blob' | 'json' | 'arraybuffer' | 'text' = 'blob'): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/api/Media/${mediaId}`, {
      responseType: responseType as any
    });
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
}
