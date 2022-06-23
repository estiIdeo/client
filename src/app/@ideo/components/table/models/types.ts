import { AsyncCellComponent } from '../table-cells/async-cell/async-cell.component';
import { BooleanCellComponent } from '../table-cells/boolean-cell/boolean-cell.component';
import { DateCellComponent } from '../table-cells/date-cell/date-cell.component';
import { DateTimeCellComponent } from '../table-cells/date-time-cell/date-time-cell.component';
import { DefaultCellComponent } from '../table-cells/default-cell/default-cell.component';
import { ImageCellComponent } from '../table-cells/image-cell/image-cell.component';
import { LinkCellComponent } from '../table-cells/link-cell/link-cell.component';
import { StatusCellComponent } from '../table-cells/status-cell/status-cell.component';
import { SubStrCellComponent } from '../table-cells/sub-str-cell/sub-str-cell.component';
import { BooleanFilterComponent } from '../table-filters/boolean-filter/boolean-filter.component';
import { CalendarFilterComponent } from '../table-filters/calendar-filter/calendar-filter.component';
import { NumericFilterComponent } from '../table-filters/numeric-filter/numeric-filter.component';
import { TextFilterComponent } from '../table-filters/text-filter/text-filter.component';
import { SelectItem } from './select-item';
import { TableColumnType } from './table-column';
import { CacheCellComponent } from '../table-cells/cache-cell/cache-cell.component';
import { CacheArrCellComponent } from '../table-cells/cache-arr-cell/cache-arr-cell.component';
import { SelectFilterComponent } from '../table-filters/select-filter/select-filter.component';
import { PriceCellComponent } from '../table-cells/price-cell/price-cell.component';
import { SkuCellComponent } from '../table-cells/sku-cell/sku-cell.component';

export const Rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: 'asc', '': 'asc' };
export type ChangeAction = { index: number; value: any };
export type SortDirection = 'asc' | 'desc' | '';
export const TableCellDic = {
  [TableColumnType.Image]: ImageCellComponent,
  [TableColumnType.StaticImage]: ImageCellComponent,
  [TableColumnType.Boolean]: BooleanCellComponent,
  [TableColumnType.Status]: StatusCellComponent,
  [TableColumnType.Date]: DateCellComponent,
  [TableColumnType.Price]: PriceCellComponent,
  [TableColumnType.Numeric]: DefaultCellComponent,
  [TableColumnType.Sku]: SkuCellComponent,
  [TableColumnType.DateTime]: DateTimeCellComponent,
  [TableColumnType.Async]: AsyncCellComponent,
  [TableColumnType.Default]: DefaultCellComponent,
  [TableColumnType.Link]: LinkCellComponent,
  [TableColumnType.Cache]: CacheCellComponent,
  [TableColumnType.CacheArr]: CacheArrCellComponent,
  [TableColumnType.SubStr]: SubStrCellComponent,
  [TableColumnType.Translate]: DefaultCellComponent,
};
export const TableFilterDic = {
  [TableColumnType.Date]: CalendarFilterComponent,
  [TableColumnType.DateTime]: CalendarFilterComponent,
  [TableColumnType.Numeric]: NumericFilterComponent,
  [TableColumnType.Boolean]: BooleanFilterComponent,
  [TableColumnType.SubStr]: TextFilterComponent,
  [TableColumnType.Status]: TextFilterComponent,
  [TableColumnType.Link]: TextFilterComponent,
  // [TableColumnType.Cache] : CacheFilterComponent,
  [TableColumnType.Image]: null as any,
};

export interface TableFilterDicModel {
  [TableColumnType.Date]: CalendarFilterComponent,
  [TableColumnType.DateTime]: CalendarFilterComponent,
  [TableColumnType.Numeric]: NumericFilterComponent,
  [TableColumnType.Boolean]: BooleanFilterComponent,
  [TableColumnType.SubStr]: TextFilterComponent,
  [TableColumnType.Sku]: TextFilterComponent,
  [TableColumnType.Status]: TextFilterComponent,
  [TableColumnType.Link]: TextFilterComponent,
  [key: string]: SelectFilterComponent
};
export interface SelectItemStore<T> extends SelectItem {
  useOn: T[];
}
