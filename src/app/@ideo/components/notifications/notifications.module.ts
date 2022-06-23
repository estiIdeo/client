import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { TranslateModule } from '@ngx-translate/core';
import { IdeoPipesModule } from '../../infrastructure/pipes/pipes.module';

@NgModule({
  declarations: [NotificationsComponent],
  exports: [NotificationsComponent],
  imports: [CommonModule, TranslateModule, IdeoPipesModule],
})
export class NotificationsModule {}
