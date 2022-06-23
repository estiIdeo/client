import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { FormControl, FormGroup } from '@angular/forms';
import { Field } from '../../@core/interfaces/field';
import { FormPriceDataModel } from './from-price-data.model';
import { FieldConfig } from '../../@core/interfaces/field-config';
import { VatService } from '../../../@shared/services/vat.service';
import { takeWhile, debounceTime, take, tap } from 'rxjs/operators';
import { untilDestroyed } from '../../../@core/until-destroyed';
import { Subject } from 'rxjs';

@Component({
  selector: 'prx-form-price',
  templateUrl: './form-price.component.html',
  styleUrls: ['./form-price.component.scss'],
})

export class FormPriceComponent extends BaseFieldDirective<FormControl> implements Field<FormPriceDataModel>, OnInit, OnDestroy {
  public config: FieldConfig<FormPriceDataModel>;
  public group: FormGroup;
  public id: string;
  public form: FormGroup;
  public vat: number;

  public get vatControl() {
    return this?.form?.controls?.[this.vatControlName];
  }
  ngOnDestroy(): void { this.isActive = false }

  public get priceControl() {
    return this?.form?.controls?.[this.priceControlName];
  }

  public get data() {
    return this.config?.data
  }

  public vatControlName: string = 'vatControl';
  public priceControlName: string = 'priceControl';
  public keyCodeHistory: number[] = []

  constructor(private vatService: VatService, private cd: ChangeDetectorRef) {
    super();
    this.input = new Subject<{ evtVal: number, isVatControl: boolean }>()
    // this.o.pipe(takeWhile(x => this.isActive), untilDestroyed(this), tap(x => this.keyCodeHistory?.unshift(x?.keyCode)), debounceTime(100)).subscribe((val: { evtVal: number, isVatControl: boolean, keyCode: number }) => {
    //   const { evtVal, isVatControl, keyCode } = val
    //   this.keyCodeHistory = this.keyCodeHistory?.slice(0, 2)
    //   if (!!FormPriceComponent.keyCodeRange.includes(keyCode) || (FormPriceComponent.ctrlKeyCodeArr?.includes(this.keyCodeHistory?.[1]) /* ctrl */ && FormPriceComponent.pasteCutKeyCodeArr?.includes(keyCode))) {
    //     if (isVatControl) {
    //       this.control?.setValue(this.fixNumber(evtVal) * (1 / this.vat) || '0');
    //       this.priceControl?.setValue(
    //         (this.fixNumber(evtVal) * (1 / this.vat))?.toFixed(2) || '0'
    //       );
    //     } else {
    //       this.control?.setValue(this.fixNumber(evtVal) || '0');
    //       this.vatControl?.setValue((this.fixNumber(evtVal) * this.vat)?.toFixed(2) || '0');
    //     }
    //     !this.control.touched && this.control.markAsTouched();
    //     !this.control.dirty && this.control.markAsDirty();
    //     this.ignoreOnChange = true
    //     this.cd.markForCheck()
    //   }
    // })

    this.input?.pipe(takeWhile(x => this.isActive), untilDestroyed(this), debounceTime(200)).subscribe((val: { evtVal: number, isVatControl: boolean }) => {
      const { evtVal, isVatControl } = val
      if (isVatControl) {
        this.control?.setValue(FormPriceComponent.fixNumber(evtVal) * (1 / this.vat) || '0');
        this.priceControl?.setValue(
          (FormPriceComponent.fixNumber(evtVal) * (1 / this.vat))?.toFixed(4) || '0'
        );
      } else {
        this.control?.setValue(FormPriceComponent.fixNumber(evtVal) || '0');
        this.vatControl?.setValue((FormPriceComponent.fixNumber(evtVal) * this.vat)?.toFixed(2) || '0');
      }
      !this.control.touched && this.control.markAsTouched();
      !this.control.dirty && this.control.markAsDirty();
      this.ignoreOnChange = true
      this.cd.markForCheck()
    })
  }

  public ignoreOnChange: boolean

  // public static keyCodeRange: number[] = [...range(48, 57), 46 /* dot */, 127 /* delete */, 8 /* backspace */,];
  // public static pasteCutKeyCodeArr: number[] = [118, 86/* v */, 120, 88/* x */] /* pase or cut */
  // public static ctrlKeyCodeArr: number[] = [...navigator.platform?.includes('Mac') ? range(91, 93) : range(17, 20)]
  // public o: Subject<{ evtVal: number, isVatControl: boolean, keyCode: number }> = new Subject<{ evtVal: number, isVatControl: boolean, keyCode: number }>()
  public input: Subject<{ evtVal: number, isVatControl: boolean }>



  // public keyUp(evtVal: number, isVatControl: boolean, keyCode: number) {
  //   // this.o.next({ evtVal, isVatControl, keyCode })
  // }

  onInput(evtVal: number, isVatControl: boolean) {
    this.input.next({ evtVal, isVatControl })
  }

  setVatControl() {
    let vatVal = FormPriceComponent.round(FormPriceComponent.fixNumber(this.control?.value) * this.vat || 0)?.toFixed(4);
    vatVal = vatVal?.substr(0, vatVal?.indexOf('.') + 2);
    this.form = new FormGroup({
      [this.vatControlName]: new FormControl(vatVal),
      [this.priceControlName]: new FormControl(FormPriceComponent.fixNumber(this.control?.value)?.toFixed(4)),
    });
    if (this.config?.disabled || !!this.control?.disabled) {
      this.form?.controls?.[this.vatControlName].disable();
      this.form?.controls?.[this.priceControlName].disable();
    }
    this.control?.registerOnDisabledChange((isDisabled) => {
      if (isDisabled) {
        this.form?.controls?.[this.vatControlName].disable();
        this.form?.controls?.[this.priceControlName].disable();
      } else {
        this.form?.controls?.[this.vatControlName].enable();
        this.form?.controls?.[this.priceControlName].enable();
      }
    })
  }

  handleVarReceive = (vat: number) => {
    // console.log(vat)
    if (!!vat) {
      this.vat = vat
      this.setVatControl()
      this.cd.markForCheck()
      this.control.valueChanges.pipe(takeWhile(x => this.isActive), untilDestroyed(this), debounceTime(200)).subscribe((val) => { // need to listen to control change to trigger onChange Func
        if (this.config.onChange) {
          this.config.onChange(parseFloat(val?.toString()?.replace(/[^0-9.]/g, '')), this.control);
        }
        if (!!this.ignoreOnChange) { // level to prevent unnecessary trigger
          this.ignoreOnChange = false
        }
        else if (FormPriceComponent.fixNumber(val) !== FormPriceComponent.fixNumber(this.priceControl?.value)) { //  break loop if any
          this.priceControl?.setValue(val || 0)
          this.vatControl?.setValue(val * this.vat || 0)
        }
      })
    }
  }


  ngOnInit(): void {
    this.vatService?.getVatIncludes?.pipe(take(1), tap(x => !x && this.vatService?.getVatIncludes?.toPromise().then(this.handleVarReceive))).toPromise().then(this.handleVarReceive);
  }

  private static round(value: number | string) {
    return Math.fround(parseFloat(value?.toString()))
  }

  private static fixNumber(val: string | number, vat?: number): number {
    return parseFloat(val?.toString()?.replace(/[^0-9.]/g, ''))
  }
}
