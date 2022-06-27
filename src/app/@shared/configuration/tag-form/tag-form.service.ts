import { Injectable } from '@angular/core';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '@app/@forms/form-fields/form-text/form-text.component';
import { TagModel } from '../../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagFormService {

  constructor() { }
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
