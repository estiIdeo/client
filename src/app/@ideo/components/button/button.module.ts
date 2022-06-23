import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { IdeoPipesModule } from '../../infrastructure/pipes/pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { IconsModule } from '../../../blocks/icons/icons.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule, NgbTooltipModule, RouterModule,TranslateModule, IdeoPipesModule,IconsModule],
  exports: [ButtonComponent],
})
export class ButtonModule { }
