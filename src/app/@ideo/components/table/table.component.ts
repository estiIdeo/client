import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder } from '@angular/forms';
import { StringHelperService } from '../../../@ideo/infrastructure/services/string-helper.service';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { TableColumn } from '../../../@ideo/components/table/models/table-column';
import { TableFilter } from '../../../@ideo/components/table/models/table-filter';
import { TableService } from './services/table.service';
import { takeWhile } from 'rxjs/operators';
import { SortEvent } from '../../../@ideo/components/table/events/sort.event';
import { ButtonItem } from '../../core/models/button-item';
import { SortService } from './services/sort.service';
import { Observable } from 'rxjs';
import { ChangeDetectorRef, OnChanges } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TableRowGroup } from './models/row-group';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { SelectItem } from './models/select-item';
import { FormTextComponent } from '@app/@forms/form-fields';
import { RtlService } from '@app/@shared/services/rtl.service';

@Component({
  selector: 'ideo-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [
    TableService,
    SortService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {
  private isAlive: boolean = true;
  private component: TableComponent;
  @Input() public fullHeight: boolean = false;
  @Input() public showFilters: boolean = true;
  private _filters: TableFilter[];
  @Input() public filters: TableFilter[];
  @Input() stateKey: string;
  @Input() hideHeader: boolean
  @Input() valid?: (item: any, key?: string) => boolean;
  @Input() rowStyle?: (item: any) => string;

  @Input() autoValidate: { [field: string]: DynamicFormControl } = null;

  public rowEdits: { [index: number]: boolean } = {};
  public form: FormGroup;
  public _columns: TableColumn[] = [];
  public onChange: any = (): any => null;
  public onTouch: any = (): any => null;
  public rowControls: { [index: number]: DynamicFormControl[] } = {};
  @Input() public set columns(cols: TableColumn[]) {
   // this._columns = this.rolePipe.transform(cols);
  }
  public get columns(): TableColumn[] {
    return this._columns;
  }

  public get isRtl(): boolean {
    return this.rtlService?.isRtl
  }

  public _buttons: ButtonItem[] = [];
  @Input() public set buttons(btnArr: ButtonItem[]) {
 //   this._buttons = this.rolePipe.transform(btnArr);
  }

  public availableButtons(item: any): ButtonItem[] {
    return this.buttons.filter(i => !i.hidden || !i.hidden(item))
  }

  public get buttons(): ButtonItem[] {
    return this._buttons;
  }

  public iconClass(icon: IconDefinition | string | false): string | false {
    if (!icon) return '';
    if (typeof icon !== 'string') {
      let res = icon.prefix + ' fa-' + icon.iconName;
      return res;
    }
    return icon;
  }

  @ViewChild('importFile') public importFile: ElementRef<any>;
  // @ViewChild(NgbPagination) public pagination: NgbPagination;

  @Input() public loading: boolean;
  @Input() public loading$: Observable<boolean>;
  @Input() public totalRecords: number;
  @Input() public showTotalRecords: boolean = true;
  @Input() public rowGroup: TableRowGroup = null;

  @Input() public lazy: boolean = true;
  @Input() public lazyLoadOnInit: boolean = true;
  @Input() public pageSizeOptions: SelectItem[] = [10, 25, 50, 100, 250]?.map(i => ({ value: i, label: i + ' ' /** plus ' ' to avoid unwanted translate */ }))
  @Input() public dataKey: string = 'id';
  // @Input() public exportRequestType: 'get' | 'post' = 'get';

  //Selection
  @Input() public selectionMode: SelectionMode;
  public selectedKeys: { [id: string]: boolean } = {};

  @Output() public onLazyLoad: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();
  @Output() public onRowHover: EventEmitter<{
    index: number;
    item: any;
    hoverMode: 'enter' | 'leave';
  }> = new EventEmitter<{ index: number; item: any; hoverMode: 'enter' | 'leave' }>();

  private _items: any[];
  @Input() public set items(val: any[]) {
    this.loading = false;
    this._items = val;
    this.selectCurrentPage = false;
    this.rowEdits =
      this._items?.reduce((prv, cur, i) => {
        prv[i] = false;
        return prv;
      }, {}) || {};
    this.setSelections();
  }
  public get items() {
    return this._items;
  }

  public domId: number = Math.random();
  public selectCurrentPage: boolean = false;
  public firstCallOut = true;

  @Output() public selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  private _selection: any[] = [];
  @Input() public set selection(val: any[]) {
    if (!!val) {
      this._selection = val;
    }
    this.selectionChange.emit(this.selection);
  }

  public get selection() {
    return this._selection;
  }
  private _initSelection: number[] = [];
  @Input() public set initSelection(vals: number[]) {
    this.selectedKeys = {};
    if (!!vals && !!vals.length) {
      //Set keys
      vals.forEach((v) => (this.selectedKeys[v] = true));
      //keep prev selected
      this.selection = this.selection ? this.selection.filter((s) => !!this.selectedKeys[s[this.dataKey]]) : [];
      //keep remaining keys
      this._initSelection = vals;
      //this._initSelection = vals.filter(v => this.selection.find(s => s[this.dataKey] == v));
      //Try to take more from the items
      this.setSelections();
    } else {
      this.selection = [];
    }
  }
  public get initSelection(): number[] {
    return this._initSelection;
  }

  public getControl(colField: string, val: any, itemIndex: number) {
    const copy = { ...this.autoValidate[colField] };
    if (!!copy?.config) {
      copy.config.value = !!val ? val : null;
      this.rowEdits[itemIndex] = true;
    }

    return (
      copy ||
      ({
        type: FormTextComponent,
        config: {
          name: colField,
        },
      } as DynamicFormControl)
    );
  }

  public idCheckbox: string = `${this.stringHelper.randomStr(4)}`;

  constructor(
    public service: TableService,
    //private rolePipe: PermitPipe,
    private cd: ChangeDetectorRef,
    private stringHelper: StringHelperService,
    private fb: FormBuilder,
    private rtlService: RtlService,
  ) {
    if (!!this.autoValidate) {
      this.autoValidate = !!this.autoValidate ? { ...this.autoValidate } : null;
    }
    this.form = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['items']?.currentValue) {
      this.form = this.fb.group({
        items: this.fb.array(this.items.map((z) => this.fb.group({}))),
      });
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  setItemValue(item: any, key: string, value: any) {
    item[key] = value;
    this.cd.markForCheck();
  }

  public writeValue(selectionArr: any[]): void {
    if (!!selectionArr) {
      this.initSelection = [...selectionArr];
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public setDisabledState?(isDisabled: boolean): void { }

  public updateForm() {
    let selected = [...this.selection.map((s) => s[this.dataKey]), ...this.initSelection];
    this.onChange(selected);
    this.onTouch(selected);
  }

  ngOnInit(): void {
    this.component = this;
    if (this.stateKey) {
      this.service.setStateFromStorage(this.stateKey);
    }
    // let comp = this;
    // this.loading$.subscribe(c => console.log('Table.Loading', { loading: c, comp  }))
  }

  ngAfterViewInit(): void {
    this.service
      .lazyLoadEvent()
      .pipe(takeWhile((x) => this.isAlive))
      .subscribe((evt) => {
        this.loading = true;
        this.onLazyLoad.emit(evt);
        setTimeout(() => {
          this.firstCallOut = true;
        }, 0);
      });

    if (this.lazyLoadOnInit) {
      setTimeout(() => {
        this.getData();
      }, 0);
    }
  }

  changeAllSelected(checked: boolean) {
    if (checked) {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        if (!this.selectedKeys[item[this.dataKey]]) {
          this.selectedKeys[item[this.dataKey]] = true;
          this.selection.push(item);
        }
      }
      this.selection = [...this.selection];
    } else {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        this.selectedKeys[item[this.dataKey]] = false;
      }
      this.selection = this.selection.filter((selected) => !!this.selectedKeys[selected[this.dataKey]]);
    }
    this.updateForm();
  }

  changeSelected(checked: boolean, item: any) {
    let selectedKey = item[this.dataKey];
    if (this.selectionMode == 'single') {
      Object.keys(this.selectedKeys).forEach((key) => {
        if (key != selectedKey) delete this.selectedKeys[key];
      });
    }
    this.selectedKeys[selectedKey] = !this.selectedKeys[selectedKey];
    if (checked) {
      this.selection.push(item);
    } else {
      let index = this.selection.findIndex((selected) => selected[this.dataKey] == item[this.dataKey]);
      this.selection.splice(index, 1);
    }
    this.selection = [...this.selection];
    this.updateForm();
  }

  public getData() {
    this.service.emitLazyLoadEvent();
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    let col = this.columns.find((z) => z.field == column);
    if (!!col.sorts?.length) {
      this.service.sorts = [...col.sorts];
    }
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  /*export(all: boolean, type: 'Excel' | 'Csv' = 'Excel'): void {
    // if (this.account.isAdminAndDomainIsSelected(true)) {
    let currentState = this.service.getTableState();
    if (all) {
      currentState.pageSize = MAX_INT;
      currentState.exportAll = true;
    }
    currentState.exportType = type;

    this.onLazyLoad.emit({ ...currentState });
    // }
  }

  exportSelection(): void {
    // if (this.account.isAdminAndDomainIsSelected(true)) {
    let currentState = this.service.getTableState();
    const selected = Object.keys(this.selectedKeys)
      .filter((k) => this.selectedKeys[k])
      .map((k) => +k);
    if (!selected || !selected.length) {
      return;
    }
    currentState.exportIds = selected;
    currentState.page = 1;
    currentState.pageSize = MAX_INT;
    currentState.exportType = 'False';
    this.onLazyLoad.emit({ ...currentState });
    // }
  }
*/
  public rowHover(index: number, item: any, enter: boolean) {
    this.onRowHover.next({ index: index, item: item, hoverMode: !!enter ? 'enter' : 'leave' });
  }

  private setSelections() {
    if (!!this.initSelection && !!this.initSelection.length && !!this.items && !!this.items.length) {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        let index = this.initSelection.indexOf(item[this.dataKey]);
        if (index > -1) {
          this.selection.push(item);
          this.initSelection.splice(index, 1);
        }
      }
    }
  }
}
export type SelectionMode = '' | 'single' | 'multiple';
export const MAX_INT = 2147483647;
