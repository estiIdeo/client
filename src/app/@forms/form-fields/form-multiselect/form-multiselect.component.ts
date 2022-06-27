import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig } from '@app/@forms/@core/interfaces';
import { FormMultiSelectDataModel } from './form-multiselect.data.model';

@Component({
  selector: 'ideo-form-multiselect',
  templateUrl: './form-multiselect.component.html',
  styleUrls: ['./form-multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormMultiselectComponent extends BaseFieldDirective implements Field<FormMultiSelectDataModel> {
  public config: FieldConfig<any>;
  public group: FormGroup;
  public id: string;

  public get data(): FormMultiSelectDataModel {
    return this?.config?.data
  }

  constructor() {
    super();
  }

  getValue(evt: any): any[] {
    return Array.from(evt.target.selectedOptions).map((option: any) => option.value);
  }

  valueChange(val: { value: any[], options: any[] }): void {
    !!Array.isArray(val.value) && !!this.data?.onOptionChange && this.data?.onOptionChange(val?.options);
    !!Array.isArray(val.value) && !!this.config.onChange && this.config.onChange(val?.value, this.control);
  }
}
