import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';

@Component({
  selector: 'prx-link-cell',
  templateUrl: './link-cell.component.html',
  styleUrls: ['./link-cell.component.scss'],
})
export class LinkCellComponent implements OnInit, TableCell {
  constructor() {}

  col: TableColumn<any>;
  item: any;

  ngOnInit(): void {}

  get hasLink(): boolean {
    return !!(this.col.href && this.col.href(this.item[this.col.field], this.item));
  }
}
