import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from './components/select/select.module';
import { MultiselectModule } from './components/multiselect/multiselect.module';
import { IdeoPipesModule } from './infrastructure/pipes/pipes.module';
import { ButtonModule } from './components/button/button.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { CalendarModule } from './components/calendar/calendar.module';
import { SearchInputModule } from './components/search-input/search-input.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [CommonModule, IdeoPipesModule,
  ],
  exports: [
    IdeoPipesModule,
    SelectModule,
    MultiselectModule,
    // TableModule,
    // PrintModule,
    ButtonModule,
    CheckboxModule,
    SearchInputModule,
    TranslateModule,
    CalendarModule,
  ],
  providers: [],
})
export class IdeoModule { }
