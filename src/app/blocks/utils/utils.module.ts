import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { IconsModule } from '../icons/icons.module';
import { CardsModule } from '../cards/cards.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PageOverlayComponent } from './components/page-overlay/page-overlay.component';
import { VerticalTogglerComponent } from './components/vertical-toggler/vertical-toggler.component';
import { FadeContentComponent } from './components/fade-content/fade-content.component';
import { OpenParentDirective } from './directives/open-parent.directive';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationsModule } from '../navigations/navigations.module';

const exports = [
  PageHeaderComponent,
  PageOverlayComponent,
  VerticalTogglerComponent,
  FadeContentComponent,
  OpenParentDirective,
];

@NgModule({
  declarations: [...exports],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule,
    PerfectScrollbarModule,
    IconsModule,
    TranslateModule,
    CardsModule,
    NavigationsModule,
  ],
  exports,
})
export class UtilsModule { }
