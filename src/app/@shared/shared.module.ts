import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BootstrapModule } from '@app/bootstrap/bootstrap.module';
import { IconsModule } from '@app/blocks/icons/icons.module';
import { FormControlsModule } from '@app/blocks/form-controls/form-controls.module';
import { IdeoKeyFilterModule } from './directives/keyfilter.directive';
import { ButtonModule } from '@app/@ideo/components/button/button.module';
import { IdeoFormsModule } from '@app/@forms/ideo-forms.module';
import { IdeoPipesModule } from '@app/@ideo/infrastructure/pipes/pipes.module';
import { SelectModule } from '@app/@ideo/components/select/select.module';
import { TableModule } from '@app/@ideo/components/table/table.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormPagedComponent } from './components/form-paged/form-paged.component';
import { VarDirective } from './directives/var.directive';
const exportModules = [
  CommonModule,
  HttpClientModule,
  RouterModule,
  TranslateModule,
  BootstrapModule,
  IconsModule,
  FormControlsModule,
  IdeoKeyFilterModule,
];

@NgModule({
  providers: [CurrencyPipe],
  declarations: [
    FormPagedComponent,
    VarDirective,
    /*  UnsanitizePipe,
    GroupByPipe,
    TabledPageComponent,
    DeleteModalComponent,
    WizardPageComponent,
    ImportComponent,
    FullScreenModalComponent,
    WsiCardComponent,
    SideBarPageComponent,
    EntityDetailsComponent,
    KeyValuePairComponent,
    DocsComponent,
    WsiModalComponent,
    ModalPageComponent,
    ModalAssignPageComponent,
    TabsPageComponent,
    SidebarHostDirective,
    FleetSelectorComponent,
    EditOrCreateModalComponent,
    NotesComponent,
    PickerComponent,
    TagsComponent,
    WsiImagePopoverComponent,
    WsiMoreButtonsComponent,
    MapModalComponent,
    FormModalComponent,*/
    // SearchInputComponent,
  ],
  imports: [
    ...exportModules,
    //  UtilsModule,
    //  NgbPopoverModule,
    // NavigationsModule,
    IdeoFormsModule,
    TableModule,
    TranslateModule,
    //  LoaderModule,
    ButtonModule,
    IdeoPipesModule,
    // NgbDropdownModule,
    //  NgbTooltipModule,
    //  NgxDropzoneModule,
    // ScrollingModule,
    SelectModule,
    //  IdeoDirectivesModule,
    //  AgmCoreModule,
    // NgbPaginationModule
  ],
  exports: [...exportModules, VarDirective],
})
export class SharedModule {}
