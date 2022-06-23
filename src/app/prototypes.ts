import { SelectItem } from './@ideo/components/table/models/select-item';
import { DynamicFormControl } from './@forms/@core/interfaces/dynamic-form-control';
import { IntelligenceKeys } from './@shared/types/IntelligenceKeys.type';
import { translateType } from './@shared/types/translate.type';
import { serverTranslateType } from './@shared/types/serverTranslate.type';
declare global {
  interface Array<T = DynamicFormControl> {
    toSelectItem(filter?: (o: T) => boolean): SelectItem[];
    patchValue<E>(object: E): void;
    newPatchValue<E>(object: E): void;
  }
  interface Array {
    removeDuplicate<E>(): E[];
    removeDuplicateByKey<E>(key: string): E[];
    removeThisArrDuplicateByKey<E>(key: string, revers?: boolean): E[];
  }

  interface Date {
    toFormDateString(): string;
    toFormDateTimeString(): string;
    toAge(): number;
  }

  interface String {
    toFormDateString(): string;
    toFormDateTimeString(): string;
    toAge(): number;
  }

  interface Date {
    roundDay(): Date;
    addDays(days: number): Date;
    addHours(hours: number): Date;
  }

  interface String {
    reverse(): string;
  }
}

export function sleep(delay: number, func?: () => any) {
  // some as setTimeout
  delay = delay * 1000;
  setTimeout(() => {
    func ? func() : null;
  }, delay);
}

export function pause(delay: number, func?: () => void) {
  // with await it will pause the run time
  let start = new Date().getTime();
  while (new Date().getTime() < start + delay);
  if (func) return func();
}

export function print(text: string, debug?: boolean) {
  console.log(text);
  if (debug) {
    debugger;
  }
}

export function asTranslateJson(arr: string[]): string {
  const helper: string = 'zzzzzzzzzz';
  const fixTranslateValue = (i: string) =>
    (() =>
      (
        (i?.[0].toUpperCase() || '') +
        (i?.length > 1
          ? (i?.[1].toUpperCase() + helper + i.substr(2))
              ?.match(/[A-Z][a-z]+/g)
              ?.map((i) => i.toLowerCase())
              .join(' ')
          : i?.substr(1)?.toLowerCase())
      )?.replace(helper, ''))();
  const translateJson = JSON.stringify(
    arr?.reduce(
      (p: {}, c: string, i: number, a: string[]) => ({
        ...p,
        [c]: fixTranslateValue(c?.split('.')?.pop()),
      }),
      {}
    )
  );
  console?.log(translateJson);
  return translateJson;
}

export function asTranslateJsonPrefix(arr: string[], prefix: IntelligenceKeys<translateType>): string {
  const translateJson = JSON.stringify(
    arr?.reduce((p: any, c) => ({ ...p, [prefix + '.' + c]: c?.replace('.', ' ') }), {})
  );
  console?.log(translateJson);
  return translateJson;
}

export function asSelectItem(obj: any, ...filter: string[]): SelectItem[] {
  if (!!obj) {
    const keys = Object.keys(obj);
    const isEnum = keys?.filter((x) => x == obj[obj[x]])?.length == keys.length;
    let selectedKeys: string[] = null;
    if (!!isEnum) {
      selectedKeys = keys.slice(keys.length / 2).filter((x) => (!!filter?.length ? filter.indexOf(x) >= 0 : true));
    } else {
      selectedKeys = keys.filter((x) => (!!filter?.length ? filter.indexOf(x) >= 0 : true));
    }

    return selectedKeys?.map((key) => {
      return {
        label: key,
        value: obj[key],
      } as SelectItem;
    });
  }
  return null;
}

export function asSelectItemPrefix(
  obj: any,
  prefix: IntelligenceKeys<translateType>,
  ...filter: string[]
): SelectItem[] {
  return asSelectItem(obj, ...filter)?.map(
    (s) =>
      ({
        ...s,
        label: `${prefix?.toString()}.${s.label}`,
      } as SelectItem)
  );
}

export function asPrefix(obj: any, prefix: IntelligenceKeys<serverTranslateType>, value: string | number) {
  // console.log(asSelectItem(obj))
  return `${prefix?.toString()}.${asSelectItem(obj)?.find((i) => i?.value === value)?.label || ''}`;
}

export function asPrefixString(obj: string, prefix: IntelligenceKeys<serverTranslateType>) {
  // console.log(asSelectItem(obj))
  return `${prefix?.toString()}.${obj}`;
}

Date.prototype.roundDay = function () {
  const date = new Date(this.valueOf());
  date.setHours(0);
  date.setMinutes(0);
  return date;
};

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

String.prototype.reverse = function () {
  let newString = '';
  for (var i = this.length - 1; i >= 0; i--) {
    newString += this[i]; // or newString = newString + str[i];
  }
  return newString as string;
};

