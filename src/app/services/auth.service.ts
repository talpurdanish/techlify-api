import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const AUTH_API = 'http://localhost:4000/api/fmdc/users/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'login',
      {
        username,
        password,
      },
      httpOptions
    );
  }
  changePassword(
    userid: number,
    oldpassword: string,
    newpassword: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'ChangePassword',
      {
        userid,
        oldpassword,
        newpassword,
      },
      httpOptions
    );
  }
  logout(): Observable<any> {
    return this.http.get(AUTH_API + 'logout', {});
  }
}
