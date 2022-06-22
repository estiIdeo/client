import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { faLongArrowAltRight, faUser, faArrowAltCircleRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs/operators';
import { BaseFormComponent } from 'src/app/@core/base/base-form-component';



@Component({
  selector: 'prx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent extends BaseFormComponent implements OnInit {
  longArrowAltRight = faLongArrowAltRight;
  faUser = faUser;
  faArrowAltCircleRight = faArrowAltCircleRight;
  check = faCheck;
  formState: string;
  public warning: string;

  public username: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    super();
    this.isLoading = false;
  }

  ngOnInit() {
    // this.route.queryParams.subscribe((qParams) => {
    //   if (!!qParams['u']) {
    //     this.accountService
    //       .translateUserName(qParams['u'])
    //       .toPromise()
    //       .then((username) => this.createForm(username, qParams['u'], qParams['t']))
    //   }
    // });
  }

  /**
   * Logs-in the user
   * @param form The form value: user + password
   */
  changePassword({ valid }: { valid: boolean; value: any }) {
  }

  public redirect(params: Params) {
  }

  private createForm(username: string, hashedUsername: string, resetToken: string) {
    this.form = this.formBuilder.group({
      translatedUsername: [{ value: username, disabled: true }, Validators.required],
      username: [{ value: hashedUsername, disabled: true }, Validators.required],
      password: [null, Validators.required],
      resetToken: [resetToken, Validators.required],
      otp: [null],
    });
  }
  private initMultifa() {
    this.form.get('otp')!.setValidators([Validators.required, Validators.minLength(6)]);
    this.warning = 'Portal.Auth.Login.Form.Warnings.MFA';
    this.error = '';
    this.formState = 'otp';
  }

  public endMultifa() {
    const otpControl = this.form.get('otp');
    otpControl!.reset();
    otpControl!.clearValidators();
    otpControl!.updateValueAndValidity();
    this.error = '';
    this.warning = '';
    this.formState = '';
  }
}
