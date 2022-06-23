import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'prx-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => SearchInputComponent),
  //     multi: true,
  //   },
  // ],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() public styleClass: string;
  @Input() public styleString: string = '';
  @Input() value: string
  @Output() valueChange = new EventEmitter<string>();
  @Input() public asCard: boolean;
  @Input() public placeholder: string = 'Search topics or keywords'
  @Input() public hideSearch: boolean
  public isAlive: boolean = true


  public searchText: Subject<string> = new Subject<string>();

  onKeydownEvent(val: HTMLDataElement['value']) {
    this.searchText.next(val)
  }

  constructor() {
  }

  ngOnInit(): void {
    this.searchText.pipe(
      takeWhile(r => this.isAlive),
      debounceTime(300)
    ).subscribe(val => {
      this.onChange.emit(val)
    })
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
