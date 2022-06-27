import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig } from '@app/@forms/@core/interfaces';;
import { FormGroup } from '@angular/forms';
import { NgbRadioButton } from './ngb-radio-button';

@Component({
  selector: 'ideo-form-ngb-radio-buttons',
  templateUrl: './form-ngb-radio-buttons.component.html',
  styleUrls: ['./form-ngb-radio-buttons.component.scss'],
})
export class FormNgbRadioButtonsComponent extends BaseFieldDirective<FormGroup> implements Field, OnInit {
  @Input() public config: FieldConfig<NgbRadioButton>;
  @Input() public group: FormGroup;
  public id: string;

  constructor(private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    // this.control?.valueChanges.pipe(untilDestroyed(this), distinctUntilChanged()).subscribe(val => {
    //   this.config?.onChange && this.config.onChange(val, this.control);
    //   this.cd?.markForCheck()
    // })
  }
}
