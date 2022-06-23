import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field } from '../../@core/interfaces/field';
import { FieldConfig } from '../../@core/interfaces/field-config';
import { FormArray, FormGroup } from '@angular/forms';
import { ButtonItem } from '../../../@ideo/core/models/button-item';
import { FormCreditCardModel, CreditCardData, CCData, CCTypes } from './form-credit-card.model';
import { takeWhile, distinctUntilChanged, tap } from 'rxjs/operators';
import { faTrash, faExpand } from '@fortawesome/free-solid-svg-icons';
import { CustomerPaymentMethodsService } from '../../../content/users/components/users/payment-methods/payment-methods.service';
import { ModalsService } from '@app/@shared/services/confirm-modal.service';
import { untilDestroyed } from '../../../@core/until-destroyed';
import { PaymentMethodModel, PaymentMethodType } from '../../../@shared/models/customer-payment-method';
import { DatePipe } from '@angular/common';
import { CharEnum } from '../../../@shared/models/char-enum';
import { of } from 'rxjs';
import { ImageIdPipe } from '../../../@ideo/infrastructure/pipes/image-id.pipe';
import { asSelectItemPrefix } from '../../../prototypes';

type entityType = PaymentMethodModel
@Component({
  selector: 'prx-form-credit-card',
  templateUrl: './form-credit-card.component.html',
  styleUrls: ['./form-credit-card.component.scss']
})

/**
* Must include ${FormCreditCardModel} with customer id in the data
*/
export class FormCreditCardComponent extends BaseFieldDirective<FormArray> implements Field<FormCreditCardModel, entityType>, OnInit {
  public config: FieldConfig<FormCreditCardModel>;
  public group: FormGroup;
  public id: string;
  public paymentMethods: entityType[];
  public buttons: ButtonItem<entityType>[] = [
    {
      label: 'Portal.Common.Delete',
      icon: faTrash,
      hidden: () => this.disabled,
      click: (item) => {
        if (!!this.hasCustomer) { // user edit
          this.customerPaymentMethodsService.delete(this.data?.customerId, item.id,).toPromise().then(() => {
            this.setState()
          })
        } else { // create user
          this.paymentMethods = this.value?.filter(i => i !== item)
          this.setControlSate()

        }
      },
    },
    {
      label: 'Portal.Common.Fullscreen',
      icon: faExpand,
      hidden: (item) => !(item?.type === PaymentMethodType.CompanyEmployee && !!item?.employeeImageId),
      click: (item) => this.modalsService.fullScreen(item.employeeImageId, asSelectItemPrefix(PaymentMethodType, 'WSI.Core.Types.Enums.CustomerPaymentMethodType')?.find(i => PaymentMethodType.CompanyEmployee)?.label),
    }
  ];

  public getButtons = (item: entityType): ButtonItem<entityType>[] => this.buttons.filter(i => !(i.hidden && i?.hidden(item)))

  public get disabled(): boolean {
    return this.control.disabled
  }

  public get customerId(): number {
    return this.data?.customerId
  }

  public get hasCustomer(): boolean {
    return !!this.data?.customerId
  }

  public get data(): FormCreditCardModel {
    return this.config.data
  }
  public get value(): entityType[] {
    return this.control.value
  }

  public get isEmptyForm(): boolean {
    return !this.paymentMethods?.length
  }

  public get items(): entityType[] {
    return this.paymentMethods;
  }

  constructor(
    private cd: ChangeDetectorRef,
    private customerPaymentMethodsService: CustomerPaymentMethodsService,
    private modalsService: ModalsService,
    private datePipe: DatePipe,
    private imageIdPipe: ImageIdPipe
  ) {
    super();
  }

  setState() {
    if (this.hasCustomer) {
      this.customerPaymentMethodsService.getAll(this.data?.customerId)?.toPromise().then(res => {
        this.paymentMethods = res?.data
        this.setControlSate()
        this.cd?.markForCheck()
      })
      // } else {// create user
    }
  }

