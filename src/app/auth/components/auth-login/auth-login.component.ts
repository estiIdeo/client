import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { faCheck, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { faUser, faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { finalize } from 'rxjs/operators';
import { BaseFormComponent } from '@app/@core/base/base-form-component';
import { Store } from '@ngrx/store';
import { Login } from '@app/state/auth.actions';
import { Observable } from 'rxjs';
import { IAppState, selectAuthState } from '@app/state/auth.state';
import { User } from '@app/models/user';

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
  formState: string;
  public warning: string;
  user: User = new User();
  state: Observable<any>
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>
  ) {
    super();
    this.isLoading = false;
    this.state = this.store.select(selectAuthState);
    this.createForm();
  }

  ngOnInit() {
    // if (this.tokenService.isTokenActive()) {
    //   this.router.navigate(['/home']);
    // }
  }
  login({ valid, value }: { valid: boolean; value: any }) {
    console.log(value);
    this.user.username=value.username
    this.user.password=value.password
    this.store.dispatch(new Login(value));
  }
  private createForm() {
    this.form = this.formBuilder.group({
      username: ['example@demo.com', Validators.required],
      password: ['123456', Validators.required],
      remember: false,
      otp: [],
    });
  }
  public endMultifa() {
    const otpControl = this.form.get('otp')
    otpControl!.reset()
    otpControl!.clearValidators()
    otpControl!.updateValueAndValidity()
    this.error = '';
    this.warning = '';
    this.formState = '';
  }
}
