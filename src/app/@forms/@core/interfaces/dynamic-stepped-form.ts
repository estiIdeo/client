import { FormGroup } from '@angular/forms';
import { AnyString } from '@app/@shared/types/any-type.type';
import { DynamicFormControl } from './dynamic-form-control';

// type ObjectChild<T> = T extends Object ? T : null
type onlyObject<T> = Exclude<Exclude<Exclude<Exclude<T, number>, string>, Array<T>>, boolean>
// type onlyObject<T> = Exclude<Exclude<Exclude<Exclude<T, number>, string>, Array>, boolean> //remove <T>
export interface DynamicSteppedForm<T = any, K extends keyof T & string = T extends object ? keyof T & string : any> {
  title?: keyof T & string | AnyString;
  mode?: SteppedFormMode;
  disable?: boolean;
  group: DynamicFormControl<onlyObject<T[K]> & T>[];
  form?: FormGroup;
}

export enum SteppedFormMode {
  Tabbed,
  Bulleted,
  Circled,
}

export enum SteppedFormFooterMode {
  Arrows,
  Paging,
  None,
}
