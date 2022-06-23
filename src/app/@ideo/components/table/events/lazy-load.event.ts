import { MatchMode } from '../models/table-filter';
import { SortDirection } from '../models/types';
import { HttpParams } from '@angular/common/http';

export type AnyFilterObject<K = any> = {
  [key: string]: FilterInsideObject<K> | any
}

export type FilterObject<T = any, TChild = any> = {
  [P in keyof T]?: FilterInsideObject<TChild>;
};
export interface LazyLoadEvent<T = any, TChild = any> {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortColumn?: (keyof T & string);
  sortDirection?: SortDirection;
  sorts?: (keyof T & string)[];
  filters?: (FilterObject<T, TChild>) | (FilterObject<T, TChild>[]);
  // exportType?: ExportType;
  exportAll?: boolean;
  exportIds?: number[];
  exportRequestTypePost?: boolean;
  selection?: number[];
  queryParams?: HttpParams | { [param: string]: string | string[] }
}
export interface FilterInsideObject<TChild = any> extends AnyFilterObject<TChild> {
  value?: any;
  matchMode?: MatchMode;
  innerFilter?: FilterObject<TChild> // | TableFilter<TChild>;
  regularParam?: boolean;
}