  // fixGetRawValue() {
  //   // class KeepThis extends FormGroup {
  //   //   constructor(obj: any) {
  //   //     super({}, null);
  //   //     const keys: string[] = Object.keys(obj);
  //   //     for (let i = 0; i < keys.length; i++) {
  //   //       const key = keys[i];
  //   //       this[key] = obj[key];
  //   //     }
  //   //   }
  //   //   public convertPaymentMethodModelToCardDetails(controlName: string): CreditDetails[] {
  //   //     return (this?.controls?.[controlName].value as entityType[])?.sort(function (a, b) { return (+a.isDefault) - (+b.isDefault) })?.reverse()?.map(i => ({
  //   //       creditCardExpiration: !!i.cardexpiration ? new Date(+(new Date().getFullYear()?.toString()?.slice(0, 2) + i.cardexpiration?.slice(2, 4)), +i.cardexpiration?.slice(0, 2), 1).toISOString() : null,
  //   //       creditCardHolder: i.name,
  //   //       creditCardNumber: i.cardNumber,
  //   //       // creditCardHolderIdentity: i?.creditCardHolderIdentity?.toString(),
  //   //       creditCardCvv: i.cardCVV
  //   //     }))
  //   //   }
  //   // }
  //   // const keepThis: KeepThis = new KeepThis(this.group);
  //   // const controlName = this.config.name;
  //   // this.group.getRawValue = () => ({
  //   //   ...keepThis.getRawValue(),
  //   //   [controlName]: (this.hasCustomer ? null : keepThis.convertPaymentMethodModelToCardDetails(controlName)),
  //   // });
  // }

  private handelChange = (val: any) => {
    if (!!this.ignoreNextChange) {
      this.ignoreNextChange = false
    } else {
      this.paymentMethods = val
    }
    if (!!this.config?.onChange) {
      !!this.config?.onChange && this.config?.onChange(val, this.control)
    }
  }

  ngOnInit(): void {
    // this.fixGetRawValue()
    this.setState()
    if (!!this.config?.disabled) {
      this.control.disable()
    }
    if (!!this.config.data?.buttons?.length) {
      this.buttons?.push(...this.config?.data?.buttons)
    }
    this.handelChange(this.control.value)
    this.control.valueChanges.pipe(takeWhile((r) => this.isActive), untilDestroyed(this), distinctUntilChanged()).subscribe(this.handelChange)
  }

  fixCardNumber(card: PaymentMethodModel) {
    switch (card?.type) {
      case (PaymentMethodType.Credit):
        return (card?.cardNumber || card?.cardMask)?.replace(/\*/g, CharEnum.dot).match(/.{1,4}/g).join(CharEnum.space + CharEnum.space + CharEnum.space)
      case (PaymentMethodType.Paypal):

      default:
        return card?.cardNumber || card?.cardMask
    }
  }


  fixCardExpiration(date: string) {
    if (date?.length === 4) {
      return (date?.slice(0, 2) || '**') + '/' + (date?.slice(2, 4) || '**')
    } else if (!!Date.parse(date)) {
      return this.datePipe.transform(date, 'M/YY')
    } else {
      return '**/**'
    }
  }

  public ignoreNextChange: boolean
  setControlSate(ignoreNextChange: boolean = true) {
    this.ignoreNextChange = ignoreNextChange
    this.control.setValue(this.paymentMethods)
  }

  addCredit(): void {
    this.modalsService.creditForm((values: PaymentMethodModel) => {
      values.isDefault = !!values?.isDefault
      values.isDeleted = false
      values.cardexpiration = this.datePipe.transform(values.cardexpiration?.replace('Z', ''), 'MMyy');
      if(values.type as number == 10){
        values.type =  PaymentMethodType.Credit;
        values.cardNumber = values.cardMask;
        values.byToken = true;
      }
      if (this.hasCustomer) { //  edit user
        return this.customerPaymentMethodsService.create(this.customerId, values)?.pipe(tap(() => this.setState()))
      } else { // create user
        this.paymentMethods = [... !!this.paymentMethods ? this.paymentMethods : [], values]?.removeDuplicate()
        this.setControlSate()
        this.cd.markForCheck()
        return of(true)
      }
    }, 'Portal.Share.ModalsService.Form.CreditCard.Title.Add', null, this.paymentMethods, this.config.data.addToken)
  }

  public image(item: entityType) {
    switch (item?.type) {
      case PaymentMethodType.Paypal:
        return CreditCardData.paypal?.image
      // case PaymentMethodType.CompanyEmployee:
      case PaymentMethodType.CompanyEmployee:
      case PaymentMethodType.Operational:
        if (!!item?.employeeImageId) {
          return this.imageIdPipe.transform(item.employeeImageId)
        }
      case PaymentMethodType.Credit:
        const creditType: CCTypes = !!item.brand ? Object.keys(CreditCardData).find(i => (CreditCardData[i] as CCData)?.brand === item?.brand) as CCTypes : Object.keys(CreditCardData).find(i => (CreditCardData[i] as CCData)?.pattern?.test(item?.cardNumber?.toString())) as CCTypes;
        if (!!creditType) return CreditCardData[creditType]?.image
      default:
        return CreditCardData?.unknown?.image
    }
  }

  public hasExpiration = (item: entityType) => item?.type === PaymentMethodType.Credit
}
