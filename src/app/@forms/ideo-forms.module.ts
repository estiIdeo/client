import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormGroupComponent } from './@core/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormControlComponent } from './@core/components/dynamic-form-control/dynamic-form-control.component';
import { ValidationMessagesComponent } from './@core/components/validation-messages/validation-messages.component';
import { DynamicFieldDirective } from './@core/directives/dynamic-field.directive';
import { HasErrorPipe } from './@core/pipes/has-error.pipe';
import { NotHiddenPipe } from './@core/pipes/not-hidden.pipe';
import { IsArrayControlPipe } from './@core/pipes/is-array-control.pipe';
//import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '../@ideo/components/button/button.module';
import { SelectModule } from '../@ideo/components/select/select.module';
import { CheckboxModule } from '../@ideo/components/checkbox/checkbox.module';
import { MultiselectModule } from '../@ideo/components/multiselect/multiselect.module';
import { CalendarModule } from '../@ideo/components/calendar/calendar.module';
import { AutocompleteModule } from '../@ideo/components/autocomplete/autocomplete.module';
import {
  FormTextComponent,
  FormArrayComponent,
  FormButtonComponent,
  FormCheckboxComponent,
  FormDateComponent,
  FormEditorComponent,
  FormGroupComponent,
  FormMultiselectComponent,
  FormNgbCheckboxButtonComponent,
  FormNgbRadioButtonsComponent,
  FormRadioComponent,
  FormSelectComponent,
  FormSubTextComponent,
  FormSwitchComponent,
  FormSwitcherComponent,
  FormTableComponent,
} from './form-fields/index';
import { DynamicSteppedFormComponent } from './@core/components/dynamic-stepped-form/dynamic-stepped-form.component';
import { FormStepperComponent } from './@core/components/form-stepper/form-stepper.component';
//import { CdkStepperModule } from '@angular/cdk/stepper';
import { FormFileComponent } from './form-fields/form-file/form-file.component';
//import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { IdeoPipesModule } from '../@ideo/infrastructure/pipes/pipes.module';
//import { IdeoKeyFilterModule } from '@app/@shared/directives/keyfilter.directive';
import { FormInilneArrayComponent } from './form-fields/form-inilne-array/form-inilne-array.component';
import { TranslateModule } from '@ngx-translate/core';
//import { AgmCoreModule } from '@agm/core';
import { FormSkuComponent } from './form-fields/form-sku/form-sku.component';
//import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormCreditCardComponent } from './form-fields/form-credit-card/form-credit-card.component';
import { FormPriceComponent } from './form-fields/form-price/form-price.component';
import { CurrencyFormatterDirective } from './@core/directives/currency-field.directive';
//import { IconsModule } from '../blocks/icons/icons.module';
import { FormAutoCompleteComponent } from './form-fields/form-auto-complete/form-auto-complete.component';
//import { IdeoDirectivesModule } from '../@shared/directives/ideo-directives.module';
import { FormAddressComponent } from './form-fields/form-address/form-address.component';
import { FormMapAddressComponent } from './form-fields/form-map-address/form-map-address.component';

const EXPORTED = [
  ValidationMessagesComponent,
  DynamicFormGroupComponent,
  DynamicFormControlComponent,
  DynamicSteppedFormComponent];
const PIPES = [
  HasErrorPipe,
  NotHiddenPipe,
  IsArrayControlPipe];
const DIRECTIVES = [
  DynamicFieldDirective,
  // ControlValueAccessorDirective,
  CurrencyFormatterDirective,
];
const COMPONENTS = [
  ValidationMessagesComponent
];
const FIELDS = [
  FormInilneArrayComponent,
  FormTextComponent,
  FormArrayComponent,
  FormButtonComponent,
  FormCheckboxComponent,
  FormDateComponent,
  FormEditorComponent,
  FormFileComponent,
  FormGroupComponent,
  FormMultiselectComponent,
  FormNgbCheckboxButtonComponent,
  FormNgbRadioButtonsComponent,
  FormRadioComponent,
  FormSelectComponent,
  FormSubTextComponent,
  FormSwitchComponent,
  FormSkuComponent,
  FormSwitcherComponent,
  FormTableComponent,
  FormStepperComponent,
  FormCreditCardComponent,
  FormPriceComponent,
  FormAddressComponent,
  FormAutoCompleteComponent,
];

@NgModule({
  declarations: [
    ...PIPES,
    ...DIRECTIVES,
    ...COMPONENTS,
    ...EXPORTED,
    ...FIELDS,
    FormMapAddressComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    CalendarModule,
    TranslateModule
  ],
  exports: [...EXPORTED, ...FIELDS],
})
export class IdeoFormsModule { }
