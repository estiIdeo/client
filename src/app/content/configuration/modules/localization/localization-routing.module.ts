import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormPagedComponent } from '@app/@shared/components/form-paged/form-paged.component';
import { TabledPageComponent } from '../../../../@shared/components/tabled-page/tabled-page.component';
import { LanguageComponentResolverService } from './language/language.resolver';
import { LocaleResourceComponentResolverService } from './locale-resource/locale-resource.resolver';
import { LanguageFormComponentResolverService } from '../localization/language/language-form.resolver';
import { LocaleResourceFormComponentResolverService } from '../localization/locale-resource/locale-resource-form.resolver';
//
const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'languages',
  // },
  {
    path: 'languages',
    component: TabledPageComponent,
    resolve: { config: LanguageComponentResolverService },
  },
  {
    path: 'locale-resources',
    component: TabledPageComponent,
    resolve: { config: LocaleResourceComponentResolverService },
  },
  {
    path: 'languages/:id',
    component: FormPagedComponent,
    resolve: { config: LanguageFormComponentResolverService },
  },
  {
    path: 'locale-resources/:id',
    component: FormPagedComponent,
    resolve: { config: LocaleResourceFormComponentResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalizationRoutingModule {}
