import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NavigationsModule } from '../navigations/navigations.module';
import { CardComponent } from './card/card.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardBodyComponent } from './card-body/card-body.component';
import { CardFooterComponent } from './card-footer/card-footer.component';

const exports = [
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  CardFooterComponent,
];

@NgModule({
  declarations: [...exports],
  imports: [CommonModule, CollapseModule, NavigationsModule],
  exports: exports,
})
export class CardsModule {}
