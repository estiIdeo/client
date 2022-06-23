import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';

@Component({
  selector: 'prx-async-cell',
  templateUrl: './async-cell.component.html',
  styleUrls: ['./async-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncCellComponent implements OnInit, TableCell {
  public col: TableColumn<any>;
  public item: any;

  constructor() {}

  ngOnInit(): void {
    this.col.parsedData$(this.item[this.col.field]).then((res) => (this._value = res));
  }

  private _value: any = null;
  public get value(): any {
    return this._value;
  }
}
