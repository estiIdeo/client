import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translateParams',
  pure: false,
})
export class TranslateParamsPipe extends TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService, private changeDetectionRef: ChangeDetectorRef) {
    super(translateService, changeDetectionRef);
  }
  /** translate translateParams receives object and returns object with translated values */
  override transform(obj: Object): Object {
    if (typeof obj === 'string') {
      return super.transform(obj);
    }
    return Object.keys(obj || {}).reduce((o, i) => ({ ...o, [i]: this.transform(obj[i]) }), obj);
  }
}

@Pipe({
  name: 'translateWithParams',
  pure: false,
})
export class TranslateWithParamsPipe extends TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService, private changeDetectionRef: ChangeDetectorRef) {
    super(translateService, changeDetectionRef);
  }
  /** translate translateParams receives object and returns object with translated values */
  override transform(query: string, obj?: Object): any {
    let objTranslations: Object;
    if (obj) {
      objTranslations = Object.keys(obj || {}).reduce((o, i) => ({ ...o, [i]: this.transform(obj[i]) }), obj);
    }
    return super.transform(query, objTranslations);
  }
}
