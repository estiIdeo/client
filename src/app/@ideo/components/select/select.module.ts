import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SelectComponent],
  imports: [CommonModule, TranslateModule, NgbDropdownModule, ScrollingModule],
  exports: [SelectComponent],
})
export class SelectModule {}
