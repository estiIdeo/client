import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from '../table/models/select-item';
import { StringHelperService } from '../../infrastructure/services/string-helper.service';
import { LazyLoadEvent, FilterObject } from '../table/events/lazy-load.event';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { tap, take, debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { IPagedList } from '../../../@shared/models/paged-list.response';
import { OnInit } from '@angular/core';
import { RtlService } from '../../../@shared/services/rtl.service';
import { Placement } from '@ng-bootstrap/ng-bootstrap';
import { FormMultiSelectDataModel } from 'src/app/@forms/form-fields/form-multiselect/form-multiselect.data.model';

@Component({
  selector: 'ideo-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectComponent),
      multi: true,
    },
  ],
})
export class MultiselectComponent implements ControlValueAccessor, AfterViewInit, OnDestroy, OnInit {
  public _showIconToggle: boolean = false;
  public placement: Placement = 'auto'
  @Input() public set showIconToggle(v: boolean) {
    this.placement = this.rtlService.isRtl ? 'bottom-left' : 'bottom-right'
    this._showIconToggle = v
  }
  public get showIconToggle() {
    return this._showIconToggle
  }
  private _optionObj: { [key: string]: any };
  public selectedKeys: { [key: string]: boolean } = {};

  public get getSelected() {
    let arr = []
    for (let i in this.selectedKeys) {
      if (this.selectedKeys[i]) {
        arr.push(i)
      }
    }
    return arr
  }

  @Input() public parsedDynamicComponent?: FormMultiSelectDataModel['parsedDynamicComponent']
  // @Input() public editFullOptions?: FormMultiSelectDataModel['editFullOptions']
  @Input() public fullOptionSetter?: Subject<{ includes?: any[], exclude?: any[] }>

  public ngOnInit() {
    this.fullOptionSetter?.pipe(takeUntil(this.ended))?.subscribe(res => {
      if (!!res?.includes?.length) { this.selectedOption = this.selectedOption?.concat(res?.includes).removeDuplicate() }
      if (!!res?.exclude?.length) { this.selectedOption = this.selectedOption?.filter(i => res?.exclude?.includes(i)) }
      this.cd.markForCheck()
    })
  }


  public onChange: any = () => { };
  public onTouch: any = () => { };
  public id: string = `dropdown-${this.stringHelper.randomStr(4)}`;
  public _label: string

  public label(search?: boolean): string {
    if (search && this.value?.length && !this._label?.includes('items selected')) {
      return `${this.value?.length} items selected`
    } else {
      return this._label || this.placeholder
    }
  }

  public value: any[];

  @Input() public placeholder: string = 'Select';
  @Input() public showSelectPrefix: boolean = false;
  @Input() public buttonStyleClass: string = '';
  @Input() public dataKey: string;
  @Input() public queryFilters?: (query: string) => FilterObject;
  @Output() public change: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;
  @ViewChild('queryElement', { static: true }) queryElement: ElementRef;

  private _options: SelectItem[];
  @Input() public set options(arr: SelectItem[]) {
    this._optionObj = {};

    if (arr)
      arr.forEach((option) => {
        this._optionObj[!!this.dataKey ? option.value[this.dataKey] : option.value] = option.label;
      });

    this._options = arr;
    this.updateLabel();
  }
  public get options(): SelectItem[] {
    return this._options;
  }

