import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { StringHelperService } from '../../infrastructure/services/string-helper.service';

@Component({
  selector: 'ideo-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  public onChange: any = () => { };
  public onTouch: any = () => { };

  public disabled: boolean = false;
  @Input() public id: string = `checkbox-${this.stringHelper.randomStr(4)}`;
  @Input() public label: string = '';
  @Input() public formControl: AbstractControl;
  @Output() public checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public value: boolean;

  @Input() public set checked(checked: boolean) {
    if (checked != this.value) {
      this.value = checked;
      this.onChange(checked);
    }
  }

  constructor(private stringHelper: StringHelperService, private cd: ChangeDetectorRef) { }

  writeValue(checked: any): void {
    this.value = checked;
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

  public handleClick(checked: boolean) {
    if (checked != this.value) {
      this.value = checked;
      this.onChange(checked);
      this.onTouch(checked);
      this.checkedChange.emit(checked);
    }
  }

  ngOnInit(): void { }
}
