import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';

const routes = {
  home: () => `/home`,
  login: () => `/login`,
};

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  private _cachedRequests: Array<HttpRequest<any>> = [];

  constructor(private _router: Router) {}

  public collectFailedRequest(request: HttpRequest<any>): void {
    this._cachedRequests.push(request);
  }

  public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  public to(url?: string, extras?: NavigationExtras) {
    // Get the redirect URL. If no redirect has been set, use the default
    let redirect = url ?? routes.home();

    // Set our navigation extras object
    // that passes on our global query params and fragment
    let navigationExtras: NavigationExtras = extras || {
      queryParamsHandling: 'preserve',
      preserveFragment: true,
    };

    // Redirect the user
    this._router.navigate([redirect], navigationExtras);
  }

  public toLogin() {
    this._router.navigate([routes.login()]);
  }

  public toHome() {
    this._router.navigate([routes.home()]);
  }
}
