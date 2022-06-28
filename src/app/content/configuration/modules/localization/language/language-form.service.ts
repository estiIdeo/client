import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { Validators } from '@angular/forms';
import { FormSelectComponent } from '../../../../../@forms/form-fields/form-select/form-select.component';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { FormSwitchComponent } from '../../../../../@forms/form-fields/form-switch/form-switch.component';
import { LanguagesService } from './languages.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { FormDateComponent } from '@app/@forms/form-fields';

@Injectable({
  providedIn: 'root',
})
export class LanguageFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(private languagesService: LanguagesService) {}
  private languages$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  generate(isEdit: boolean): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    this.languagesService
      .getCultures()
      .pipe(
        map((r) =>
          r.map((a) => {
            return {
              value: a,
              label: a,
            } as SelectItem;
          })
        )
      )
      .subscribe((res) => this.languages$.next(res));

    form.push(
      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          label: 'Configuration.Languages.Form.Name',
          placeholder: 'Configuration.Languages.Form.Name',
          styleClass: 'col-12 col-md-6',
          validation: [Validators.required, Validators.maxLength(100)],
          errorMessages: {
            required: 'Configuration.Languages.Form.Name',
            maxlength: {
              label: 'Validation.Errors.MaxLength',
              data: {
                entity: 'Configuration.Languages.Form.Name',
                chars: 1024,
              },
            },  
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'languageCulture',
          label: 'Configuration.Languages.Form.LanguageCulture',
          placeholder: 'Configuration.Languages.Form.LanguageCulture',
          styleClass: 'col-12 col-md-6',
          validation: [Validators.required],
          optionsArr$: this.languages$,
          errorMessages: {
            required: 'Configuration.Languages.Form.LanguageCulture',
          },
        },
      },
      {
        type: FormSwitchComponent,
        config: {
          name: 'rtl',
          type: 'text',
          label: 'Configuration.Languages.Form.Rtl',
          styleClass: 'col-12 col-md-6 col-lg-3 col-xl-2',
          errorMessages: {
            required: 'Configuration.Languages.Form.Rtl',
          },
        },
      },
      {
        type: FormSwitchComponent,
        config: {
          name: 'active',
          type: 'text',
          label: 'Configuration.Languages.Form.Active',
          styleClass: 'col-12 col-md-6 col-lg-3 col-xl-2',
          errorMessages: {
            required: 'Configuration.Languages.Form.Active',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'displayOrder',
          type: 'hidden',
        },
      },
      {
        type: FormDateComponent,
        config: {
          name: 'created',
          type: 'hidden',
        },
      },
      {
        type: FormDateComponent,
        config: {
          name: 'updated',
          type: 'hidden',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
        },
      }
    );

    return form;
  }
}
