import { Component, OnInit } from '@angular/core';
import { TableFilterInput, TableFilter, MatchMode } from '../../models/table-filter';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectItem } from '../../models/select-item';
import { FreeSearchFilterData } from './free-search-filter-data.model';
import { FilterObject, FilterInsideObject } from '../../events/lazy-load.event';

@Component({
  selector: 'prx-free-search-filter',
  templateUrl: './free-search-filter.component.html',
  styleUrls: ['./free-search-filter.component.scss']
})
export class FreeSearchFilterComponent<T = any> implements OnInit, TableFilterInput<T, FreeSearchFilterData<T>>{
  public filter: TableFilter<T, FreeSearchFilterData<T>>;
  public group: FormGroup;
  public comparisonOptions: SelectItem[];
  private get data() {
    return this.filter.data
  }
  public get filterKeys() {
    return this.data.filterKeys
  }
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.group.addControl('fields', this.fb.control(this.filterKeys?.map(i => i.value)))
    class KeepThis extends FormGroup {
      constructor(obj: any) {
        super({}, null);
        for (const [key, value] of Object.entries(obj)) {
          this[key] = value
        }
      }
      fixFilter(): FilterObject<T>[] {
        const text: string = this.controls?.['value'].value
        if (!text) { return }
        const selectedFilters: FreeSearchFilterData<T>['filterKeys'][number]['value'][] = this.controls?.['fields']?.value
        console.log('test:', text, '\n arr', selectedFilters)
        return selectedFilters?.map(i => ({
          [i]: {
            value: text,
            matchMode: MatchMode.Contains,
          }
        } as FilterObject<T>))
      }
    }
    const keepThis: KeepThis = new KeepThis(this.group);
    this.group.getRawValue = () => ({
      matchMode: MatchMode.Contains,
      value: this.group?.controls?.['value'].value,
      innerFilter: keepThis.fixFilter()
    } as FilterInsideObject<T>);
  }

}
