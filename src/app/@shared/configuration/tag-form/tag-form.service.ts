import { Injectable } from '@angular/core';
import { DynamicFormControl } from 'src/app/@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from 'src/app/@forms/form-fields';
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
        },
      },
      
    );
    return form;
  }
}
