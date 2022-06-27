import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { SettingModel } from '../models/setting.model';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class VatService {
  public collationName: string = 'configuration/settings';
  public get apiUrl() {
    return `${environment.serverUrl}/api/${this.collationName}`;
  }

  private vat: number
  private vatInclude: number

  private _vatInclude: Observable<number>

  public get getVatIncludes(): Observable<number> {
    if (!isNaN(this.vatInclude)) {
      return of(this.vatInclude)
    } else if (this._vatInclude instanceof Observable) {
      return this._vatInclude?.pipe(map(x => x + 1))
    } else {
      this._vatInclude = this.setVat()
      return this.getVatIncludes
    }
  }

  constructor(protected http: HttpClient) { }

  public setVat(): Observable<any> {
    return this.http.get<SettingModel>(`${this.apiUrl}/Vat`, {
      params: {
        cached: 'true'
      }
    }).pipe(tap(x => { this.vat = +x; this.vatInclude = +(1 + x) }));
  }
}

