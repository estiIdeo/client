import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonComponent } from './button/button.component';
import { ButtonLanguageSelectorComponent } from './button-language-selector/button-language-selector.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const exports = [
  ButtonComponent,
  ButtonLanguageSelectorComponent
];

const exportsModule = [FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [...exports],
  imports: [CommonModule, BsDropdownModule,FontAwesomeModule, ...exportsModule],
  exports: [...exports, ...exportsModule],
})
export class FormControlsModule {}
