import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';

@Component({
  selector: 'prx-default-cell',
  templateUrl: './default-cell.component.html',
  styleUrls: ['./default-cell.component.scss'],
})
export class DefaultCellComponent implements OnInit, TableCell {
  public col: TableColumn<any>;
  public item: any;
  public isTranslate?: boolean;

  constructor() {}

  ngOnInit(): void {}
}
