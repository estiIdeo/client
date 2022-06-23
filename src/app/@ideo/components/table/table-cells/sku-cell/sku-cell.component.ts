import { Component, OnInit } from '@angular/core';
import { TableCell } from '../../models/table-cell';
import { TableColumn } from '../../models/table-column';

@Component({
  selector: 'prx-sku-cell',
  templateUrl: './sku-cell.component.html',
  styleUrls: ['./sku-cell.component.scss']
})
export class SkuCellComponent implements OnInit, TableCell {
  public col: TableColumn<any>;
  public item: any;
  constructor() { }

  ngOnInit(): void {}

}
