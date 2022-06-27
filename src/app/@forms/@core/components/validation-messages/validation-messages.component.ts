import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, Type } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { TranslateSelectItem } from '../../interfaces';
import { takeUntil, debounceTime, takeWhile, distinctUntilChanged, skip } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicFormControl } from '../../interfaces/dynamic-form-control';
import { merge } from 'rxjs';
import { IdeoRegexService } from '../../../../@ideo/infrastructure/services/ideo-regex.service';
import { IdeoValidators } from '../../validators/ideo.validators';
import { DatePipe } from '@angular/common';
import { BaseComponent } from '@app/@core/base/base-component';


type supportedDefaultValuationsErrors = 'required' | 'max' | 'min' | 'minLength' | 'email' | 'pattern'
@Component({
  selector: 'ideo-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ValidationMessagesComponent extends BaseComponent implements OnInit {
  public errorMessages: TranslateSelectItem[];

  @Input() public takeOne: boolean = true;
  @Input() public autoShowErrors: boolean = false;
  @Input() public filedLabel: string;
  @Input() public control: AbstractControl;
  @Input() public set messages(msgObj: { [error: string]: string | TranslateSelectItem }) {
    if (!!msgObj) {
      this.errorMessages = [...this.getErrorMessages(msgObj)];
      this.render()
    }
  }

  public hasCustomErrorMessage = (key: string) => !!key ? this.errorMessages?.find(i => i.errorName === key) : null

  public translateParamObject(errMsg: TranslateSelectItem): Object {
    return { ...errMsg, value: errMsg.value, ...errMsg?.data }
  }

  constructor(private cd: ChangeDetectorRef, private translatePipe: TranslatePipe,
    private datePipe: DatePipe) {
    super()
  }

  render = () => this.cd.detectChanges()
  // render = console.log

  ngOnInit() {
    merge(this.control.statusChanges?.pipe(distinctUntilChanged(), skip(1)), this.control?.valueChanges?.pipe(skip(1), distinctUntilChanged(), debounceTime(200))).pipe(takeUntil(this.destroyed), takeWhile(() => this.isAlive), debounceTime(200)).subscribe(this.render)
  }


  private static getDefaultErrorMessage = ({ key, value }: { key: supportedDefaultValuationsErrors, value: any }, filedLabel: string, translatePipe: TranslatePipe, datePipe: DatePipe): TranslateSelectItem => {
    const baseErrorBody: TranslateSelectItem = { errorName: key, filedLabel }
    switch (key) {
      case Validators.required.name: {
        return { ...baseErrorBody, label: 'Portal.Common.Required', value: filedLabel }
        break
      }
      case Validators.max.name: {
        const { actual, max } = value
        return {
          ...baseErrorBody,
          label: 'Portal.Forms.Validation.Errors.Max',
          data: {
            entity: filedLabel,
            val: max,
          }
        }
        break
      }
      case Validators.min.name: {
        const { actual, min } = value
        return {
          ...baseErrorBody,
          label: 'Portal.Forms.Validation.Errors.Min',
          data: {
            val: min,
            entity: filedLabel,
          }
        }
        break
      }
      case Validators.minLength.name: {
        const { actualLength, requiredLength } = value
        return {
          ...baseErrorBody,
          label: 'Portal.Forms.Validation.Errors.MinLength',
          data: {
            chars: requiredLength,
            entity: filedLabel,
          }
        }
        break
      }
      case Validators.maxLength.name: {
        const { actualLength, requiredLength } = value
        return {
          ...baseErrorBody,
          label: 'Portal.Forms.Validation.Errors.MinLength',
          data: {
            chars: requiredLength,
            entity: filedLabel,
          }
        }
        break
      }
      case Validators.email.name: {
        return {
          ...baseErrorBody,
          label: 'Portal.Forms.Validation.Errors.Email',
        }
        break
      }
      case Validators.pattern.name: {
        const { requiredPattern, actualValue } = value
        const regexName = Object.keys(IdeoRegexService)?.find(i => IdeoRegexService?.[i]?.toString() === requiredPattern)
        const translateName = `Portal.Common.${regexName?.charAt(0)?.toUpperCase() + regexName?.slice(1)}`
        const patternTranslateName = `Portal.Forms.Validation.Errors.Pattern.${regexName?.charAt(0)?.toUpperCase() + regexName?.slice(1)}`
        if (translateName !== translatePipe?.transform(translateName)) {
          return {
            ...baseErrorBody,
            label: 'Portal.Forms.Validation.Errors.Pattern',
            data: {
              pattern: translateName,
              entity: filedLabel,
            }
          }
        } else if (patternTranslateName !== translatePipe?.transform(patternTranslateName)) {
          return {
            ...baseErrorBody,
            label: 'Portal.Forms.Validation.Errors.Pattern',
            data: {
              pattern: patternTranslateName,
              entity: filedLabel,
            }
          }
        }
        console.log("please add me to translate as validation error message", patternTranslateName)
        return {
          ...baseErrorBody,
          label: 'Portal.Common.Errors.Invalid',
          value: filedLabel
        }
        break
      }
      case IdeoValidators.creditCard.name: {
        return {
          ...baseErrorBody,
          label: 'Portal.Common.Errors.Invalid',
          value: filedLabel
        }
        break
      }
      case IdeoValidators.beforeThan.name: {
        const date: ReturnType<ReturnType<typeof IdeoValidators.beforeThan>>[string] = value
        if (Date.parse(date?.toISOString())) {
          return {
            ...baseErrorBody,
            label: 'Portal.Forms.Validation.Errors.BeforeThan',
            data: {
              date: datePipe.transform(date, 'dd/MM/yy, HH:mm'),
              entity: baseErrorBody?.filedLabel
            },
          }
        }
        return {
          ...baseErrorBody,
          label: 'Portal.Common.Errors.Invalid',
          value: filedLabel
        }
        break
      }
      default: {
        if (typeof value === 'string') {
          return {
            ...baseErrorBody, label: value,
            data: { entity: baseErrorBody?.filedLabel }
          }
        }
        return baseErrorBody
        break
      }
    }
  }

  getDefaultErrorMessage = ({ key, value }: { key: supportedDefaultValuationsErrors, value: any }): TranslateSelectItem => ValidationMessagesComponent.getDefaultErrorMessage({ key, value }, this.filedLabel, this.translatePipe, this.datePipe)

  private handleErrors(key: string, val: string): TranslateSelectItem {
    const baseErrorBody: TranslateSelectItem = { errorName: key, label: val, }
    switch (key) {
      case (Validators.required.name): {
        const keyTranslateVal = this.translatePipe.transform('Portal.Common.Required')?.replace(/{{.*}}/, '')?.trim()
        const valTranslateVal = this.translatePipe.transform(val)
        if (!valTranslateVal?.includes(keyTranslateVal)) {
          return { ...baseErrorBody, label: 'Portal.Common.Required', value: val }
        } else if (!!val) {
          return { ...baseErrorBody }
        }
        return { ...baseErrorBody, label: 'Portal.Common.Required', value: 'Portal.Common.Required.ThisField' }
      }
      // can handle any error validation
      default:
        return { ...baseErrorBody }
    }
  }

  private getErrorMessages(msgObj: DynamicFormControl['config']['errorMessages']): TranslateSelectItem[] {
    const keys: string[] = Object.keys(msgObj);
    return keys.map((key: string) => {
      const item: TranslateSelectItem | string = msgObj?.[key];
      switch (typeof item) {
        case 'string': {
          return this.handleErrors(key, item)
        }
        case 'object': {
          item.label = item?.label || `Portal.Common.Errors.${key}`
          item.errorName = key
          return item
        }
        default:
          break
      }
    })
  }
}