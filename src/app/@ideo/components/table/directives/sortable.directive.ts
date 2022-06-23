import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { SortEvent } from '../events/sort.event';
import { Rotate, SortDirection } from '../models/types';
import { SortService } from '../services/sort.service';

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.sorting]': '!!sortable',
    '[class.position-relative]': '!!sortable',
    '[class.pointer]': '!!sortable',
    '[class.px-4]': '!!sortable',
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': '!!sortable && rotate()',
  },
})
export class SortableDirective {
  @Input() sortable: string = '';
  @Input() direction: SortDirection = '';
  @Output() sort: EventEmitter<SortEvent> = new EventEmitter<SortEvent>();

  constructor(private sortService: SortService) {}

  ngOnInit() {
    this.sortService.sort.subscribe((s: string) => {
      if (!!this.sortable && this.sortable != s) {
        this.direction = '';
      }
    });
  }

  rotate() {
    if (!!this.sortable) {
      this.direction = Rotate[this.direction];
      this.sort.emit({ column: this.sortable, direction: this.direction });
      this.sortService.sort.emit(this.sortable);
    }
  }
}
