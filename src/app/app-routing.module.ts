import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormPagedComponent } from './@shared/components/form-paged/form-paged.component';
import { TagFormResolver } from './@shared/configuration/tag-form/tag-form.resolver';
import { extract } from './i18n';
import { Shell } from './shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'home',
      loadChildren: () => import('./content/home/home.module').then((m) => m.HomeModule),
      data: { title: extract('Home') },
    }/*,
    {
      path: 'configuration',
      loadChildren: () => import('./content/configuration/configuration.module').then((m) => m.ConfigurationModule),
      data: { title: extract('Configuration') },
    },
    {
      path: 'users',
      loadChildren: () => import('./content/users/users.module').then((m) => m.UsersModule),
      data: { title: extract('Users') },
    },*/
  ]), 
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'add-tag',
    component: FormPagedComponent,
    resolve: { config: TagFormResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
