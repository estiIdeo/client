import { Action } from "@ngrx/store";

export enum AuthActionTypes {
LOGIN='[Auth] Login',
LOGIN_SUCCESS='[Auth] SUCCESS',
LOGIN_ERROR="[Auth] LOGIN_ERROR",
LOGOUT = "[Auth] Logout"
}

export class Login implements Action {
  type = AuthActionTypes.LOGIN;
  constructor(public payload: any) {}

}


export class LoginSuccess implements Action {
  type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: any) {

  }
}

export class LoginFailure implements Action {
  type = AuthActionTypes.LOGIN_ERROR;
  constructor(public payload: any) {}

}

export class Logout implements Action {
  type = AuthActionTypes.LOGOUT
}

export type All =
  | Login
  | LoginSuccess
  | LoginFailure
  | Logout