  private ended: EventEmitter<boolean> = new EventEmitter<boolean>();
  private queryChangedEvt: EventEmitter<string> = new EventEmitter<string>();
  public asyncOptions: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);

  protected _lazyOptions: (evt: LazyLoadEvent) => Observable<IPagedList<SelectItem>>;
  @Input() public set lazyOptions(lazyOpt: (evt: LazyLoadEvent) => Observable<IPagedList<SelectItem>>) {
    if (!this._lazyOptions && !!lazyOpt) {
      this.options = [];
      this._lazyOptions = lazyOpt;
      this.updateLabel();
      this.asyncOptions
        .pipe(
          tap((arr) => {
            if (arr) {
              arr.forEach((option) => {
                this._optionObj[!!this.dataKey ? option.value[this.dataKey] : option.value] = option.label;
              });

              this.options.push(...arr);
            }
            return arr;
          })
        )
        .subscribe();
    }
  }

  public get lazyOptions(): (evt: LazyLoadEvent) => Observable<IPagedList<SelectItem>> {
    return this._lazyOptions;
  }

  public isOpen: boolean = false;
  public totalItems: number = 0;
  private lastQuery: string = null;
  private filter: FilterObject = null;
  private _disabled: boolean;
  public get disabled(): boolean {
    return this._disabled;
  }

  constructor(
    private stringHelper: StringHelperService,
    protected cd: ChangeDetectorRef,
    private rtlService: RtlService
  ) { }
  ngAfterViewInit(): void {
    if (!!this.queryFilters) {
      this.queryChangedEvt.pipe(debounceTime(300), takeUntil(this.ended)).subscribe((query) => {
        console.log(`${this.lastQuery} | ${query}`);
        if (this.lastQuery != query) {
          this.filter = this.queryFilters?.(query);
          this.asyncOptions.next([]);
          this.totalItems = 0;
          this.lastQuery = query;
          setTimeout(() => {
            this.viewPort.checkViewportSize();
            this.nextBatch(0, null, true);
          });
        }
      });
    }

    this.setSelectedKeys();
  }
  ngOnDestroy(): void {
    this.ended.next(true);
  }

  private currentFetch: Subscription;

  nextBatch(currIndex: number, items: any[], explicit?: boolean) {
    if (!this.lazyOptions) {
      return;
    }
    const start = this.viewPort.getRenderedRange().start;

    const end = !!explicit ? 0 : this.viewPort.getRenderedRange().end;
    const total = this.viewPort.getDataLength();

    if (end == total && (!this.totalItems || end < this.totalItems)) {
      if (!!this.currentFetch) {
        this.currentFetch.unsubscribe();
        this.currentFetch = null;
      }
      this.currentFetch = this.lazyOptions({ page: (!!end ? end / 5 : 0) + 1, pageSize: 5, filters: this.filter })
        .pipe(
          debounceTime(300),
          take(1),
          finalize(() => {
            this.currentFetch.unsubscribe();
            this.currentFetch = null;
          })
        )
        .subscribe((res) => {
          this.totalItems = res?.total || 0;
          this.asyncOptions.next([...this.asyncOptions.value, ...(res?.data || [])].filter((x) => !!x));
        });
    }
  }

  // public openChange(open: boolean) {
  //   this.isOpen = open;
  //   setTimeout(() => {
  //     if (this.queryElement) {
  //       this.queryElement?.nativeElement.focus();
  //     }
  //   }, 1000);
  // }

  public autofocus(el: HTMLInputElement) {
    el.focus()
  }

  public queryChanged(evt: any) {
    this.queryChangedEvt.next(evt?.target?.value);
  }
  writeValue(value: any): void {
    this.value = value;
    this.updateLabel();
    this.setSelectedKeys();
    this.cd.markForCheck();
  }

  trackByIdx(i: number) {
    return i;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  public selectedOption: SelectItem[] = []

  public optionClicked(option: any): void {
    const { value } = option
    let selectionIndex = this.findSelectionIndex(value);
    if (selectionIndex != -1) {
      this.value = this.value.filter((val, i) => i != selectionIndex);
      delete this.selectedKeys[!!this.dataKey ? value[this.dataKey] : value];
      this.selectedOption = this.selectedOption.filter(i => i?.value !== value)
    } else {
      this.value = [...((Array.isArray(this.value) ? this.value : [this.value]) || []), value].filter(
        (i) => i !== null
      );
      this.selectedKeys[!!this.dataKey ? value[this.dataKey] : value] = true;
      this.selectedOption.push(option)
    }
    this.updateLabel();
    this.onChange(this.value);

    this.onTouch(this.value);
    this.change.emit({ value: this.value, options: this.selectedOption });
  }

  public setSelectedKeys() {
    this.selectedKeys = {};
    if (!!this.value && !!this.value.length) {
      this.value.forEach((val) => (this.selectedKeys[!!this.dataKey ? val[this.dataKey] : val] = true));
    }
  }

  findSelectionIndex(val: any): number {
    let index = -1;
    if (this.value) {
      for (let i = 0; i < this.value.length; i++) {
        if (
          (!!this.dataKey ? this.value[i][this.dataKey] : this.value[i]) == (!!this.dataKey ? val[this.dataKey] : val)
        ) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  updateLabel() {
    this.value = this.value?.filter(i => !!i || i === 0)
    this._label =
      !!this.value && this.value.length === 1
        ? this._optionObj[!!this.dataKey ? this.value[0][this.dataKey] : this.value[0]]
        : !!this.value && this.value.length > 1
          ? `${this.value.length} items selected`
          : this.placeholder;
  }

  public scrollEnd() {
    const end = this.viewPort?.getRenderedRange().end;
    if (!!this.totalItems && !!end && end > 5) {
      setTimeout(() => {
        this.viewPort?.scrollToIndex(end - 5, 'smooth');
        this.cd.markForCheck();
      });
    }
  }
}
