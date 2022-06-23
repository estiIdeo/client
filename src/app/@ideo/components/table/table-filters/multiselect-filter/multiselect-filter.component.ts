import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { TableFilter, TableFilterInput } from '../../../../../@ideo/components/table/models/table-filter';

@Component({
  selector: 'prx-multiselect-filter',
  templateUrl: './multiselect-filter.component.html',
  styleUrls: ['./multiselect-filter.component.scss'],
})
export class MultiselectFilterComponent<T = any, D = any> implements OnInit, TableFilterInput<T, D> {
  public filter: TableFilter;
  public group: FormGroup;
  public comparisonOptions: SelectItem[];

  constructor() { }

  ngOnInit(): void { }
}
