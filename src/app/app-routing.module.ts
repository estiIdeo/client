import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagFormComponent } from './@shared/components/tag-form/tag-form.component';
import { TagFormResolver } from './@shared/configuration/tag-form/tag-form.resolver';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
   },
   {
    path:'add-tag',
    component:TagFormComponent,
    resolve:TagFormResolver
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
