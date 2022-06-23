import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ideo-form-radio',
  templateUrl: './form-radio.component.html',
  styleUrls: ['./form-radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRadioComponent extends BaseFieldDirective implements Field {
  public config: FieldConfig;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }
}
