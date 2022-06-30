import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "@app/@core/authentication/authentication.service";

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthActionTypes, Login, LoginFailure, LoginSuccess } from "./auth.actions";
@Injectable()
export class AuthEffects {  
 
    // @Effect()
    // LoginIn: Observable<any> = this.actions.pipe(
    //   ofType(AuthActionTypes.LOGIN),
    //   map((action: Login) => action.payload),
    //   switchMap(payload => {
    //     debugger
    //     return this.authService.loginIn(payload).pipe(
    //       map((user: any) => {
    //         return new LoginSuccess({token: user.token, email: payload.username});
    //       }),
    //       catchError((error) => {
    //         return of(new LoginFailure({error}));
    //       })
    //     )
    //   })
    // )
    @Effect({dispatch: false})
    LoginSuccess: Observable<any> = this.actions.pipe(
      ofType(AuthActionTypes.LOGIN_SUCCESS),
      tap((user:any) => {
        localStorage.setItem('token', user.payload.token);
        // this.router.navigate(['home']);
      })
    )

    @Effect({ dispatch: false })
    LogInFailure: Observable<any> = this.actions.pipe(
      ofType(AuthActionTypes.LOGIN_ERROR)
    );

    @Effect({dispatch: false})
    LogOut: Observable<any> = this.actions.pipe(
      ofType(AuthActionTypes.LOGOUT),
      tap(() => {
        localStorage.removeItem('token');
        this.router.navigate(['login']);
      })
    )



  constructor(
    private actions: Actions,
    private router: Router,
    private authService: AuthenticationService,
  ) {

  }
}