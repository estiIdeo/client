import { Component, OnInit } from '@angular/core';
// import { TranslatePipe } from '@ngx-translate/core';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';

@Component({
  selector: 'prx-date-time-cell',
  templateUrl: './date-time-cell.component.html',
  styleUrls: ['./date-time-cell.component.scss'],
})
export class DateTimeCellComponent implements OnInit, TableCell {
  public col: TableColumn<any>;
  public item: any;

  constructor() { } // private translatePipe: TranslatePipe

  public get format(): string {
    return this?.col?.format || 'dd/MM/yy, HH:mm';
  }

  ngOnInit(): void { }
}
