import { Injectable, Type } from '@angular/core';
import { SelectItem } from '../models/select-item';
import { MatchMode, TableFilterInput } from '../models/table-filter';
import { SelectItemStore } from '../models/types';
import { CalendarFilterComponent } from '../table-filters/calendar-filter/calendar-filter.component';
import { MultiselectFilterComponent } from '../table-filters/multiselect-filter/multiselect-filter.component';
import { NumericFilterComponent } from '../table-filters/numeric-filter/numeric-filter.component';
import { RelatedFilterComponent } from '../table-filters/related-filter/related-filter.component';
import { SelectFilterComponent } from '../table-filters/select-filter/select-filter.component';
import { TextFilterComponent } from '../table-filters/text-filter/text-filter.component';
import { CharFilterComponent } from '../table-filters/char-filter/char-filter.component';

@Injectable({
  providedIn: 'root',
})
export class TableFiltersService {
  private comparisonOptions: SelectItemStore<Type<TableFilterInput>>[] = [
    { label: 'Common.Filters.Contains', value: MatchMode.Contains, useOn: [TextFilterComponent] },
    {
      label: 'Common.Filters.Equals',
      value: MatchMode.Equals,
      useOn: [
        MultiselectFilterComponent,
        TextFilterComponent,
        NumericFilterComponent,
        SelectFilterComponent,
        CharFilterComponent
      ],
    },
    {
      label: 'Common.Filters.NotEquals',
      value: MatchMode.NotEquals,
      useOn: [TextFilterComponent, NumericFilterComponent, SelectFilterComponent,CharFilterComponent],
    },
    { label: 'Common.Filters.LessThan', value: MatchMode.LessThan, useOn: [NumericFilterComponent] },
    { label: 'Common.Filters.LessThanOrEquals', value: MatchMode.LessThanOrEquals, useOn: [NumericFilterComponent] },
    { label: 'Common.Filters.GreaterThan', value: MatchMode.GreaterThan, useOn: [NumericFilterComponent] },
    { label: 'Common.Filters.GreaterThanOrEquals', value: MatchMode.GreaterThanOrEquals, useOn: [NumericFilterComponent] },
    { label: 'Common.Filters.Before', value: MatchMode.Before, useOn: [CalendarFilterComponent] },
    { label: 'Common.Filters.BeforeOrEquals', value: MatchMode.BeforeOrEquals, useOn: [CalendarFilterComponent] },
    { label: 'Common.Filters.After', value: MatchMode.After, useOn: [CalendarFilterComponent] },
    { label: 'Common.Filters.AfterOrEquals', value: MatchMode.EqualsOrAfter, useOn: [CalendarFilterComponent] },
    { label: 'Common.Filters.StartsWith', value: MatchMode.StartsWith, useOn: [TextFilterComponent] },
    { label: 'Common.Filters.EndsWith', value: MatchMode.EndsWith, useOn: [TextFilterComponent] },
    { label: 'Common.Filters.Any', value: MatchMode.Any, useOn: [RelatedFilterComponent] },
  ];

  constructor() {}

  public getComparisonOptions(type: Type<TableFilterInput>): SelectItem[] {
    return this.comparisonOptions.filter((o) => o.useOn.includes(type));
  }
}
