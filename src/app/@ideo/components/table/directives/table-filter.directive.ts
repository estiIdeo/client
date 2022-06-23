import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableColumn } from '../models/table-column';
import { TableFilter, TableFilterInput } from '../models/table-filter';
import { PermissionsService } from '../../../infrastructure/services/permissions.service';
import { TableFilterDic } from '../models/types';
import { TextFilterComponent } from '../table-filters/text-filter/text-filter.component';
import { TableFiltersService } from '../services/table-filters.service';

@Directive({
  selector: '[tableFilter]',
})
export class TableFilterDirective implements OnInit {
  public component: ComponentRef<TableFilterInput>;

  @Input('tableFilter') public filter: TableFilter | TableFilter[];
  @Input() public column: TableColumn;
  @Input() public group: FormGroup;
  @Input() public innerFilter: boolean = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private fb: FormBuilder,
    private filterService: TableFiltersService,
    private permissionService: PermissionsService
  ) { }

  ngOnInit(): void {
    if (this.createFilterFromColumn()) {
      this.instantiateComponent();
    }
  }

  private instantiateComponent(filter: TableFilter | TableFilter[] = null) {
    const filters = !!filter
      ? Array.isArray(filter)
        ? filter
        : [filter]
      : Array.isArray(this.filter)
        ? this.filter
        : [this.filter];

    for (const filter of filters.filter(i => !!i.type)) {
      // if (!filter.type) debugger
      const factory = this.resolver.resolveComponentFactory<any>(filter.type);
      this.component = this.container.createComponent(factory);
      if (!this.innerFilter) {
        [
          'col-6',
          'col-md-4',
          'col-lg-3',
          'col-xl-2',
          'pb-3',
          !!filter.styleClass ? [...filter.styleClass.split(' ')] : null,
        ]
          .filter((x) => !!x)
          .forEach((className) => {
            if (className instanceof Array) {
              className.forEach(element => {
                (this.component.location.nativeElement as HTMLElement).classList.add(element + '')
              });
            } else {
              (this.component.location.nativeElement as HTMLElement).classList.add(className + '')
            }
          }
          );
      } else {
        (this.component.location.nativeElement as HTMLElement).classList.add('w-100');
      }

      if (filter.hidden) {
        (this.component.location.nativeElement as HTMLElement).classList.add('d-none');
      }

      this.component.instance.filter = filter;
      this.component.instance.column = this.column;
      const comparisonOptions = this.filterService.getComparisonOptions(filter.type);
      this.component.instance.comparisonOptions = comparisonOptions;
      const defaultMatchMode = !!comparisonOptions && comparisonOptions.length ? comparisonOptions[0].value : 2000;
      const innerComparisonOptions = !!filter.innerFilter
        ? this.filterService.getComparisonOptions(filter.innerFilter.type)
        : null;
      const innerDefaultMatchMode =
        !!innerComparisonOptions && innerComparisonOptions.length ? innerComparisonOptions[0].value : 2000;
      this.component.instance.innerComparisonOptions = innerComparisonOptions;
      this.group.addControl(
        filter.name,
        this.fb.group({
          value: this.fb.control(null),
          matchMode: this.fb.control(filter.matchMode || defaultMatchMode),
          regularParam: this.fb.control(filter.regularParam),
          innerFilter: !!filter.innerFilter
            ? this.fb.group({
              name: filter.innerFilter.name,
              value: this.fb.control(null),
              matchMode: this.fb.control(filter.innerFilter.matchMode || innerDefaultMatchMode),
            })
            : null,
        })
      );
      this.component.instance.group = this.group.controls[filter.name] as FormGroup;
    }
  }

  private createFilterFromColumn(): boolean {
    if (!this.filter) {
      if (TableFilterDic[this.column.type] === null || this.column.filter === null) {
        return false;
      }
      this.filter = {
        type: !!this.column.type ? TableFilterDic[this.column.type] : TextFilterComponent,
      };
    }
    if (!!this.filter && !Array.isArray(this.filter)) {
      if (this.filter.permission && !this.permissionService.permitted(this.filter.permission)) {
        return false;
      }

      if (!this.filter.name) {
        this.filter.name = this.column.field;
      }
      if (!this.filter.placeholder) {
        this.filter.placeholder = this.column.header;
      }
    } else {
      const filters = Array.from(this.filter as TableFilter[]);
      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];

        if (filter.permission && !this.permissionService.permitted(filter.permission)) {
          return false;
        }
        if (!filter.name) {
          filter.name = this.column.field;
        }
        if (!filter.placeholder) {
          filter.placeholder = this.column.header;
        }
      }
    }
    return true;
  }
}
