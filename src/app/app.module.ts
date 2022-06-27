import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthenticationService } from './@core/authentication/authentication.service';
import { SharedModule } from './@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormControlsModule } from './blocks/form-controls/form-controls.module';
import { AuthEffects } from './state/auth.effects';
import { reducers } from './state/auth.state';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormControlsModule,
    HttpClientModule,
    SharedModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot(reducers,{}),
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
