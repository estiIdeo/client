import { EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { TableColumn } from '../../models/table-column';
import { LazyLoadEvent } from '../../events/lazy-load.event';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { StorageKeysService } from '@app/@ideo/infrastructure/services/storage-keys.service';
import { TableService } from '../../services/table.service';
import { RtlService } from '@app/@shared/services/rtl.service';
import { UtilsService } from '@app/@ideo/infrastructure/services/utils.service';


@Component({
  selector: 'table-filters',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.scss'],
})
export class TableFiltersComponent implements OnInit, AfterViewInit {
  @Input() columns: TableColumn[];
  @Input() stateKey: string;
  @Output() filterEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() forceCollapse?: boolean = false

  public appliedFilterCount: number;

  public isCollapsed = true;

  filtersDefaultValues: any;
  public group: FormGroup = this.fb.group({});

  public buttons: ButtonItem[] = [
    {
      label: 'Portal.Ideo.Table.Filters.Reset',
      click: () => this.reset(),
      styleClass: 'btn-static position-relative btn',
      icon: faRedo,
      iconClass: 'mr-2',
    },
  ];

  public applyBtn: ButtonItem = {
    label: 'Portal.Ideo.Table.Filters.Apply',
    styleClass: 'btn-primary position-relative btn ',
    click: () => this.applyFilters(true),
    disabled: !this.group.valid,
  };

  public get isRtl(): boolean {
    return this.rtlService.isRtl;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private storageKeysService: StorageKeysService,
    private tableService: TableService,
    private rtlService: RtlService
  ) { }
  ngOnInit(): void {
    for (let i = 0; i < this.columns.length; i++) {
      const element = this.columns[i];
      if (Array.isArray(element.filter)) {
        for (let z = 0; z < element.filter.length; z++) {
          const f = element.filter[z];
          f.submit = () => this.applyFilters(true);
        }
      } else if (!!element.filter) {
        element.filter.submit = () => this.applyFilters(true);
      }
    }
  }

  ngAfterViewInit(): void {
    this.filtersDefaultValues = this.group.getRawValue();
    const emit = this.setFiltersFromQueryParams(this.route.snapshot.queryParams);
    if (emit) {
      this.applyFilters();
    } else {
      this.loadStoredFilters();
    }
  }

  public applyFilters(saveFilters: boolean = false) {
    let values = this.group.getRawValue();
    Object.keys(values).forEach((name) => {
      if (values[name] === null || values[name] === undefined) {
        delete values[name];
      }
    });
    if (saveFilters) {
      const storedFilters = this.storageKeysService.getItem<LazyLoadEvent>(this.stateKey);
      if (storedFilters) {
        storedFilters.filters = values;
        this.storageKeysService.setItem(this.stateKey, storedFilters);
      }
    }
    //calculate filters number
    this.appliedFilterCount = 0;
    UtilsService.iterate(values, (obj, prop) => {
      //allow zero
      if (prop === 'value' && (!!obj[prop] || obj[prop] == 0)) {
        this.appliedFilterCount++;
      }
    });

    this.filterEvent.emit(values);
  }

  public reset() {
    let values = this.group.getRawValue();
    UtilsService.iterate(values, (obj, prop) => {
      if (prop === 'value') obj[prop] = null;
    });
    values = { ...values, ...this.filtersDefaultValues };
    // save default values
    this.group.patchValue(values);
    //remove filters
    this.storageKeysService.removeItem(this.stateKey);
    this.appliedFilterCount = 0;
    const hasQueryParamsFilter = this.setFiltersFromQueryParams(this.route.snapshot.queryParams);
    this.tableService.resetState();
    if (hasQueryParamsFilter) {
      this.applyFilters(false);
    } else {
      this.filterEvent.emit(this.filtersDefaultValues);
    }
  }

  public loadStoredFilters() {
    const storedFilters = this.storageKeysService.getItem<LazyLoadEvent>(this.stateKey);
    if (storedFilters) {
      this.group.patchValue(storedFilters.filters);
      this.applyFilters(false);
    }
  }

  public setFiltersFromQueryParams(params: Params): boolean {
    let keys = !!params && Object.keys(params);
    let emit = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (this.group.controls[key]) {
        (this.group.controls[key] as FormGroup).controls['value'].setValue(params[key]);
        emit = true;
      }
    }
    return emit;
  }
}
