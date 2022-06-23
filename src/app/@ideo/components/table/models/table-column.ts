import { EventEmitter } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { Permission } from '../../../infrastructure/permissions/permission';
import { TableFilter } from './table-filter';
import { ChangeAction } from './types';
import { Observable } from 'rxjs';
import { AnyString } from '../../../../@shared/types/any-type.type';
import { DynamicComponentModel } from '../../../../@shared/components/dynamic-component/dynamic.component.model';
import { AsyncReturnType } from '../../../../@shared/types/async.return.type';
import { IntelligenceKeys } from '../../../../@shared/types/IntelligenceKeys.type';
import { SelectItem } from './select-item';
import { translateType } from 'src/app/@shared/types/translate.type';
export interface TableColumn<T = any, DModel = any> {
  field: (keyof T & string) | AnyString;
  bindTo?: string;
  header?: IntelligenceKeys<translateType>;
  sortable?: boolean;
  sortName?: string;
  sorts?: string[];
  parsedData?: (...args: any[]) => any;
  parsedData$?: (...args: any[]) => Promise<any>;
  parsedHtmlData?: (...args: any[]) => any;
  parsedHtmlData$?: (...args: any[]) => Observable<any>;
  parsedFullData?: (item: T) => any;
  type?: TableColumnType;
  parsedDynamicComponent?: (item: AsyncReturnType<TableColumn<T>['cacheData$']>) => DynamicComponentModel;
  defaultValue?: string;
  action?: (item: any) => void;
  hidden?: boolean;
  hidden$?: Observable<boolean>;
  editable?: boolean | ((evt: any) => boolean);
  statusChanged?: (...args: any[]) => any;
  statuses?: SelectItem[];
  setValue?: EventEmitter<ChangeAction>;
  styleClass?: string;
  style?: { [property: string]: string };
  icon?: string;
  tipContent?: (...args: any[]) => any;
  useOn?: number[];
  data?: DModel;
  placeholder?: string;
  pairs?: boolean;
  getStatus?: (...args: any[]) => any;
  getStatusByFullData?: (...args: any) => any;
  permission?: Permission;
  tooltip?: string;
  translate?: boolean;
  options?: SelectItem[];
  getInnerHtml?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
  href?: (evt: any, full?: T) => boolean | any[] | string[];
  cacheData$?: (item: T) => Promise<any>;
  cacheDataArr$?: (item: T) => Observable<any>;
  queryParams?: (item: T) => any;
  onClick?: (...args: any[]) => any;
  appendToBody?: string;
  validation?: ValidatorFn[];
  errors?: SelectItem[];
  required?: boolean;
  chars?: number;
  colspan?: number;
  format?: string;
  ignoreTimeZone?: boolean;
  endpoint?: string | string[];
  filter?: TableFilter<T> | TableFilter<T>[];
}

export enum TableColumnType {
  Image,
  Boolean,
  Status,
  Date,
  DateTime,
  Async,
  Price,
  Numeric,
  Default,
  Link,
  SubStr,
  StaticImage,
  Cache,
  CacheArr,
  Translate,
  Tags,
  Location,
  Sku,
}
