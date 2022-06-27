import { Observable, timer } from 'rxjs';
import {
  FormGroup,
  ValidatorFn,
  AsyncValidatorFn,
  ValidationErrors,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import * as properties from 'src/app/prototypes'

export class IdeoValidators {
  public static groupValidations(getErrorNames: (values: any) => string): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } => {
      let errorName = getErrorNames((group as FormGroup).getRawValue());
      return !errorName
        ? null
        : {
          [errorName]: {
            valid: false,
          },
        };
    };
  }

  public static controlValidations(getErrorNames: (value: any) => string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let errorName = getErrorNames(control.value);
      return !errorName
        ? null
        : {
          [errorName]: {
            valid: false,
          },
        };
    };
  }

  public static requiredIfOtherFieldValid(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let otherControl = control.parent && control.parent.controls[controlName];
      return !!otherControl && !!otherControl.valid
        ? null
        : {
          [controlName]: {
            valid: false,
          },
        };
    };
  }
  public static requiredIfOtherFieldHasThisValue(controlName: string, val: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const otherControl = control?.parent && control.parent?.controls?.[controlName];
      return !!otherControl && !!otherControl.value !== val
        ? {
          [controlName]: {
            valid: false,
          },
        } : null
    };
  }

  public static dynamicMax(propertyName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const otherControlVal = control?.parent?.controls[propertyName]?.value; //control.parent && control.parent.controls[controlName];
      return !control?.value || (!!otherControlVal && parseFloat(control.value) <= parseFloat(otherControlVal))
        ? null
        : {
          dynamicMax: {
            valid: false,
          },
        };
    };
  }

  public static requiredIfOtherFieldTrue(controlName: string, dependantControlNames: string[]): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!group) {
        return null;
      }
      let otherControl = (group as FormGroup).controls[controlName];
      if (!!otherControl && !!otherControl.value) {
        let valid: boolean = true;
        var dict = {};

        for (let i = 0; i < dependantControlNames.length; i++) {
          const name = dependantControlNames[i];
          let control = (group as FormGroup).controls[name];
          if (!!control) {
            control.setValidators([Validators.required]);
            valid = !!valid && !!control.value;
            if (!control.value) {
              dict[name] = { valid: !!control.value };
            }
          }
        }
        return !valid ? dict : null;
      } else if (!!otherControl) {
        for (let i = 0; i < dependantControlNames.length; i++) {
          const name = dependantControlNames[i];
          let control = (group as FormGroup).controls[name];
          if (!!control) {
            control.clearValidators();
          }
        }
      }

      return null;
    };
  }

  public static greaterThanOrEquals(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!!control?.parent) {
        let otherControl = control.parent.controls[controlName] as AbstractControl;
        if (!!otherControl) {
          const current = parseFloat(control?.value || '0');
          const other = parseFloat(otherControl?.value || '0');
          let inValid = current <= other;
          if (inValid) {
            setTimeout(() => {
              otherControl.updateValueAndValidity({ onlySelf: false, emitEvent: true });
            });
          }
          return inValid
            ? {
              [controlName]: {
                valid: false,
              },
            }
            : null;
        }
      }
      return null;
    };
  }

  public static dateGreaterThanOrEquals(otherCtrl: AbstractControl, additionalHour: number = 0): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!!control?.parent) {
        let otherControl = otherCtrl as AbstractControl;
        if (!!otherControl) {
          const current = new Date(control?.value);
          const other = new Date(otherControl?.value).addHours(additionalHour);
          let inValid = current <= other;
          if (inValid) {
            setTimeout(() => {
              otherControl.updateValueAndValidity({ onlySelf: false, emitEvent: true });
            });
          }
          return inValid
            ? {
              dateGreaterThanOrEquals: {
                valid: false,
              },
            }
            : null;
        }
      }
      return null;
    };
  }


  public static smallerThanOrEquals(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!!control?.parent) {
        let otherControl: AbstractControl = control.parent.controls[controlName];
        if (!!otherControl) {
          const current = parseFloat(control?.value || '0');
          const other = parseFloat(otherControl?.value || '0');
          let inValid = current >= other;
          if (inValid) {
            setTimeout(() => {
              otherControl.updateValueAndValidity({ onlySelf: false, emitEvent: true });
            });
          }

          return inValid
            ? {
              [controlName]: {
                valid: false,
              },
            }
            : null;
        }
      }
      return null;
    };
  }

  public static israelIdentity(): ValidatorFn {
    const validation = (id: string) => {
      if (isNaN(Number(id))) {
        return false;
      }
      let strId = id?.toString().trim();
      if (strId.length > 9) {
        return false;
      }
      if (strId.length < 9) {
        while (strId.length < 9) strId = '0' + strId;
      }
      let counter = 0,
        rawVal,
        actualVal;
      for (let i = 0; i < strId.length; i++) {
        rawVal = Number(strId[i]) * ((i % 2) + 1);
        actualVal = rawVal > 9 ? rawVal - 9 : rawVal;
        counter += actualVal;
      }
      return counter % 10 === 0;
    };
    return (control: AbstractControl): { [key: string]: any } => {
      let tz = control?.value;
      if (!!tz) {
        let valid = validation(tz);
        if (!valid) {
          return {
            israelIdentity: true,
          };
        }
      }
      return null;
    };
  }

  public static creditCard(): ValidatorFn {
    const validation = (cardNo: string) => {
      if (isNaN(Number(cardNo))) {
        return false;
      }
      let s = 0;
      let doubleDigit = false;
      for (var i = cardNo.length - 1; i >= 0; i--) {
        let digit = +cardNo[i];
        if (doubleDigit) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        s += digit;
        doubleDigit = !doubleDigit;
      }
      return s % 10 == 0;
    };
    return (control: AbstractControl): ValidationErrors => {
      const tz = control?.value;
      if (!!tz) {
        const valid = validation(tz);
        if (!valid) {
          return {
            creditcard: 'Portal.Forms.Validation.Errors.CreditCard',
          };
        }
      }
      return null;
    };
  }

  public static olderThan(age: number): ValidatorFn {
    const validation = (value: string) => {
      var from = value.split('-'); // DD MM YYYY
      var year = Number(from[0]);
      var mydate = new Date();
      if (mydate.getFullYear() - year > age) {
        return true;
      } else {
        return false;
      }
    };
    return (control: AbstractControl): { [key: string]: any } => {
      let tz = control?.value;
      if (!!tz) {
        let valid = validation(tz);
        if (!valid) {
          return {
            olderThan: true,
          };
        }
      }
      return null;
    };
  }

  public static greaterThanToday(): ValidatorFn {
    return this.afterThan(new Date().toISOString(), null, 'greaterThanToday');
  }

  public static afterThanNow(): ValidatorFn {
    return this.afterThan(new Date().toISOString(), null, 'afterThanNow');
  }

  public static beforeThanNow(): ValidatorFn {
    return this.beforeThan(new Date().toISOString(), null, 'beforeThanNow');
  }

  public static beforeThan(date: string, secundCtrl?: AbstractControl, errorName: string = 'beforeThan'): ((control: AbstractControl) => { [key: string]: Date }) {
    const validation = (currentD: string): Date => {
      date = secundCtrl?.value || date;
      const validDate = (d: string) => (!!d ? Date.parse(d) || null : null);
      if (!!validDate(currentD) && !!validDate(date) && +validDate(currentD) > +validDate(date)) {
        return new Date(validDate(date));
      }
    };
    return (control: AbstractControl): { [key: string]: Date } => {
      const { value } = control;
      if (!!value) {
        const anValid = validation(value);
        if (!!anValid) {
          return {
            [errorName]: anValid,
          };
        }
      }
    };
  }

  public g() {
    // IdeoValidators.beforeThan(new Date()?.toISOString())({} as AbstractControl)['dfs'].a
  }

  public static afterThan(date: string, secundCtrl?: AbstractControl, errorName: string = 'afterThan'): ValidatorFn {
    const validation = (currentD: string) => {
      date = secundCtrl?.value || date;
      const validDate = (d: string): number => Date.parse(d) || null;
      if (!!validDate(currentD) && !!validDate(date) && +validDate(currentD) < +validDate(date)) {
        return true;
      } else {
        return false;
      }
    };
    return (control: AbstractControl): { [key: string]: any } => {
      let d = control?.value;
      if (!!d) {
        let anValid = validation(d);
        if (anValid) {
          return {
            [errorName]: true,
          };
        }
      }
      return null;
    };
  }

  public static serverValidation(
    service: any,
    action: string,
    key: string,
    formFields: Function = null
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(350).pipe(
        switchMap(() => {
          let actionParams = [];
          if (!!formFields) {
            actionParams = formFields(control);
          }
          return service[action](control.value, ...actionParams).pipe(
            map((valid) => {
              let validate = null;
              if (!valid) {
                validate = {};
                validate[key] = true;
              }
              return validate;
            })
          );
        })
      );
    };
  }

  // public static uniqueFields(fields: string[]): ValidatorFn {
  //     return (formArr: FormArray)
  // }

  // public static isDate(s): ValidatorFn {
  //     if(isNaN(s) && !isNaN(Date.parse(s)))
  //         return null;
  // }
}
