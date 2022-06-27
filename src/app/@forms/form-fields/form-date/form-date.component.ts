import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig } from '@app/@forms/@core/interfaces';
import { TimezoneService } from '@app/@ideo/infrastructure/services/timezone.service';
import { FormDate } from './form-date';

@Component({
  selector: 'ideo-form-date',
  templateUrl: './form-date.component.html',
  styleUrls: ['./form-date.component.scss'],
})
export class FormDateComponent extends BaseFieldDirective implements Field, OnInit {
  public config: FieldConfig<FormDate>;
  public group: FormGroup;
  public id: string;


  constructor(private timezoneService: TimezoneService) {
    super();
  }

  fixGetRawValue() {
    class KeepThis extends FormGroup {
      constructor(obj: any, private timezoneService: TimezoneService) {
        super({}, null);
        const keys: string[] = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          this[key] = obj[key];
        }
      }

      public convertUTC(controlName: string): string {
        return this.timezoneService.fromDateTimeToUtc(this?.controls?.[controlName].value);
      }

      public convertMonthToDateIsoString(controlName: string): string {
        const creditCardExpiration: number[] = this?.controls?.[controlName].value?.toString()?.split('-')?.map((i: string) => +i);
        if (!!creditCardExpiration) {
          return new Date(creditCardExpiration[0], creditCardExpiration[1], 1)?.toISOString()
        }
      }


    }
    if (this.config.type == 'datetime-local') {
      const keepThis: KeepThis = new KeepThis(this.group, this.timezoneService);
      const controlName = this.config.name;
      this.group.getRawValue = () => ({
        ...keepThis.getRawValue(),
        [controlName]: keepThis.convertUTC(controlName),
      });
    }
    else if (this.config.type == 'month') {
      const keepThis: KeepThis = new KeepThis(this.group, this.timezoneService);
      const controlName = this.config.name;
      this.group.getRawValue = () => ({
        ...keepThis.getRawValue(),
        [controlName]: keepThis.convertMonthToDateIsoString(controlName),
      });
    }
  }

  ngOnInit(): void {
    !this.config.data?.notReturnDateTime && this.fixGetRawValue()
    if (
      !this.control.value &&
      (this.config.type == 'datetime-local' || this.config.type == 'month') &&
      this.config.value === undefined
    ) {
      if (this.config.type == 'datetime-local') {
        this.control.setValue(new Date().toISOString());
      } else {
        this.control.setValue(new Date().toISOString().split('T')[0]);
      }
    }
  }

  public writeValue(date: string): void {
    if (this.control.value !== date) {
      this.control.setValue(date);
    }
  }
}
