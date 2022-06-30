import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../@shared/shared.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { IdeoModule } from '../../@ideo/ideo.module';
import { TableModule } from '../../@ideo/components/table/table.module';

@NgModule({
  imports: [SharedModule, HomeRoutingModule, IdeoModule, TableModule],
  declarations: [WelcomeComponent],
  providers: [],
})
export class HomeModule { }
