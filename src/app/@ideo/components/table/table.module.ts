import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableDirective } from './directives/sortable.directive';
import { TableCellDirective } from './directives/table-cell.directive';
import { AsyncCellComponent } from './table-cells/async-cell/async-cell.component';
import { BooleanCellComponent } from './table-cells/boolean-cell/boolean-cell.component';
import { DateCellComponent } from './table-cells/date-cell/date-cell.component';
import { DateTimeCellComponent } from './table-cells/date-time-cell/date-time-cell.component';
import { DefaultCellComponent } from './table-cells/default-cell/default-cell.component';
import { ImageCellComponent } from './table-cells/image-cell/image-cell.component';
import { LinkCellComponent } from './table-cells/link-cell/link-cell.component';
import { StatusCellComponent } from './table-cells/status-cell/status-cell.component';
import { PriceCellComponent } from './table-cells/price-cell/price-cell.component';
import { SubStrCellComponent } from './table-cells/sub-str-cell/sub-str-cell.component';
import { AutocompleteFilterComponent } from './table-filters/autocomplete-filter/autocomplete-filter.component';
import { BooleanFilterComponent } from './table-filters/boolean-filter/boolean-filter.component';
import { CalendarFilterComponent } from './table-filters/calendar-filter/calendar-filter.component';
import { CheckboxFilterComponent } from './table-filters/checkbox-filter/checkbox-filter.component';
import { MultiselectFilterComponent } from './table-filters/multiselect-filter/multiselect-filter.component';
import { NumericFilterComponent } from './table-filters/numeric-filter/numeric-filter.component';
import { RelatedFilterComponent } from './table-filters/related-filter/related-filter.component';
import { SelectFilterComponent } from './table-filters/select-filter/select-filter.component';
import { TextFilterComponent } from './table-filters/text-filter/text-filter.component';
import { CharFilterComponent } from './table-filters/char-filter/char-filter.component';
import { TableComponent } from './table.component';
import { TableService } from './services/table.service';
import { SelectModule } from '../select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectModule } from '../multiselect/multiselect.module';
import { TableFilterDirective } from './directives/table-filter.directive';
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbPaginationModule,
  NgbPopoverModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { IdeoPipesModule } from '../../infrastructure/pipes/pipes.module';
import { ButtonModule } from '../button/button.module';
import { TableFiltersComponent } from './components/table-filters/table-filters.component';
import { IdeoFormsModule } from '@app/@forms/ideo-forms.module';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { CacheCellComponent } from './table-cells/cache-cell/cache-cell.component';
import { CacheArrCellComponent } from './table-cells/cache-arr-cell/cache-arr-cell.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { IconsModule } from '../../../blocks/icons/icons.module';
import { IdeoDatePipe } from '../../infrastructure/pipes/ideo-date.pipe';
import { DynamicComponentModule } from '../../../@shared/components/dynamic-component/dynamic-component.module';
// import { AgmCoreModule } from '@agm/core';
import { I18nModule } from '../../../i18n/i18n.module';
import { SkuCellComponent } from './table-cells/sku-cell/sku-cell.component';
import { FreeSearchFilterComponent } from './table-filters/free-search-filter/free-search-filter.component';
import { SelectComponent } from '../select/select.component';

const featherIcons = allIcons;

const EXPORTED = [TableComponent, TableFiltersComponent];
const DIRECTIVES = [SortableDirective, TableCellDirective, TableFilterDirective];
const COMPONENTS = [
  ...EXPORTED,
  AsyncCellComponent,
  BooleanCellComponent,
  DateCellComponent,
  DateTimeCellComponent,
  DefaultCellComponent,
  CacheCellComponent,
  ImageCellComponent,
  LinkCellComponent,
  StatusCellComponent,
  SubStrCellComponent,
  SkuCellComponent,
  TextFilterComponent,
  AutocompleteFilterComponent,
  BooleanFilterComponent,
  CalendarFilterComponent,
  CheckboxFilterComponent,
  MultiselectFilterComponent,
  NumericFilterComponent,
  RelatedFilterComponent,
  SelectFilterComponent,
  CharFilterComponent,
  TableFiltersComponent,
  CacheArrCellComponent,
  PriceCellComponent,
  // LocationsCellComponent,
  // TagsCellComponent
];

@NgModule({
  declarations: [...DIRECTIVES, ...COMPONENTS, FreeSearchFilterComponent],
  imports: [
    // NgbPopoverModule,
    CommonModule,
    TranslateModule,
    SelectModule,
    IconsModule,
    I18nModule,
    MultiselectModule,
    ButtonModule,
    IdeoPipesModule,
    // LoaderModule,
    IdeoFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbCollapseModule,
    NgbPopoverModule,
    DynamicComponentModule,
    NgbDatepickerModule,
    BsDropdownModule,
    RouterModule,
    // AgmCoreModule,
    FeatherModule.pick(featherIcons),
  ],
  exports: [...EXPORTED],
  providers: [TableService, TranslatePipe, IdeoDatePipe],
})
export class TableModule { }
