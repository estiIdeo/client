import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from '@app/@core/base/base-http-service';
import { Observable } from 'rxjs';
import { QueryBuilderService } from '../../../../../@ideo/infrastructure/services/query-builder.service';
import { LanguageModel } from '../../../../../@shared/models/language-model';

@Injectable({
  providedIn: 'root',
})
export class LanguagesService extends BaseHttpService<LanguageModel> {
  public collationName: string = 'localization/languages';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }

  public getCultures(onlyExisting: boolean = false): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/cultures${onlyExisting ? '?onlyExisting=true' : ''}`
    );
  }
}
