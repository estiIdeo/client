import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig } from '@app/@forms/@core/interfaces';
import { FormArrayData } from '../form-array/form-array';

@Component({
  selector: 'prx-form-inilne-array',
  templateUrl: './form-inilne-array.component.html',
  styleUrls: ['./form-inilne-array.component.scss']
})
export class FormInilneArrayComponent extends BaseFieldDirective<FormArray> implements Field<FormArrayData>, OnInit {
  public config: FieldConfig<FormArrayData>;
  public group: FormGroup;
  public id: string;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit(): void {
    if (!(this.control instanceof FormArray)) {
      this.group.removeControl(this.config.name);
      this.group.addControl(
        this.config.name,
        this.fb.array([], this.config.validation || [], this.config.asyncValidation || [])
      );
    }
  }

}
