import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
// import { take } from 'rxjs/operators';
// import { DeleteModalComponent } from '../../@shared/components/delete-modal/delete-modal.component';
import { FullScreenModalComponent } from '../components/full-screen-modal/full-screen-modal.component';
// import { EditOrCreateModalComponent } from '../components/edit-or-create-modal/edit-or-create-modal.component';
// import { DynamicFormControl } from '../../@forms/@core/interfaces/dynamic-form-control';
// import { FormTextComponent } from '../../@forms/form-fields/form-text/form-text.component';
// import { CreditDetails } from '../models/customer.model';
// import { Validators } from '@angular/forms';
// import { FormSwitchComponent } from '../../@forms/form-fields/form-switch/form-switch.component';
// import { IdeoValidators } from '../../@forms/@core/validators/ideo.validators';
// import { FormDateComponent } from '../../@forms/form-fields/form-date/form-date.component';
// import { ModalMessage } from '../../@core/models/modal-message';
// import { FormTextData } from '@app/@forms/form-fields';
// import { PaymentMethodModel } from '../models/customer-payment-method';
// import { translateType } from '../types/translate.type';
// import { IntelligenceKeys } from '../types/IntelligenceKeys.type';
// import { MarkerOptionsType, LatLngType } from './map.service';
// import { MapModalComponent } from '../components/map-modal/map-modal.component';
// import { SelectItem } from '../../@ideo/components/table/models/select-item';
// import { PaymentMethodFormService } from '../../content/users/components/users/payment-methods/payment-method-form.service';

type modalType<T = any> = BsModalRef & { content: T }

@Injectable({
  providedIn: 'root'
})
export class ModalsService {

  constructor(private modalService: BsModalService) { }//, private paymentMethodFormService: PaymentMethodFormService

  // confirm(message: IntelligenceKeys<translateType>, title?: IntelligenceKeys<translateType>, messageParams?: { [k: string]: IntelligenceKeys<translateType> }, cancelText: translateType = "Portal.Share.Modal.DeleteOrConfirm.Button.Close",
  //   confirmText: translateType = "Portal.Share.Modal.DeleteOrConfirm.Button.Confirm"): Observable<boolean> {
  //   return (<DeleteModalComponent>this.modalService.show(DeleteModalComponent, {
  //     initialState: { message, title, messageParams, confirmText, cancelText },
  //     class: 'modal-md modal-dialog-centered',
  //   })?.content).onClose?.pipe(take(1))
  // }

  // /**
  // * return true in the submit to close the modal 
  // */
  // formModal(title: IntelligenceKeys<translateType>, formControls: DynamicFormControl[], submit: (values: any) => Observable<any>, classStyle: ModalMessage['modalSize'] = 'modal-xl', reject?:  (values: any) => Observable<any>, 
  // cancelText: translateType = "Portal.Share.Modal.DeleteOrConfirm.Button.Close",
  //   confirmText: translateType = "Portal.Share.Modal.DeleteOrConfirm.Button.Confirm"): modalType<EditOrCreateModalComponent> {
  //   return this.modalService.show(EditOrCreateModalComponent, {
  //     initialState: {
  //       title,
  //       formControls,
  //       submit,
  //       reject,
  //       cancelText,
  //       confirmText
  //     },
  //     class: 'modal-dialog-centered ' + classStyle,
  //   }) as modalType<EditOrCreateModalComponent>
  // }

  fullScreen(imageId: number, title: string): void {
    this.modalService.show(FullScreenModalComponent, {
      initialState: { mediaItem: { mediaId: imageId }, title: title },
      class: 'modal-xl modal-dialog-centered',
    })
  }

  // map(data: MarkerOptionsType & { icon?: SelectItem['icon'], positions?: LatLngType[], }): void {
  //   this.modalService.show(MapModalComponent, {
  //     initialState: data,
  //     class: 'modal-xl modal-dialog-centered',
  //   })
  // }

  // public creditForm(
  //   submit: (values: PaymentMethodModel) => Observable<any>,
  //   title: IntelligenceKeys<translateType> = 'Portal.Share.ModalsService.Form.CreditCard.Title.Add',
  //   creditCard?: PaymentMethodModel,
  //   creditCards?: PaymentMethodModel[],
  //   addToken?: boolean
  // ): BsModalRef & { content: EditOrCreateModalComponent } {
  //   const formControls: DynamicFormControl<PaymentMethodModel>[] = this.paymentMethodFormService.generate(creditCard, creditCards || [], addToken)
  //   return this.formModal(title, formControls, submit, 'modal-lg')
  // }
}