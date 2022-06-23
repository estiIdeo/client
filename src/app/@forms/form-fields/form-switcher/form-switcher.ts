import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicFormControl } from '../../@core/interfaces/dynamic-form-control';

export class FormSwitcher {
  constructor(obj: FormSwitcher = null) {
    if (!!obj) {
      const keys: string[] = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this[key] = obj[key];
      }
    }
  }

  public switchDynamicForm: (val: string, ctrl: AbstractControl) => DynamicFormControl[];
  public title?: string;
}
