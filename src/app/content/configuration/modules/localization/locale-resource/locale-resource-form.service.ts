import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { LanguagesService } from '../language/languages.service';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { Validators } from '@angular/forms';
import { FormSelectComponent } from '../../../../../@forms/form-fields/form-select/form-select.component';
import { LazyLoadEvent } from '../../../../../@ideo/components/table/events/lazy-load.event';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocaleResourceFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(private languagesService: LanguagesService) {}
  private languages$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  generate(isEdit: boolean): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    this.languagesService
      .getAll({
        page: 1,
        pageSize: 200,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.name,
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
          label: 'Configuration.LocaleResources.Form.LocaleResourceName',
          placeholder: 'Configuration.LocaleResources.Form.LocaleResourceName',
          styleClass: 'col-4',
          validation: [Validators.required, Validators.maxLength(200)],
          errorMessages: {
            required: 'Configuration.LocaleResources.Form.LocaleResourceName',
            maxlength: {
              label: 'Forms.Validation.Errors.MaxLength',
              data: {
                entity: 'Configuration.LocaleResources.Form.LocaleResourceName',
                chars: 200,
              },
            },  

          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'value',
          type: 'text',
          label: 'Configuration.LocaleResources.Form.LocaleResourceValue',
          placeholder: 'Configuration.LocaleResources.Form.LocaleResourceValue',
          styleClass: 'col-4',
          validation: [Validators.required],
          errorMessages: {
            required: 'Configuration.LocaleResources.Form.LocaleResourceValue',
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'languageId',
          label: 'Configuration.LocaleResources.Form.LanguageName',
          placeholder: 'Configuration.LocaleResources.Form.LanguageName',
          styleClass: 'col-4',
          validation: [Validators.required],
          optionsArr$: this.languages$,
          errorMessages: {
            required: 'Configuration.LocaleResources.Form.LanguageName'
          },
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
