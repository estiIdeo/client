import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../../blocks/icons/icons.module';

@NgModule({
  declarations: [AutocompleteComponent],
  imports: [CommonModule, NgbTypeaheadModule, FormsModule, IconsModule],
  exports: [AutocompleteComponent],
})
export class AutocompleteModule { }
