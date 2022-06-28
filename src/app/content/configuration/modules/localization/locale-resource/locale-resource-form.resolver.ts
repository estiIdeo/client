import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PageFormConfig } from '../../../../../@shared/models/edit-form.config';
import { LocaleResourcesService } from './locale-resources.service';
import { LocaleResourceModel } from '../../../../../@shared/models/locale-resource-model';
import { LocaleResourceFormService } from '../locale-resource/locale-resource-form.service';

@Injectable({
  providedIn: 'root',
})
export class LocaleResourceFormComponentResolverService implements Resolve<PageFormConfig> {
  constructor(
    private localeResourcesService: LocaleResourcesService,
    private localeResourceFormService: LocaleResourceFormService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageFormConfig {
    let isEdit = !!route.paramMap.get('id') && route.paramMap.get('id') != 'create';

    const titleEmitter: Subject<string> = new Subject<string>();
    const pageConfig = {
      title$: titleEmitter,
      breadcrumbs: [
        { label: 'Navigation.Configuration' },
        { label: 'Navigation.Localization' },
        { label: 'Navigation.LocaleResources', url: '../' },
        { label: 'Navigation.LocaleResource' },
      ],
      groupConfig: {
        controls: this.localeResourceFormService.generate(isEdit),
      },
      submit: (model: LocaleResourceModel) => {
        if (isEdit) {
          return this.localeResourcesService.update(model.id, model);
        } else {
          return this.localeResourcesService.create(model);
        }
      },
      getEntityById: (id) =>
        this.localeResourcesService.get(id).pipe(
          tap((x) => {
            if (!!isEdit) {
              titleEmitter.next(`Edit '${x.name}'`);
            }
            return x;
          })
        ),
    } as PageFormConfig;

    return pageConfig;
  }
}
