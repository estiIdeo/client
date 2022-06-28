import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../../@ideo/infrastructure/services/query-builder.service';
import { LocaleResourceModel } from '../../../../../@shared/models/locale-resource-model';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class LocaleResourcesService extends BaseHttpService<LocaleResourceModel> {
  public collationName: string = 'localization/localeResources';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }
}
