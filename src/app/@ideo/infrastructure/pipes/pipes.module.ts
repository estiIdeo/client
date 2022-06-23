import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
//import { PermitPipe } from './has-permit.pipe';
import { IdeoDatePipe } from './ideo-date.pipe';
import { SubStrPipe } from './sub-str.pipe';
import { FilterPipe, FormArrayControlsFilterPipe } from './filter.pipe';
import { LogPipe } from './log.pipe';
import { ColorHashPipe } from './color-hash.pipe';
import { AcronymPipe } from './acronym.pipe';
import { IconPipe } from './icon.pipe';
import { SafeHtml } from './save-html.pipe';
import { cachePipe } from './cache.pipe';
import { EnumPipe } from './enum.pipe';
import { TranslateParamsPipe, TranslateWithParamsPipe } from './translate-params.pipe';
import { ImageIdPipe } from './image-id.pipe';

const PIPES = [
  // PermitPipe,
  IdeoDatePipe,
  SubStrPipe,
  FilterPipe,
  FormArrayControlsFilterPipe,
  ImageIdPipe,
  LogPipe,
  EnumPipe,
  SafeHtml,
  ColorHashPipe,
  cachePipe,
  AcronymPipe,
  IconPipe,
  TranslateParamsPipe,
  TranslateWithParamsPipe
];

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
  imports: [CommonModule],
  providers: [...PIPES, DatePipe, CurrencyPipe],
})
export class IdeoPipesModule { }
