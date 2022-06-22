import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../@core/base/base-form-component';
import { faLongArrowAltRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faUser, faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
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
  }


  private createForm() {
    this.form = this.formBuilder.group({
      email: ['example@demo.com', [Validators.required, Validators.email]],
    });
  }
}