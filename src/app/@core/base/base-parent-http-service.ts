import { HttpClient } from '@angular/common/http';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { QueryBuilderService } from '@app/@ideo/infrastructure/services/query-builder.service';
import { ErrorMessages } from '@app/@shared/models/error-messages.model';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { IntelligenceKeys } from '@app/@shared/types/IntelligenceKeys.type';
import { translateType } from '@app/@shared/types/translate.type';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';


export interface AssignFleetsPatchFuncModel {
  assignFleets: (parentId: number, id: number, fleetsIds: number[], entityName?: IntelligenceKeys<translateType> /** get value as argument */, messages?: ErrorMessages) => Observable<any>
}
export abstract class BaseParentHttpService<TParentId, T> {
  public abstract collationName: string;
  public get entityName(): string {
    return 'Common.Api.' + this.collationName?.replace('/', '.')
  }
  public abstract parentRoute: string;
  public apiUrl(parentId: TParentId) {
    return `${environment.serverUrl}/api/${this.parentRoute}/${parentId}/${this.collationName}`;
  }


  public getOptions(messages?: ErrorMessages, AutoNotificationOrEntityName?: boolean | string, queryParams?: { [key: string]: string }) {
    if (!AutoNotificationOrEntityName) 
    return
    if (AutoNotificationOrEntityName === true) AutoNotificationOrEntityName = this.entityName
    return !!messages || !!AutoNotificationOrEntityName
      ? {
        params: {
          autoNotification: 'true',
          entity: AutoNotificationOrEntityName as string,
          ...queryParams,
          ...messages,
        },
      }
      : {};
  }

  constructor(protected http: HttpClient, protected queryBuilder: QueryBuilderService) { }

  public getAll(
    parentId: TParentId,
    evt?: LazyLoadEvent<T>,
  ): Observable<IPagedList<T>> {
    const url = this.queryBuilder.query(`${this.apiUrl(parentId)}`, evt || {} as LazyLoadEvent);
    return this.http.get<IPagedList<T>>(url);
  }

  public get(parentId: TParentId, id: number, useCache?: boolean): Observable<T> {
    return this.http.get<T>(`${this.apiUrl(parentId)}/${id}`, ...!!useCache ? [this.getOptions({ cached: 'true' })] : []);
  }

  public update(
    parentId: TParentId,
    id: number,
    model: T,
    messages?: ErrorMessages,
    AutoNotificationOrEntityName: boolean | string = true,
  ): Observable<T> {
    return this.http.put<T>(`${this.apiUrl(parentId)}/${id}`, model, this.getOptions(messages, AutoNotificationOrEntityName));
  }
  public create(parentId: TParentId, model: any, messages?: ErrorMessages, AutoNotificationOrEntityName: boolean | string = true,): Observable<T> {
    return this.http.post<T>(`${this.apiUrl(parentId)}`, model, this.getOptions(messages, AutoNotificationOrEntityName));
  }
  public bulk(parentId: TParentId, model: T[], messages?: ErrorMessages, AutoNotificationOrEntityName: boolean | string = true,): Observable<T[]> {
    return this.http.post<T[]>(`${this.apiUrl(parentId)}/bulk`, model, this.getOptions(messages, AutoNotificationOrEntityName));
  }
  public delete(parentId: TParentId, id: number, messages?: ErrorMessages, AutoNotificationOrEntityName: boolean | string = true,) {
    return this.http.delete(`${this.apiUrl(parentId)}/${id}`, this.getOptions(messages, AutoNotificationOrEntityName));
  }
}
