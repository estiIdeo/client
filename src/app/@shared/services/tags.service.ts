import { Injectable } from '@angular/core';
import { TagsModel, AutoTagType } from '../models/tags.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { BaseParentHttpService } from '@app/@core/base/base-parent-http-service';
import { QueryBuilderService } from '@app/@ideo/infrastructure/services/query-builder.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { ErrorMessages } from '../models/error-messages.model';




export type TagCount = { readonly General: number } & {
  [key in keyof Omit<typeof AutoTagType, 'None'>]: number
}
@Injectable({
  providedIn: 'root',
})
export class TagsService extends BaseParentHttpService<number, TagsModel> {
  public collationName: string = `Tags`;
  public parentRoute: string = `Partners`;
  private dictionary: { [tagId: number]: Observable<TagsModel> } = {};
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }

  public getTagById(
    parentId: number,
    id: number,
    bufferSize: number = 50,
    windowTime: number = 5 * 60 * 1000,
  ): Observable<TagsModel> {
    if (!this.dictionary[id]) {
      this.dictionary[id] = this.get(parentId, id).pipe(
        shareReplay(
          // {
          // bufferSize:
          bufferSize,
          // windowTime:
          windowTime
          // refCount: false,
          // }
        )
      );
    }

    return this.dictionary[id];
  }

  public count(
    parentId: any,
    evt: LazyLoadEvent,
    messages?: ErrorMessages,
    entityName?: string
  ): Observable<TagCount> {
    const url = this.queryBuilder.query(`${this.apiUrl(parentId)}/Count`, evt);
    return this.http.get<TagCount>(url, this.getOptions(messages, entityName));
  }
}
