import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StringHelperService } from '../../infrastructure/services/string-helper.service';
import { TimezoneService } from '../../infrastructure/services/timezone.service';

@Component({
  selector: 'ideo-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true,
    },
  ],
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
  @Output() public onChangeEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() public onWriteValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() public type: 'time' | 'datetime-local' | 'month' | 'date' = 'datetime-local';
  @Input() public inputClass: string;
  @Input() public set isDisabled(val: boolean) {
    this.disabled = val
  };

  public onChange: any = () => { };
  public onTouch: any = () => { };
  public id: string = `calendar-${this.stringHelper.randomStr(4)}`;
  public disabled: boolean;
  public presentationValue: string;
  public writeValueCount: number = 0

  constructor(
    private stringHelper: StringHelperService,
    private timezoneService: TimezoneService,
  ) {
  }

  ngOnInit(): void { }

  public writeValue(date: string): void {
    if (new Date(date).getFullYear() === 1) {
      return;
    }
    switch (this.type) {
      case 'datetime-local':
        date = date ? this.timezoneService.fromUtcToDateTime(date).slice(0, 16) : null
        this.presentationValue = date
        break;
      case 'date':
        date = date ? new Date(date)?.toISOString()?.slice(0, 10) : null
        this.presentationValue = date;
        break;
      case 'time':
        if(typeof date === 'string' && !!date){
          if (date.length == 8) {
            date = date.slice(0, 5);
          }
          else if ((date.length != 5)) {
            date = date ? new Date(date)?.toISOString()?.slice(11, 16) : null;
          } 
           
        }
        this.presentationValue = date;
        break;
      default:
        this.presentationValue = date;
        break;
    }
    // if (this.writeValueCount < 5) {
    //   // fix the problem with the auto value of the current time(when date is required) and fill the current value when it inter
    //   this.writeValueCount++
    this.onWriteValue.next(this.presentationValue)
    // }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onInputChange(date: string) {
    switch (this.type) {
      case 'datetime-local':
        this.presentationValue = date
        break;
      default:
        break;
    }
    this.onChange(this.presentationValue);
    this.onTouch(this.presentationValue);
    this.onChangeEvent.emit(this.presentationValue);
  }

}
