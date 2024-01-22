import { EventEmitter, Injectable, Output } from '@angular/core';
import { Login } from '../models/login';
const USER_KEY = '7A408A93-6291-4561-A5A1-B4CB272A5C1E';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  @Output() fireIsLoggedIn: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}
  clean(): void {
    window.sessionStorage.clear();
    this.fireIsLoggedIn.emit(null);
  }
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.fireIsLoggedIn.emit(user);
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

  getEmitter() {
    return this.fireIsLoggedIn;
  }

  // public savePrescription(prescription: Prescription): Boolean {
  //   try {
  //     window.sessionStorage.removeItem(PRESCRIPTION_KEY);
  //     window.sessionStorage.setItem(
  //       PRESCRIPTION_KEY,
  //       JSON.stringify(prescription)
  //     );
  //     return true;
  //   } catch (error) {
  //     alert(error);
  //     return false;
  //   }
  // }

  // public getPrescription(): Prescription {
  //   const user = window.sessionStorage.getItem(PRESCRIPTION_KEY);

  //   if (user) {
  //     let userObj = Object.assign(new Prescription(), JSON.parse(user));
  //     return userObj;
  //   }
  //   return null;
  // }

  // public removePrescription() {
  //   window.sessionStorage.removeItem(PRESCRIPTION_KEY);
  // }
}
