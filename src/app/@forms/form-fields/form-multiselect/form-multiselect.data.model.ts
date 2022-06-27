import { Subject } from 'rxjs';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { DynamicComponentModel } from '@app/@shared/components/dynamic-component/dynamic.component.model';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
export class FormMultiSelectDataModel<T = SelectItem> {
    lazyOptions?: TableFilter['lazyOptions'];
    queryFilters?: TableFilter['queryFilters'];
    // editFullOptions?: (options: T[]) => T[];
    fullOptionSetter?: Subject<{ includes?: T[], exclude?: T[] }>
    parsedDynamicComponent?: (option: T) => DynamicComponentModel;
    onOptionChange?: (options: any[]) => any
}