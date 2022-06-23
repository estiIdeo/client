
import { SelectItem } from '../../@core/interfaces';

export class FormAutoComplete<T = SelectItem> {
  constructor(obj: FormAutoComplete = null) {
    if (!!obj) {
      const keys: string[] = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this[key] = obj[key];
      }
    }
  }


  public optionLimit: number
  public allowAnyString?: boolean

  public showClear?: boolean = false;
  public dataKey?: keyof T | '' | 'value' = 'value';
  // public formatter: (item: T) => ValueOfType<T>;
  // public optionsFetcher: (ctrl: FormControl, query: any) => Observable<T[]>;
  // public resolveLabel?: (config: FieldConfig<FormAutoComplete<T>>, group: FormGroup) => Promise<string> | string = (
  //   config,
  //   ctrl
  // ) => null;
}