Date.prototype.addHours = function (hours) {
  const date = new Date(this.valueOf());
  date.setHours(date.getHours() + hours);
  return date;
};

export function getEnumIndexByValue(obj: object, value: string | number): number {
  if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'string') {
    return obj[value];
  }
  return null;
}

if (!Array.prototype.toSelectItem) {
  Array.prototype.toSelectItem = function (filter?: (o: DynamicFormControl) => boolean): Array<SelectItem> {
    return this.filter((x: DynamicFormControl) => x?.config?.type != 'hidden' && (!filter ? true : filter(x))).map(
      (x: DynamicFormControl) => {
        return {
          label: x.config.label,
          value: x.config.value,
        } as SelectItem;
      }
    );
  };
}

if (!Array.prototype.removeDuplicate) {
  Array.prototype.removeDuplicate = function <E>(): E[] {
    return this.filter(
      (v: E, i: number, a: E[]) =>
        i ===
        a.findIndex((t) => (typeof t === 'object' ? Object.keys(t || {})?.every((k) => t[k] === v?.[k]) : t === v))
    );
  };
}

if (!Array.prototype.removeThisArrDuplicateByKey) {
  Array.prototype.removeThisArrDuplicateByKey = function <E>(keys: string = 'id', revers?: boolean): E[] {
    (revers ? this?.reverse() : this).forEach(
      (v: E, i: number, a: E[]) =>
        !(
          i ===
          a.findIndex((t) => {
            let splintKeys = keys.split('.');
            let value = t;
            let value2 = v;
            return splintKeys.every((i) => {
              value = value?.[i];
              value2 = value2?.[i];
              return value === value2;
            });
          })
        ) && this.splice(i, 1)
    );
    return revers ? this?.reverse() : this;
  };
}

if (!Array.prototype.removeDuplicateByKey) {
  Array.prototype.removeDuplicateByKey = function <E>(keys: string = 'id'): E[] {
    return this.filter(
      (v: E, i: number, a: E[]) =>
        i ===
        a.findIndex((t) => {
          let splintKeys = keys.split('.');
          let value = t;
          let value2 = v;
          return splintKeys.every((i) => {
            value = value?.[i];
            value2 = value2?.[i];
            return value === value2;
          });
        })
    );
  };
}

if (!Array.prototype.patchValue) {
  Array.prototype.patchValue = function <E>(object: E): void {
    const arr = this as DynamicFormControl[];
    if (!!arr?.length) {
      Object.keys(object).forEach((key: string) => {
        const item = arr.find((x) => x.config.name == key);
        if (!!item?.config) {
          item.config.value = object[key];
        }
      });
    }
  };

  if (!Array.prototype.newPatchValue) {
    Array.prototype.newPatchValue = function <E>(object: E): void {
      return this.map((i: DynamicFormControl) => ({
        ...i,
        config: { ...i?.config, value: object?.[i?.config?.name] },
      }));
    };
  }

  if (!Date.prototype.toFormDateString) {
    Date.prototype.toFormDateString = function (): string {
      let res = this.toISOString().slice(0, 10) as string;
      return res;
    };
  }

  if (!Date.prototype.toAge) {
    Date.prototype.toAge = function (): number {
      // function getValues(date: Date = new Date()) {
      //   const { getFullYear, getMonth } = (new Date(date))
      //   return {
      //     year: getFullYear(),
      //     month: getMonth()
      //   }
      // }
      // const { year: comingYear, month: comingMonth } = getValues(this)
      // const { year: currentYear, month: currentMonth } = getValues()
      // return (currentYear - comingYear) - +(currentMonth < comingMonth)
      let comingDate = new Date(this);
      let currentDate = new Date();
      return (
        currentDate.getFullYear() -
        comingDate.getFullYear() -
        +(currentDate.getMonth() < comingDate.getMonth() && currentDate.getDay() < comingDate.getDay())
      );
    };
  }

  if (!Date.prototype.toFormDateTimeString) {
    Date.prototype.toFormDateTimeString = function (): string {
      return this.toISOString().slice(0, 16) as string;
    };
  }

  if (!String.prototype.toFormDateString) {
    String.prototype.toFormDateString = function (): string {
      if (!!this) {
        return new Date(this).toFormDateString() as string;
      }
      // return this.slice(0, 10)
    };
  }

  if (!String.prototype.toAge) {
    String.prototype.toAge = function (): number {
      if (!!this) {
        return new Date(this).toAge();
      }
    };
  }

  if (!String.prototype.toFormDateTimeString) {
    String.prototype.toFormDateTimeString = function (): string {
      if (!!this) {
        return new Date(this).toFormDateTimeString() as string;
      }
      // return this.slice(0, 16)
    };
  }
}
