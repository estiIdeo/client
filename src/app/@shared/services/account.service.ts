import { EventEmitter, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { AuthenticationResponseModel } from '../models/authentication.response';
import { environment } from '../../../environments/environment';
import { RoleModel } from '../models/role.model';
import { startWith, switchMap, tap, map } from 'rxjs/operators';
import { CacheKeys } from '@app/@ideo/infrastructure/services/storage-keys.service';
import { IPagedList } from '../models/paged-list.response';
import { RolesType } from '../types/role.type';
import { HttpClient } from '@angular/common/http';

interface PermissionDateModal {
  [key: string]: string[];
}
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _user: AuthenticationResponseModel;
  private loginState: EventEmitter<AuthenticationResponseModel> = new EventEmitter<AuthenticationResponseModel>();
  public selectedPartnerFleetChanged: BehaviorSubject<{ [partnerId: number]: number }>;

  private _permissions: any;

  constructor(private http: HttpClient) {
    this.selectedPartnerFleetChanged = new BehaviorSubject<{ [partnerId: number]: number }>(this.selectedPartnerFleet);
  }

  public set user(val: AuthenticationResponseModel) {
    this._user = val;
    localStorage.setItem(CacheKeys.TOKEN, val.token);
    localStorage.setItem(CacheKeys.USER, JSON.stringify(val));
  }

  public get user(): AuthenticationResponseModel {
    if (!this._user) {
      this._user = JSON.parse(localStorage.getItem(CacheKeys.USER));
    }
    return this._user;
  }

  public get permissions(): PermissionDateModal {
    if (!this._permissions) {
      this._permissions = JSON.parse(localStorage.getItem(CacheKeys.PERMISSIONS));
    }

    return this._permissions;
  }
  public set permissions(permissions: PermissionDateModal) {
    let permits = Object.keys(permissions).reduce((obj, module) => {
      return { ...obj, [module]: Object.keys(permissions[module]).map((x) => permissions[module][x]) };
    }, {});
    this._permissions = permits;
    localStorage.setItem(CacheKeys.PERMISSIONS, JSON.stringify(permits));
  }

  public get roles(): RolesType[] {
    let currentUser = this.user;
    return !!currentUser ? currentUser.roles : [];
  }

//   public get partnerId(): number {
//     const currentUser = this.user;
//     // TODO: Please add default partner id to each user or option to select one !!!!!!
//     return (
//       this.selectedPartnerFleetObj?.partnerId || +Object.keys(this.partnerFleetIds || {})?.[0] || currentUser?.partnerId
//     );
//   }

//   public get partnerFleetIds(): { [partnerId: number]: number[] } {
//     const currentUser = this.user;
//     return !!currentUser ? currentUser.partnerFleetIds : {};
//   }

//   public get fleetIds(): number[] {
//     const currentUser = this.user;
//     return !!currentUser?.partnerFleetIds
//       ? currentUser.partnerFleetIds[this.partnerId]
//       : [];
//   }

  public get selectedPartnerFleet(): { [partnerId: number]: number } {
    return JSON.parse(localStorage.getItem(CacheKeys.SELECTED_PARTNER_FLEET));
  }
  public set selectedPartnerFleet(v: { [partnerId: number]: number }) {
    localStorage.setItem(CacheKeys.SELECTED_PARTNER_FLEET, JSON.stringify(v));
    this.selectedPartnerFleetChanged.next(v);
  }

  public get selectedPartnerFleetObj(): { partnerId: number; fleetId: number } {
    const selected = this.selectedPartnerFleet;
    if (!!selected) {
      const partnerId = Object.keys(selected)?.[0];
      const fleetId = selected?.[partnerId];
      return { partnerId: Number(partnerId), fleetId: fleetId };
    }
  }


  public get isLoggedIn(): boolean {
    return !!this.user;
  }

  private fleetRoles = ['FleetManager', 'CustomerServiceRepresentive'];
  public get isFleetUser(): boolean {
    return !!this.fleetRoles.find((x) => this.roles.includes(x as any));
  }

  public getUserPermissions(): Observable<PermissionDateModal> {
    return this.http.get<PermissionDateModal>(`${environment.serverUrl}/api/Account/Permissions`).pipe(
      tap((res) => {
        this.permissions = res;
      })
    );
  }

  public listenToLoginState(): Observable<AuthenticationResponseModel> {
    let currentState = !!this.isLoggedIn ? this.user : null;
    return this.loginState.pipe(startWith(currentState));
  }

  public authenticate(
    model: { username: string; password: string },
    params: { otp: string } = null
  ): Observable<AuthenticationResponseModel> {
      debugger
    return this.http
      .post<AuthenticationResponseModel>(`${environment.serverUrl}/api/Account/Authenticate`, model, { params })
      .pipe(
        switchMap((user) => (user.type == '2FA' ? throwError(user) : of(user))),
        tap((u) => {
          this.user = u;
        })
      );
  }

  public sendResetLink(email: string): Observable<any> {
    return this.http.get<AuthenticationResponseModel>(
      `${environment.serverUrl}/api/Account/SendPasswordResetEmail/${email}`
    );
  }

  refreshToken(): Observable<any> {
    let refreshModel = {
      currentToken: this.user.token,
      refreshToken: this.user?.refreshToken,
    };
    return this.http
      .post(`${environment.serverUrl}/api/Account/Refresh`, refreshModel)
      .pipe(tap((user) => (this.user = user)));
  }

  public translateUserName(hash: string): Observable<string> {
    return this.http.get<string>(`${environment.serverUrl}/api/Account/RessetPassword/Translate?hash=${hash}`);
  }

  public changePassword(
    model: { username: string; password: string; resetTokenL: string },
    otp?: string
  ): Observable<AuthenticationResponseModel> {
    return this.http.post<AuthenticationResponseModel>(
      `${environment.serverUrl}/api/Account/ChangePasswordByToken?otp=${!!otp ? otp : ''}`,
      model
    );
  }

  public getRoles(): Observable<RoleModel[]> {
    return this.http.get<IPagedList<RoleModel>>(`${environment.serverUrl}/api/Security/Roles`).pipe(map((x) => x.data));
  }
}
