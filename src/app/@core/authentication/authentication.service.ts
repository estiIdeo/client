import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = environment.serverUrl;
  constructor(private _http: HttpClient) { }


  loginIn(user: User) {
    let { username, password } = user;
    return this._http.post<User>(`${this.baseUrl}/login`, {username, password});
  }
}
