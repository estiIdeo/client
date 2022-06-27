import { Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TableFilterDicModel } from './types';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { ValueOfType } from '@app/@shared/types/object-key-values.type';
import { AnyString } from '@app/@shared/types/any-type.type';
import { FilterObject, LazyLoadEvent } from '../events/lazy-load.event';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { Permission } from '@app/@ideo/infrastructure/permissions/permission';
import { TableColumn } from './table-column';


export interface TableFilter<T = any, D = any> {
  type?: Type<ValueOfType<TableFilterDicModel>> & Type<TableFilterInput>;
  defaultValue?: any;
  name?: (keyof T & string) | AnyString;
  data?: D;
  label?: string;
  value?: any;
  apply?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
  options?: SelectItem[];
  placeholder?: string;
  styleClass?: string;
  minDate?: Date;
  maxDate?: Date;
  showIcon?: boolean;
  completeMethod?: (...args: any[]) => any;
  disabled?: boolean;
  hidden?: boolean;
  hidePlaceholder?: boolean;
  matchMode?: MatchMode;
  selectionMode?: string;
  filter?: boolean;
  useOn?: number[];
  defaultLabel?: string;
  reverseSelection?: boolean;
  hideButtonBar?: boolean;
  hideClear?: boolean;
  required?: boolean;
  showWeek?: boolean;
  appendToBody?: string;
  asyncOptions?: Observable<SelectItem[]>;
  queryFilters?: (query: string) => FilterObject;
  lazyOptions?: (evt: LazyLoadEvent) => Observable<IPagedList<SelectItem>>;
  isFictive?: boolean;
  displayField?: string;
  valueField?: string;
  submit?: () => void;
  innerFilter?: TableFilter<T>;
  inputType?: "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week"
  inputStyle?: string;
  permission?: Permission;
  regularParam?: boolean;
}
export interface TableFilterInput<T = any, D = any> {
  filter: TableFilter<T, D>;
  column?: TableColumn<any>;
  group: FormGroup;
  comparisonOptions: SelectItem[];
  innerComparisonOptions?: SelectItem[];
}

export enum MatchMode {
  Contains = 2250,
  Equals = 2000,
  NotEquals = 2001,
  LessThan = 2002,
  LessThanOrEquals = 2003,
  GreaterThan = 2004,
  GreaterThanOrEquals = 2005,
  Before = 2002,
  BeforeOrEquals = 2003,
  After = 2004,
  EqualsOrAfter = 2005,
  StartsWith = 2251,
  EndsWith = 2252,
  Any = 2500,
  NotAny = 2502,
}
