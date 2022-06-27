import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormPagedComponent } from './@shared/components/form-paged/form-paged.component';
import { TagFormResolver } from './@shared/configuration/tag-form/tag-form.resolver';

const routes: Routes = [
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
