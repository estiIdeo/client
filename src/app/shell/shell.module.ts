import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@app/layout/layout.module';

import { ShellComponent } from './components/shell/shell.component';
import { NotificationsModule } from '../@ideo/components/notifications/notifications.module';

@NgModule({
  imports: [CommonModule, LayoutModule, NotificationsModule],
  declarations: [ShellComponent],
})
export class ShellModule {}
