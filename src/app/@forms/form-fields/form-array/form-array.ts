import { Observable, Subject } from 'rxjs';
import { ValidatorFn, FormGroup, AsyncValidatorFn } from '@angular/forms';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { FieldEvent } from '@app/@forms/@core/interfaces';
// import { DynamicFormStepMode } from '@app/@forms/@core/interfaces';
// import { Permission } from '@app/@ideo/infrastructure/permissions/permission';

export type FormArraySetter = { controlIndex?: number | 'add', controlName: string, setter: FieldEvent, control?: FormGroup }

export class FormArrayData {
  constructor(obj: FormArrayData = null) {
    if (!!obj) {
      const keys: string[] = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this[key] = obj[key];
      }
    }
  }

  public setter?: (Observable<FormArraySetter> | Subject<FormArraySetter>)[];
  public dynamicConfig?: (index: number, item: any) => DynamicFormControl[];
  public formConfig: DynamicFormControl[];
  public nestedConfig?: DynamicFormControl[];
  public title?: string;
  public addLabel?: string;
  public isRoot?: boolean;
  public showSeparator?: boolean = true;
  public showAddingMode?: boolean = false;
  public disableAddAndRemoveMode?: boolean = false;
  public removePermission?: any;//Permission = null;
  public hideShowAndHideListButton?: boolean
  public addPermission?: any;//Permission = null;
  public disabled?: boolean;
  public data?: any[] = null;
  public disabled$?: Observable<boolean>;
  public onRemove?: (item: any) => void;
  public groupValidations?: ValidatorFn[] = [];
  public asyncGroupValidations?: AsyncValidatorFn[] = [];
  public errorMessages?: { [error: string]: string };
  public hideTableHead?: boolean = false;
  public tableStyleClass?: string;
  public inputsMode?: any;//DynamicFormStepMode = DynamicFormStepMode.TableCell;
  // public filters?: DynamicFormControl[]
  // public applyFilters?: (control: FormArray, formConfig: DynamicFormControl[], filters: any) => void
  public useGlobalFilter?: boolean
}
