import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';
import { IdeoDatePipe } from '../../../../infrastructure/pipes/ideo-date.pipe';

@Component({
  selector: 'prx-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrls: ['./date-cell.component.scss'],
})
export class DateCellComponent implements OnInit, TableCell {
  public col: TableColumn<any>;
  public item: any;

  constructor() {}

  // public get date(): string {
  //   return 'dd/MM/yy';
  // }

  ngOnInit(): void {}
}
