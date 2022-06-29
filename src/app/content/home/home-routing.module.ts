import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '../../i18n/i18n.service';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [{ path: '', component: WelcomeComponent, data: { title: extract('Home') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule { }
