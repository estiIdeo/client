// import { Directive, forwardRef, Output, EventEmitter } from '@angular/core';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";


// export const CUSTOM_INPUT_DATE_PICKER_CONTROL_VALUE_ACCESSOR: any = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => ControlValueAccessorDirective),
//   multi: true
// };

// @Directive({
//   selector: '[controlValueAccessor]',
//   host: { '(blur)': 'onTouched($event)' },
//   providers: [CUSTOM_INPUT_DATE_PICKER_CONTROL_VALUE_ACCESSOR]
// })
// export class ControlValueAccessorDirective implements ControlValueAccessor {
//   private innerValue: string;
//   @Output() onWriteValue: EventEmitter<number | string> = new EventEmitter<number | string>()

//   constructor() {
//   }

//   public onChange: any = () => { /*Empty*/ }
//   public onTouched: any = () => { /*Empty*/ }

//   get value(): any {
//     return this.innerValue;
//   };

//   set value(v: any) {
//     if (v !== this.innerValue) {
//       this.innerValue = v;
//     }
//   }

//   writeValue(val: string): void {
//     if (val !== this.innerValue) {
//       this.onWriteValue.next(val)
//     }
//     this.innerValue = val;
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }
// }