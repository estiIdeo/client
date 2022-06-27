import { Component, OnInit } from '@angular/core';
import { FormGroupData } from './form-group';
import { FormGroup } from '@angular/forms';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig } from '@app/@forms/@core/interfaces';

@Component({
  selector: 'ideo-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
})
export class FormGroupComponent extends BaseFieldDirective implements Field<FormGroupData> {
  public config: FieldConfig<FormGroupData>;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }
}
