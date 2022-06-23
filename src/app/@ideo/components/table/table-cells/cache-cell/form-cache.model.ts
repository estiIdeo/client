import { SecurityContext } from "@angular/core";

export class FormCache {
  constructor(obj: FormCache = null) {
    if (!!obj) {
      Object.keys(obj).forEach((key) => (this[key] = obj[key]));
    }
  }
  public saveHtmlType: SecurityContext = 0
  public blank: boolean;
}
