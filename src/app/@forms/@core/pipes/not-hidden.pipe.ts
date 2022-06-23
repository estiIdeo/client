import { Pipe, PipeTransform } from '@angular/core';
import { DynamicFormControl } from '../interfaces/dynamic-form-control';

@Pipe({
  name: 'notHidden',
})
export class NotHiddenPipe implements PipeTransform {
  /** filter dynamic-form-control how has type of 'hidden'. */
  transform(controls: DynamicFormControl[]): DynamicFormControl[] {
    return controls.filter((ctrl) => ctrl.config.type != 'hidden');
  }
}
