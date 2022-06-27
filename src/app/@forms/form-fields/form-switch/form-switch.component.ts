import { Component } from '@angular/core';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig } from '@app/@forms/@core/interfaces';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ideo-form-switch',
  templateUrl: './form-switch.component.html',
  styleUrls: ['./form-switch.component.scss'],
})
export class FormSwitchComponent extends BaseFieldDirective implements Field {
  public config: FieldConfig;
  public group: FormGroup;
  public id: string;

  public get disabled(): boolean {
    return this.config?.disabled || this.control?.disabled || null
  }

  constructor() {
    super();
  }
}
