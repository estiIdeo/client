import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableFilter, TableFilterInput } from '../../../../../@ideo/components/table/models/table-filter';

@Component({
  selector: 'prx-related-filter',
  templateUrl: './related-filter.component.html',
  styleUrls: ['./related-filter.component.scss'],
})
export class RelatedFilterComponent implements OnInit, TableFilterInput {
  constructor() {}

  public filter: TableFilter;
  public column: TableColumn<any>;
  public group: FormGroup;
  public comparisonOptions: SelectItem[];
  public innerComparisonOptions: SelectItem[];

  ngOnInit(): void {}
}
