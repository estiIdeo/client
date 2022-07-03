import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthenticationService } from './@core/authentication/authentication.service';
import { SharedModule } from './@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormControlsModule } from './blocks/form-controls/form-controls.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApplicationConfigurationService } from './@core/services/application-configuration.service';
import { ShellModule } from './shell/shell.module';
import { TranslateStore } from '@ngx-translate/core';
import { getBsModulesForRoot } from './bootstrap/bootstrap.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const initializeApp = (_config: ApplicationConfigurationService) => {
  return () => _config.initialize();
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormControlsModule,
    HttpClientModule,
    SharedModule,
    ShellModule,
    TranslateModule.forRoot(),
    ...getBsModulesForRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ApplicationConfigurationService],
      multi: true,
    },
    AuthenticationService,
    TranslateStore,
    TranslateService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
