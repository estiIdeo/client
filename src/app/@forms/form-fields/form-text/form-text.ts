import { FormGroup, AbstractControl } from '@angular/forms';
import { FieldConfig } from '@app/@forms/@core/interfaces/field-config';
import { DefaultMasks } from '@app/@shared/directives/keyfilter.directive';

type AutoGeneratorAction = (config: FieldConfig, form: FormGroup) => string | void;

export class FormTextData {
  constructor(obj: FormTextData = null) {
    if (!!obj) {
      Object.keys(obj).forEach((key) => (this[key] = obj[key]));
    }
  }

  public autoGenerator?: boolean = false;
  public autoGeneratorLabel?: string = null;
  public autoGeneratorAction?: AutoGeneratorAction = null;
  public rows?: number = null;
  public cols?: number = 4;
  public step?: number = 1;
  public enterClicked?: (val: any, ctrl: AbstractControl) => void;
  public keyFilter: DefaultMasks;
}
