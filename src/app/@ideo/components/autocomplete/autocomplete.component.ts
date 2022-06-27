import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { RtlService } from '@app/@shared/services/rtl.service';
import { StringHelperService } from '../../infrastructure/services/string-helper.service';
import { SelectComponent } from '../select/select.component';
import { SelectItem } from '../table/models/select-item';


@Component({
  selector: 'ideo-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent extends SelectComponent {
  // private filterByQuery: Subject<string> = new Subject<string>();

  public focus: boolean = false;
  public query: string = '';

  @Input() private allowAnyString: boolean;
  @Input() private optionLimit: number;
  // @Input() private resolveLabel: (val: any) => Promise<string> | string;
  // @Input() private optionsFetcher: (query: string) => Observable<SelectItem[]>;

  constructor(stringHelper: StringHelperService, cd: ChangeDetectorRef, rtlService: RtlService) {//, permissions: PermissionsService
    super(stringHelper, cd, rtlService);

  }

  // ngOnInit(): void {
  // this.filterByQuery
  //   .pipe(
  //     debounceTime(300),
  //     switchMap((query: string) => this.optionsFetcher(query).pipe(catchError((err) => of([])))),
  //     takeWhile((x) => this.isAlive)
  //   )
  //   .subscribe((list) => this.updateList(list));
  // }

  // private filter(value: string) {
  //   this.query = value;
  //   this.filterByQuery.next(value);
  // }

  public writeValue(val: any): void {
    if (val !== this.value) {
      this.value = val

      this.cd.markForCheck()
    }
  }

  // private updateList(list: SelectItem[]) {
  //   this.options = list;
  //   this.cd.markForCheck();
  // }

  public get modal(): SelectItem | string {
    if (!!this.value) {
      return this.options?.find(i => i.value === this.value)
    } else {
      return this.label
    }
  }

  public set modal(val: SelectItem | string) {
    if (!!this.allowAnyString) {
      this.value = val
      this.label = typeof val === 'object' ? val?.label : val
      return
    }

    let value: SelectItem = null
    if (typeof val === 'object') {
      value = this.options?.find(i => i?.label === val?.label)?.value
    }
    if (value !== this.value && (this.value !== undefined || !!value)) {
      this.optionClicked(value)
    }
    this.label = typeof val === 'object' ? val?.label : val
  }

  public search: OperatorFunction<string, readonly SelectItem[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term: any) => term === '' ? this.options?.slice(... !!this.optionLimit ? [0, this.optionLimit] : [0])
        : this.options.filter(v => v.label?.toString().toLowerCase().includes(term.toLowerCase()))?.slice(... !!this.optionLimit ? [0, this.optionLimit] : [0]))
    )

  @Input() public formatter: (x: SelectItem) => SelectItem['label'] = (x: SelectItem) => x.label;
}
