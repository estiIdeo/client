import { takeWhile, take } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, forwardRef } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormTextData } from './form-text';

@Component({
  selector: 'ideo-form-text',
  templateUrl: './form-text.component.html',
  styleUrls: ['./form-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextComponent),
      multi: true,
    },
  ],

})
export class FormTextComponent extends BaseFieldDirective<FormControl> implements Field<FormTextData>, OnInit {
  public config: FieldConfig<FormTextData>;
  public group: FormGroup;
  public id: string;

  constructor(private cd: ChangeDetectorRef) {
    super();
  }

  public get disabled(): boolean {
    return this.config?.disabled || this.control?.disabled || null
  }
  ngOnInit(): void {
    if (this.config.disabled) {
      this.control.disable();
    }
    this.control.registerOnDisabledChange((isDisabled) => {
      this.cd.markForCheck()
    })
  }

  public autoGeneratorClicked() {
    this.config.data.autoGeneratorAction(this.config, this.group);
    this.control.valueChanges
      .pipe(
        takeWhile((x) => this.isActive),
        take(1)
      )
      .subscribe((evt) => {
        this.cd.markForCheck();
      });
  }

  public onChange(val: string) {
    if (this.config.type === 'number' && !!val) {
      this.control.setValue(parseFloat(val));
    }
    if (this.config.onChange) {
      this.config.onChange(val, this.control);
    }
  }

  public keyUp(evt: any) {
    if (evt.keyCode == '13') {
      if(!!this.config?.data?.enterClicked ){
        this.config.data.enterClicked(evt.target.value, this.control);
      }
      // if(!!this.config?.submit ){
      //   this.config.submit();
      // }
    }
  }
}
