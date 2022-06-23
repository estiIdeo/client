export class FormDate {
  constructor(obj: FormDate = null) {
    if (!!obj) {
      Object.keys(obj).forEach((key) => (this[key] = obj[key]));
    }

  }
  public autoSetValue: boolean;
  public notReturnDateTime: boolean;
}
