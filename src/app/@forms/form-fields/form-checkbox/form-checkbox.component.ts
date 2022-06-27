import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig } from '@app/@forms/@core/interfaces';
import { FormCheckbox } from './form-checkbox';


@Component({
  selector: 'ideo-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCheckboxComponent extends BaseFieldDirective implements Field {
  public config: FieldConfig<FormCheckbox>;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }
}
