import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';

@Component({
  selector: 'prx-status-cell',
  templateUrl: './status-cell.component.html',
  styleUrls: ['./status-cell.component.scss'],
})
export class StatusCellComponent implements OnInit, TableCell {
  public col: TableColumn<any>;
  public item: any;
  public status: any = {};

  constructor() {}

  ngOnInit(): void {
    if (!!this.col && this.item[this.col.field]) {
      let data = !!this.col.parsedData ? this.col.parsedData(this.item[this.col.field]) : this.item[this.col.field];
      if (!!data && !!this.col.statuses) {
        this.status = this.col.statuses.find((s) => (s.value.name || s.value).toUpperCase() == data.toUpperCase());
      }
    }
  }
}
