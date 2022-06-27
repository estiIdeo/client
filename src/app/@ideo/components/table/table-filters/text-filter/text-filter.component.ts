import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TableFilter, TableFilterInput } from '../../../../../@ideo/components/table/models/table-filter';
import { SelectItem } from '../../models/select-item';

@Component({
  selector: 'prx-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss'],
})
export class TextFilterComponent implements OnInit, TableFilterInput {
  public filter: TableFilter;
  public group: FormGroup;
  public comparisonOptions: SelectItem[];

  constructor() {}

  ngOnInit(): void {}

  public keyUp(evt: any) {
    if (evt.keyCode == '13') {
      if(!!this.filter?.submit ){
        this.filter.submit();
      }
    }
  }
}
