import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { StringHelperService } from '../../../../../@ideo/infrastructure/services/string-helper.service';
import { TableFilter, TableFilterInput } from '../../../../../@ideo/components/table/models/table-filter';

@Component({
  selector: 'prx-calendar-filter',
  templateUrl: './calendar-filter.component.html',
  styleUrls: ['./calendar-filter.component.scss'],
})
export class CalendarFilterComponent implements OnInit, TableFilterInput {
  public id: string = `swithc-filter-${this.stringHelper.randomStr(4)}`;
  @ViewChild('input', { static: false }) public input: ElementRef<HTMLInputElement>;
  public comparisonOptions: SelectItem[];
  public filter: TableFilter;
  public group: FormGroup;

  constructor(private stringHelper: StringHelperService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (!!this.filter.value) {
      this.group.controls['value'].setValue(this.filter.value)
      if (!!this.input) {
        this.input.nativeElement.value = this.filter.value
      }
      this.cd.markForCheck()
    }
  }

  public keyUp(evt: any) {
    if (evt.keyCode == '13') {
      if(!!this.filter?.submit ){
        this.filter.submit();
      }
    }
  }
}
