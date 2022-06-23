import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { TableFilter, TableFilterInput } from '../../../../../@ideo/components/table/models/table-filter';

@Component({
  selector: 'prx-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.scss'],
})
export class CheckboxFilterComponent implements OnInit, TableFilterInput {
  public filter: TableFilter;
  public group: FormGroup;
  public comparisonOptions: SelectItem[];
  constructor() {}

  ngOnInit(): void {}
}
