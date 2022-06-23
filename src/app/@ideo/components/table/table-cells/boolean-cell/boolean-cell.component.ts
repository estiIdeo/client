import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';

@Component({
  selector: 'prx-boolean-cell',
  templateUrl: './boolean-cell.component.html',
  styleUrls: ['./boolean-cell.component.scss'],
})
export class BooleanCellComponent implements OnInit, TableCell {
  public col: TableColumn<any>;
  public item: any;

  constructor() {}

  ngOnInit(): void {}
}
