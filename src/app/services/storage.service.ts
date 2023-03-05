import { Injectable } from '@angular/core';
import { Login } from '../models/login';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  clean(): void {
    window.sessionStorage.clear();
  }
  public saveUser(user: Login): void {
    // USER_KEY == user.token;
    window.sessionStorage.removeItem(USER_KEY);

    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): Login {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      let userObj = Object.assign(new Login(), JSON.parse(user));
      return userObj;
    }
    return new Login();
  }
  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }
}
