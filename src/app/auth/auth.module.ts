import { NgModule } from '@angular/core';
import { FormControlsModule } from '../blocks/form-controls/form-controls.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CommonModule } from '@angular/common'; 

@NgModule({
  declarations: [AuthRoutingModule.declarations, ResetPasswordComponent],
  imports: [ AuthRoutingModule,FormControlsModule,CommonModule
  ],
})
export class AuthModule { }
