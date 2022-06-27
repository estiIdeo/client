import { Type } from '@angular/core';
import { FormGroup, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { DynamicSteppedForm } from '@app/@forms/@core/interfaces/dynamic-stepped-form';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ObjWithObjectKeys } from '../types/object-with-object-keys.type';

export interface WizardFormConfig<T = any> {
  arrayConfig: ArrayConfig;
  arrayConfig$?: Observable<ArrayConfig>;
  formChanged$?: Subject<StepFormGroup>;
  // stepBody?: { activeClass?: string, inactiveClass?: string };
  wizardBody?: Subject<WizardBody> | BehaviorSubject<WizardBody> | WizardBody;
  title?: string;
  title$: Observable<string>;
  // breadcrumbs?: BreadcrumType[];
  submit: (values: T) => Observable<any>;
  getEntityById?: (id: number) => Observable<T>;
  toForm?: (entity: T) => { [name: string]: FormGroup };
  fromForm?: (value: { [name: string]: FormGroup }) => FormGroup[];
  modifyOnEdit?: (config: ArrayConfig, form: FormGroup, data: T) => void;
  sidebarComponents?: Type<any>[];
  appendForm$?: Observable<DynamicSteppedForm>;
}

export interface WizardBody {
  mode?: 'Edit' | 'Create' | 'Not Found' | 'Action' | 'Dined';
  title?: string;
  useStepperService?: boolean
  removeAutoNotification?: boolean;
  // subTitle?: string;
  // entityName?: string
  // message?: string;
  closeUrl?: string[];
  submitMessage?: string;
  // cancelMessage?: string;
}

export interface ArrayConfig {
  controls: DynamicSteppedForm[];
  validation?: ValidatorFn[];
  asyncValidation?: AsyncValidatorFn[];
  errorMessages?: { [error: string]: string };
}

export type StepFormGroup<T = {}> = {
  controls: {
    forms: { controls: (ObjWithObjectKeys<T, FormGroup> & ObjWithObjectKeys<any, (ObjWithObjectKeys<T, FormGroup>)>)[] }
  }
} & FormGroup;

export type StepFormGroupGetRawValue<T = {}> = {
  forms: (T & ObjWithObjectKeys<any, T>)[]
};