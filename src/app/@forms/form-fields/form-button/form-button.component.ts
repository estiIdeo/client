import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig } from '@app/@forms/@core/interfaces';
import { FormTextData } from '../form-text/form-text';


@Component({
  selector: 'ideo-form-button',
  templateUrl: './form-button.component.html',
  styleUrls: ['./form-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormButtonComponent extends BaseFieldDirective<FormControl> implements Field<FormTextData>, OnInit {
  public config: FieldConfig<FormTextData>;
  public group: FormGroup;
  public id: string;

  constructor(private cd: ChangeDetectorRef) {
    super();
  }
  ngOnInit(): void {}

  public onClick() {
    if (this.config.type === 'number') {
    }
    if (this.config.onChange) {
    }
  }
}
