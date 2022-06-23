import { Pipe, PipeTransform } from '@angular/core';
import { DynamicFormControl } from '../interfaces/dynamic-form-control';

@Pipe({
  name: 'isArrayControl',
})
export class IsArrayControlPipe implements PipeTransform {
  transform(dynamicControls: DynamicFormControl[]): DynamicFormControl {
    return dynamicControls.find((ctrl) => ctrl.config.controlType == 'array');
  }
}
