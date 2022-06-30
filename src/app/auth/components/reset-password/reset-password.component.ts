import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { faLongArrowAltRight, faUser, faArrowAltCircleRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs/operators';
import { AccountService } from '../../../@shared/services/account.service';
import { CredentialsService } from '../../../@core/authentication/credentials.service';
import { Logger } from '@app/@core/logger.service';
import { BaseFormComponent } from '@app/@core/base/base-form-component';
import { RedirectService } from '@app/@shared/services/redirect.service';
import { AuthenticationService } from '@app/@core/authentication/authentication.service';

const log = new Logger('ResetPassword');

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
    private _redirect: RedirectService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private accountService: AccountService,
  ) {
    super();
    this.isLoading = false;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((qParams) => {
      if (!!qParams['u']) {
        this.accountService
          .translateUserName(qParams['u'])
          .toPromise()
          .then((username) => this.createForm(username, qParams['u'], qParams['t']))
      }
    });
  }

  /**
   * Logs-in the user
   * @param form The form value: user + password
   */
  changePassword({ valid }: { valid: boolean; value: any }) {
    if (valid) {
      this.isLoading = true;
      const value = this.form.getRawValue();
      const otp = value.otp;
      delete value.otp;
      delete value.translatedUsername;
      this.authenticationService
        .changePassword(value, otp)
        .pipe(
          finalize(() => {
            this.form.markAsPristine();
            this.isLoading = false;
          })
        )
        .subscribe(
          (credentials) => {
            if (credentials?.type == '2FA') {
              this.form.controls['resetToken'].patchValue(credentials.token);
              this.initMultifa();
            } else {
              log.debug(`${credentials.username} successfully logged in`);
              this.authenticationService.changePasswordSuccesses(credentials)
              this.route.queryParams.subscribe((params) => this.redirect(params));
            }
          },
          (error) => {
            if (error?.type == '2FA') {
              this.initMultifa();
            } else {
              log.debug(`Login error: ${error}`);
              this.error =
                this.formState == 'otp'
                  ? 'Portal.Auth.Login.Form.Information.EnterOtp'
                  : 'Portal.Auth.Login.Form.Errors.IncorrectUserOrPassword';
            }
          }
        );
    }
  }

  public redirect(params: Params) {

    if (params.redirect) {
      this._redirect.to(params.redirect, { replaceUrl: true });
    } else {
      this._redirect.toHome();
    }
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
    this.form.get('otp').setValidators([Validators.required, Validators.minLength(6)]);
    this.warning = 'Auth.Login.Form.Warnings.MFA';
    this.error = '';
    this.formState = 'otp';
  }

  public endMultifa() {
    const otpControl = this.form.get('otp');
    otpControl.reset();
    otpControl.clearValidators();
    otpControl.updateValueAndValidity();
    this.error = '';
    this.warning = '';
    this.formState = '';
  }
}
