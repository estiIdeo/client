import { AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { Observable } from 'rxjs';

export interface PageFormConfig<T = any> {
  groupConfig: GroupConfig;
  groupConfig$?: Observable<GroupConfig>;
  title?: string;
  title$: Observable<string>;
 // breadcrumbs?: BreadcrumType[];
  submit?: (values: T) => Observable<any>;
  getEntityById?: (id: number) => Observable<T>;
  modifyOnEdit?: (config: GroupConfig, form: FormGroup, data: T) => void;
  appendControl$?: Observable<DynamicFormControl[]>;
}

export interface GroupConfig {
  controls: DynamicFormControl[];
  validation?: ValidatorFn[];
  asyncValidation?: AsyncValidatorFn[];
  errorMessages?: { [error: string]: string };
}
