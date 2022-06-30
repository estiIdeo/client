import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonComponent } from './button/button.component';
import { CheckboxComponent } from './checkbox/checkbox/checkbox.component';
import { ButtonLanguageSelectorComponent } from './button-language-selector/button-language-selector/button-language-selector.component';

const exports = [
  ButtonComponent,
];

const exportsModule = [FormsModule, ReactiveFormsModule,CheckboxComponent,ButtonComponent,ButtonLanguageSelectorComponent];

@NgModule({
  declarations: [...exports, CheckboxComponent, ButtonLanguageSelectorComponent],
  imports: [CommonModule, BsDropdownModule, ...exportsModule],
  exports: [...exports, ...exportsModule],
})
export class FormControlsModule {}
