import { AbstractControl, FormGroup } from '@angular/forms';

export type CallbackFunction = (item?: any) => FormGroup;
export type ChangedCallBack<T = any, F extends AbstractControl = AbstractControl> = (currentValue: T, control: F) => void;
