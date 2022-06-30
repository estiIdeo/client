import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PageFormConfig } from '../../../../../@shared/models/edit-form.config';
import { LanguagesService } from './languages.service';
import { LanguageModel } from '../../../../../@shared/models/language-model';
import { LanguageFormService } from './language-form.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageFormComponentResolverService implements Resolve<PageFormConfig> {
  constructor(private languagesService: LanguagesService, private languageFormService: LanguageFormService, private translate: TranslateService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageFormConfig {
    let isEdit = !!route.paramMap.get('id') && route.paramMap.get('id') != 'create';

    const titleEmitter: Subject<string> = new Subject<string>();
    const pageConfig = {
      title$: titleEmitter,
      breadcrumbs: [
        { label: 'Navigation.Language' },
      ],
      groupConfig: {
        controls: this.languageFormService.generate(isEdit),
      },
      submit: (model: LanguageModel) => {
        if (isEdit) {
          return this.languagesService.update(model.id, model);
        } else {
          return this.languagesService.create(model);
        }
      },
      getEntityById: (id) =>
        this.languagesService.get(id).pipe(
          tap((x) => {
            if (!!isEdit) {
              titleEmitter.next(this.translate.instant('Share.Modal.Mode.Edit.Entity', {entityName: x.name}));
            }
            return x;
          })
        ),
    } as PageFormConfig;

    return pageConfig;
  }
}
