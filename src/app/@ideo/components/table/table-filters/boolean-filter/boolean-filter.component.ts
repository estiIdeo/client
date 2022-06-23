import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { StringHelperService } from '../../../../../@ideo/infrastructure/services/string-helper.service';
import { TableFilter, TableFilterInput } from '../../../../../@ideo/components/table/models/table-filter';

@Component({
  selector: 'prx-boolean-filter',
  templateUrl: './boolean-filter.component.html',
  styleUrls: ['./boolean-filter.component.scss'],
})
export class BooleanFilterComponent implements OnInit, TableFilterInput {
  public id: string = `switch-filter-${this.stringHelper.randomStr(4)}`;
  public comparisonOptions: SelectItem[];
  public filter: TableFilter;
  public group: FormGroup;

  constructor(private stringHelper: StringHelperService) {}

  ngOnInit(): void {}
}
