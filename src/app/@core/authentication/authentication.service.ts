import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CredentialsService } from './credentials.service';
import { LoginContext, RegisterContext, AuthorizationEntity } from './authentication.models';

import { AuthenticationResponseModel } from '@app/@shared/models/authentication.response';
import { CacheKeys } from '../../@ideo/infrastructure/services/storage-keys.service';
import { Router } from '@angular/router';
import { CacheService } from '../../@shared/services/cache.service';
import { NavigationService } from '../../layout/services/navigation.service';
import { TokenService } from './token.service';
import { tap } from 'rxjs/operators';
import { AccountService } from '@app/@shared/services/account.service';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loggedIn: boolean;

  get isAuthenticated() {
    return this.loggedIn;
  }

  constructor(
    private credentialsService: CredentialsService,
    private accountService: AccountService,
    private tokenService: TokenService,
    private _injector: Injector,
    private navigationService: NavigationService
  ) { }


  cleanBetweenAuthenticate() {
    const _cache = this._injector.get(CacheService);
    const _navigationService = this._injector.get(NavigationService);
    _navigationService.cleanNavigationItems()
    _cache.clear()
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<AuthenticationResponseModel> {
    this.loggedIn = true;

    // Replace by proper authentication call
    const request = {
      username: context.username,
      password: context.password,
    };
    const params = !context.otp ? null : { otp: context.otp };
    return this.accountService.authenticate(request, params).pipe(
      tap((x) => {
        this.cleanBetweenAuthenticate();
        return this.credentialsService.setCredentials(x, context.remember)
      }),
      tap(() => this.refreshPermissions())
    );
    // this.credentialsService.setCredentials(data, context.remember);
    // return of(data);
  }

  refreshPermissions() {
    const oldPermissions: any = this.accountService.permissions
    this.accountService.getUserPermissions()?.toPromise()?.then(res => {
      const needChange = !this.accountService.user || Object.keys(res)?.some(k => res?.[k]?.some((v, i) => v !== oldPermissions?.[k]?.[i]))
      if (!!needChange) {
        setTimeout(() => {
          this.navigationService.setNavigationItems()
        }, 200)
      }
    })
  }

  /**
 * send link to reset user password.
 * @param email The user email.
 * @return void.
 */
  sendResetPasswordEmail(email: string): Observable<any> {
    return this.accountService.sendResetLink(email)
  }

  /**
   * Registers the user.
   * @param context The register parameters.
   * @return The user credentials.
   */
  register(context: RegisterContext): Observable<AuthorizationEntity> {
    // Replace by proper registration call
    const data: AuthorizationEntity = {
      username: context.username,
      accessToken: '654321',
      fullName: '',
      admin: true,
      authorized: true,
      email: '',
      expiresIn: new Date(),
      newUser: false,
    };
    return of(data);
  }


  public changePassword(
    model: { username: string; password: string; resetTokenL: string },
    otp?: string
  ): Observable<AuthenticationResponseModel> {
    return this.accountService.changePassword(model, otp)
  }





  changePasswordSuccesses(credentials: AuthenticationResponseModel) {
    const remember = this.credentialsService.credentials?.remember
    this.cleanBetweenAuthenticate()
    this.credentialsService.setCredentials(credentials, remember)
    this.refreshPermissions()
    this.accountService.user = credentials
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(replaceUrl: boolean, redirect?: string): void {
    CacheKeys.clearCache();
    this.credentialsService.setCredentials();
    const _router = this._injector.get(Router);
    _router.navigate(['/login'], { replaceUrl, queryParams: redirect ? { redirect } : null });
  }

  public refreshToken(): Observable<any> {
    return this.accountService.refreshToken()
      .pipe(
        tap(x => this.credentialsService.setCredentials(x, this.credentialsService.credentials.remember)),
        tap(() => this.refreshPermissions())
      )
  }
}
