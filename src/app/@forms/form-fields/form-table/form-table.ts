import { Observable, Subject } from 'rxjs';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { PagedResponse } from '../../../@ideo/components/table/models/paged-response';
import { TableColumn } from '../../../@ideo/components/table/models/table-column';

export class FormTable<T = any> {
  constructor(obj: FormTable = null) {
    if (!!obj) {
      Object.keys(obj).forEach((key) => (this[key] = obj[key]));
    }
  }

  public columns: TableColumn<T>[];
  public getDataProvider: (evt: LazyLoadEvent) => Observable<PagedResponse<T>>;
  public dataKey: string;
}
