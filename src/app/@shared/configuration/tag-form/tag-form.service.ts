import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from '@app/@core/base/base-http-service';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '@app/@forms/form-fields/form-text/form-text.component';
import { QueryBuilderService } from '@app/@ideo/infrastructure/services/query-builder.service';
import { TagModel } from '../../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagFormService extends BaseHttpService<TagModel> {
  public collationName: string = "Tags";

  constructor(_http: HttpClient, _queryBuilder: QueryBuilderService) {
    super(_http, _queryBuilder);
  }
  generate(): DynamicFormControl<TagModel>[] {
    const form: DynamicFormControl<TagModel>[] = [];
    form.push(
      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          styleClass: 'col-12',
          placeholder:'Tag Name'
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'color',
          type: 'color',
          styleClass: 'col-12',
          placeholder:'Tag Color'
        },
      },
    );
    return form;
  }


}
