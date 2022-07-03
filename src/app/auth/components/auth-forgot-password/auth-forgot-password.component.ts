import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../@core/base/base-form-component';
import { faLongArrowAltRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faUser, faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../../@core/authentication/authentication.service';
import { Logger } from '../../../@core/logger.service';

const log = new Logger('Login');
@Component({
  selector: 'prx-auth-forgot-password',
  templateUrl: './auth-forgot-password.component.html',
  styleUrls: ['./auth-forgot-password.component.scss'],
})
export class AuthForgotPasswordComponent extends BaseFormComponent implements OnInit {
  longArrowAltRight = faLongArrowAltRight;
  faUser = faUser;
  faArrowAltCircleRight = faArrowAltCircleRight;
  check = faCheck;
  sendResetPassword: boolean
  warning: string


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
  ) {
    super();
    this.isLoading = false;
    this.createForm();
  }

  ngOnInit() {

  }
  /**
   * reset user password
   * @param form The form value: email
   */
  submit(form: FormGroup | FormGroup & { controls: { email: FormControl } }) {
    this.isLoading = true;
    this.warning = undefined
    let email = form?.getRawValue().email
    form.setErrors({ incorrect: true })
    if (!!email) {
      this.authenticationService.sendResetPasswordEmail(email).toPromise().then(res => {
        log.debug(`send reset email to ${email} successfully`);
         this.sendResetPassword = true
      }).catch((e) => {
        if(e?.error?.message != null){
          this.warning = e?.error?.message
        }else{
          this.warning = 'User Not Found, please try again'
        }
      }).finally(() => {
        form.setErrors(null)
        this.isLoading = false;
      })
    }
  }


  private createForm() {
    this.form = this.formBuilder.group({
      email: ['example@demo.com', [Validators.required, Validators.email]],
    });
  }
}