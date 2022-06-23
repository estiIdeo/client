import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiselectComponent } from './multiselect.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IdeoPipesModule } from '../../infrastructure/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentModule } from '../../../@shared/components/dynamic-component/dynamic-component.module';

@NgModule({
  declarations: [MultiselectComponent],
  imports: [CommonModule, NgbDropdownModule, ScrollingModule, IdeoPipesModule, TranslateModule, DynamicComponentModule],
  exports: [MultiselectComponent],
})
export class MultiselectModule { }
