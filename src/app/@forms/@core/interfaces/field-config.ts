import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { EnumType } from 'typescript';
import { CallbackFunction, ChangedCallBack, DynamicFormStepMode, FieldEvent, TranslateSelectItem, SelectItem } from '.';
import { Permission } from '../../../@ideo/infrastructure/permissions/permission';
import { AnyString } from '../../../@shared/types/any-type.type';
import { translateType } from '../../../@shared/types/translate.type';
import { IntelligenceKeys } from '../../../@shared/types/IntelligenceKeys.type';
import { Type } from '@angular/core';

// type OptionalPropertyNames<T> =
//   { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T];

// // Common properties from L and R with undefined in R[K] replaced by type in L[K]
// type SpreadProperties<L, R, K extends keyof L & keyof R> =
//   { [P in K]: L[P] | Exclude<R[P], undefined> };

// type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never // see note at bottom*

// // Type of { ...L, ...R }
// type Spread<L, R> = Id<
//   // Properties in L that don't exist in R
//   & Pick<L, Exclude<keyof L, keyof R>>
//   // Properties in R with types that exclude undefined
//   & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
//   // Properties in R, with types that include undefined, that don't exist in L
//   & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
//   // Properties in R, with types that include undefined, that exist in L
//   & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
// >;
export interface FieldConfig<DataModal = any, TModal = any, K extends AbstractControl = AbstractControl> {
  name: TModal extends object ? ((keyof Omit<TModal, keyof [] | keyof Date>) & string | AnyString) : string;
  type?:
  | 'hidden'
  | 'text'
  | 'password'
  | 'number'
  | 'datetime-local'
  | 'date'
  | 'month'
  | 'week'
  | 'time'
  | 'tel'
  | 'color'
  | 'label'
  | 'separator';
  controlType?: 'control' | 'group' | 'array' | 'none';
  autoShowErrors?: boolean;
  hide?: boolean; // for the form array filters 
  disabled?: boolean;
  // disabledaction?: (item: T) => boolean;
  disabled$?: Observable<boolean>;
  label?: IntelligenceKeys<translateType>;
  optionsArr?: SelectItem[];
  optionsArr$?: Observable<SelectItem[]>;
  placeholder?: string;
  // data?: AnyObject & (DataModal extends object ? Spread<DataModal, keyValuePairPipeDataObject<TModal>>  : keyValuePairPipeDataObject<TModal>)
  data?: DataModal;
  styleClass?: string;
  // style?: { [property: string]: string };
  fieldStyleClass?: string;
  labelStyleClass?: string;
  inputStyleClass?: string;
  validation?: ValidatorFn[];
  asyncValidation?: AsyncValidatorFn[];
  errorMessages?: { [error: string]: ((IntelligenceKeys<translateType>) | TranslateSelectItem) };
  createItem?: CallbackFunction;
  value?: TModal extends object ? TModal[keyof Omit<TModal, keyof [] | keyof Date>] : any;
  viewTypeInline?: boolean; // default display of key value pair is block
  keyValueEnum?: Type<EnumType>;
  keyValueFlexSize?: number;
  nestedValue?: any;
  mode?: DynamicFormStepMode;
  description?: string;
  setter?: Observable<FieldEvent> | Subject<FieldEvent>;
  onChange?: ChangedCallBack<TModal extends object ? TModal[keyof Omit<TModal, keyof [] | keyof Date>] : any, K>;
  onBlur?: (control: AbstractControl) => void;
  icon?: string;
  startInvisible?: boolean;
  permission?: Permission;
  submit?: () => void;
  registerControl?: (ctrl: AbstractControl) => void;
}
