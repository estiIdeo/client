import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { faCheck, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { faUser, faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { finalize } from 'rxjs/operators';
import { TokenService } from '../../../@core/authentication/token.service';
import { BaseFormComponent } from '@app/@core/base/base-form-component';
import { RedirectService } from '@app/@shared/services/redirect.service';
import { AuthenticationService } from '@app/@core/authentication/authentication.service';
import { Logger } from '@app/@core/logger.service';

const log = new Logger('Login');

@Component({
  selector: 'prx-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent extends BaseFormComponent implements OnInit {
  longArrowAltRight = faLongArrowAltRight;
  faUser = faUser;
  faArrowAltCircleRight = faArrowAltCircleRight;
  check = faCheck;
  public warning: string;

  constructor(
    //private router: Router,
    private _redirect: RedirectService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService,
  ) {
    super();
    this.isLoading = false;
    this.createForm();
  }

  ngOnInit() {
    if (this.tokenService.isTokenActive()) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Logs-in the user
   * @param form The form value: user + password
   */
  login({ valid, value }: { valid: boolean; value: any }) {
    debugger
    if (valid) {
      this.isLoading = true;
      this.authenticationService.login(value).pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        })).subscribe(
          (credentials) => {
            log.debug(`${credentials.username} successfully logged in`);
            this.route.queryParams.subscribe((params) => this.redirect(params));
          },
          (error) => {
            if (error?.type == '2FA') {
              // this.initMultifa();
            } else {
              log.debug(`Login error: ${error}`);
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

  private createForm() {
    this.form = this.formBuilder.group({
      username: ['example@demo.com', Validators.required],
      password: ['123456', Validators.required],
      remember: false,
    });
  }

}
