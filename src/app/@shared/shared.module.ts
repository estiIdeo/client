import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeoFormsModule } from '../@forms/ideo-forms.module';
import { TagFormComponent } from './components/tag-form/tag-form.component';



@NgModule({
  declarations: [
    TagFormComponent
  ],
  imports: [
    IdeoFormsModule,
    CommonModule
  ]
})
export class SharedModule { }
