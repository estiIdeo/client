import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { TableFilter, TableFilterInput } from '../../models/table-filter';

@Component({
  selector: 'prx-char-filter',
  templateUrl: './char-filter.component.html',
  styleUrls: ['./char-filter.component.scss'],
})
export class CharFilterComponent implements OnInit, TableFilterInput {
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
