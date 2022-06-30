import { EventEmitter, Injectable } from '@angular/core';
import { AuthorizationEntity } from './authentication.models';
import { AuthenticationResponseModel } from '@app/@shared/models/authentication.response';
import { CacheKeys } from '@app/@ideo/infrastructure/services/storage-keys.service';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: AuthorizationEntity | null = null;
  public credentialsChanged:  EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
    const savedCredentials = sessionStorage.getItem(CacheKeys.CREDENTIALS) || localStorage.getItem(CacheKeys.CREDENTIALS);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
      if (typeof this._credentials.expiresIn == 'string') {
        let expiresIn = JSON.parse(this._credentials.expiresIn);
        this._credentials.expiresIn = new Date(expiresIn);
      }
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): AuthorizationEntity | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(authenticationResponse?: AuthenticationResponseModel, remember?: boolean) {
    this._credentials = !authenticationResponse
      ? null
      : ({
        expiresIn:
          typeof authenticationResponse.validTo == 'string'
            ? new Date(authenticationResponse.validTo)
            : authenticationResponse.validTo,
        accessToken: authenticationResponse.token,
        username: authenticationResponse.username,
        email: authenticationResponse.username,
        authorized: true,
        remember,
      } as AuthorizationEntity);

    if (this._credentials && this._credentials.authorized) {
      const credentials = this.createCredentialsFromAuthEntity();
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(CacheKeys.CREDENTIALS, JSON.stringify(credentials));
      this.credentialsChanged.emit(true);
    } else {
      sessionStorage.removeItem(CacheKeys.CREDENTIALS);
      localStorage.removeItem(CacheKeys.CREDENTIALS);
    }
  }

  private createCredentialsFromAuthEntity() {
    const username = this._credentials.fullName;
    const expiresAt = JSON.stringify(this._credentials.expiresIn);

    return {
      isAdmin: JSON.stringify(this._credentials.admin),
      accessToken: this._credentials.accessToken,
      email: this._credentials.email,
      expiresIn: expiresAt,
      user: username,
      remember: this._credentials.remember,
    };
  }
}
