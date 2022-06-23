import { Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform<T, K>(values: T[], filters: { [key: string]: K }): any[] {
    if (!filters && filters == {}) {
      return values;
    }
    const properties = Object.keys(filters);
    const result =
      !!values?.length && !!properties?.length
        ? values.filter(
          (x) =>
            !!properties.find((property) =>
              !!filters[property]
                ? x[property] === filters[property] ||
                (Array.isArray(filters[property])
                  ? (filters[property] as any).indexOf(
                    property.split('.').reduce((a, v) => (!!a ? a[v] : null), x)
                  ) >= 0
                  : property.split('.').reduce((a, v) => a[v], x) === filters[property])
                : !x[property]
            )
        )
        : values;
    return result;
  }
}
@Pipe({
  name: 'formArrayControlFilter',
})

export class FormArrayControlsFilterPipe implements PipeTransform {
  /** filter all form array controls that contains value of some query string. */
  transform(control: { controls: FormGroup[] } & FormArray & any, query: string): FormGroup[] {
    if (!query) { return control?.controls }
    const findId = (val: any, query: string): boolean => Object.keys(val || {}).some((v, i, a) => (typeof val?.[v] === 'string' && val?.[v]?.toLocaleLowerCase().includes(query?.toLocaleLowerCase())) ||
      ((typeof val?.[v] === 'object' && val?.[v] !== null) && findId(val?.[v], query)));
    return control?.controls?.filter((i: FormGroup) => !!findId(i.getRawValue(), query))
  }
}