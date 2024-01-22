import { CommonFunctions } from './../helper/common.function';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryptoHandler } from '../security/crypto-handler';
import { RSAHelper } from '../security/RSAHelper';

const CONTROLLER_NAME = '/users/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private cryptoHandler: RSAHelper) {}
  login(username: string, password: string): Observable<any> {
    const pwd = this.cryptoHandler.encrypt(password);
    return this.http.post(
      CommonFunctions.API_URL + CONTROLLER_NAME + 'login',
      {
        username,
        password: pwd,
      },
      CommonFunctions.httpOptions
    );
  }
  changePassword(oldpassword: string, newpassword: string): Observable<any> {
    const oPwd = this.cryptoHandler.encrypt(oldpassword);
    const nPwd = this.cryptoHandler.encrypt(newpassword);
    return this.http.post(
      CommonFunctions.API_URL + CONTROLLER_NAME + 'ChangePassword',
      {
        oldpassword: oPwd,
        newpassword: nPwd,
      },
      CommonFunctions.httpOptions
    );
  }
  logout(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + 'logout',
      {}
    );
  }
}
