import { HttpClient, HttpParams } from "@angular/common/http";
import { LazyLoadEvent } from "@app/@ideo/components/table/events/lazy-load.event";
import { QueryBuilderService } from "@app/@ideo/infrastructure/services/query-builder.service";
import { ErrorMessages } from "@app/@shared/models/error-messages.model";
import { IPagedList } from "@app/@shared/models/paged-list.response";
import { environment } from "@env/environment";
import { Observable } from "rxjs";


export abstract class BaseHttpService<T = any> {
  public abstract collationName: string;
  public get entityName(): string {
    return 'Common.Api.' + this.collationName?.split('/')?.map(i => i[0]?.toUpperCase() + i?.slice(1)).join('.')
  }
  public get apiUrl() {
    return `${environment.serverUrl}/api/${this.collationName}`;
  }

  public getOptions(messages?: ErrorMessages, AutoNotificationOrEntityName?: boolean | string) {
    if (AutoNotificationOrEntityName === false) return
    if (AutoNotificationOrEntityName === true) AutoNotificationOrEntityName = this.entityName
    return !!messages || !!AutoNotificationOrEntityName
      ? {
        params: {
          autoNotification: 'true',
          entity: AutoNotificationOrEntityName as string,
          ...messages,
        },
      }
      : {};
  }
  constructor(protected http: HttpClient, protected queryBuilder: QueryBuilderService) { }

  public getAll(evt?: LazyLoadEvent<T>, queryParams?: HttpParams | {
    [param: string]: string | string[];
  }): Observable<IPagedList<T>> {
    const params = { ...evt?.queryParams || {}, ...queryParams || {} };
    const url = this.queryBuilder.query(`${this.apiUrl}`, evt || {} as LazyLoadEvent);
    return this.http.get<IPagedList<T>>(url, !!params ? { params: params } : {});
  }

  public get(id: number, useCache?: boolean): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`, ...!!useCache ? [this.getOptions({ cached: 'true' })] : []);
  }
  public update(id: number, model: T, AutoNotificationOrEntityName: boolean | string = true, handelMessages?: ErrorMessages): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, model, this.getOptions(handelMessages, AutoNotificationOrEntityName));
  }

  public create(model: any, AutoNotificationOrEntityName: boolean | string = true, handelMessages?: ErrorMessages): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}`, model, this.getOptions(handelMessages, AutoNotificationOrEntityName));
  }
  public bulk(model: T[], AutoNotificationOrEntityName?: boolean | string, handelMessages?: ErrorMessages): Observable<T[]> {
    return this.http.post<T[]>(`${this.apiUrl}/bulk`, model, this.getOptions(handelMessages, AutoNotificationOrEntityName));
  }

  public delete(id: number | string, AutoNotificationOrEntityName: boolean | string = true, handelMessages?: ErrorMessages) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getOptions(handelMessages, AutoNotificationOrEntityName));
  }
}
