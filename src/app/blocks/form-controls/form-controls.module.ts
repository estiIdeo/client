import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonComponent } from './button/button.component';

const exports = [
  ButtonComponent,
];

const exportsModule = [FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [...exports],
  imports: [CommonModule, BsDropdownModule, ...exportsModule],
  exports: [...exports, ...exportsModule],
})
export class FormControlsModule {}
