import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SelectItem } from '../interfaces';

@Pipe({
  name: 'hasError',
})
export class HasErrorPipe implements PipeTransform {
  transform(errors: SelectItem[], control: AbstractControl): any {
    return errors.filter((e) => !!control?.errors?.[e.value]);
  }
}
