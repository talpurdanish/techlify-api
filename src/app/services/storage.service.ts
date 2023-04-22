import { Reciept } from './../models/details/reciept';
import { Injectable } from '@angular/core';
import { Login } from '../models/login';
import { Prescription } from '../models/details/prescription';
const USER_KEY = '7A408A93-6291-4561-A5A1-B4CB272A5C1E';
const RECIEPT_KEY = '1A5BB398-F7F6-48DD-8000-328E4C40DE02';
const PRESCRIPTION_KEY = '2F1C285F-8E23-405F-A4CB-FB7C1A4F24A7';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  clean(): void {
    window.sessionStorage.clear();
  }
  public saveUser(user: any): void {
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

  public saveReciept(reciept: Reciept): Boolean {
    try {
      window.sessionStorage.removeItem(RECIEPT_KEY);
      window.sessionStorage.setItem(RECIEPT_KEY, JSON.stringify(reciept));
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public getReciept(): Reciept {
    const user = window.sessionStorage.getItem(RECIEPT_KEY);

    if (user) {
      let userObj = Object.assign(new Reciept(), JSON.parse(user));
      return userObj;
    }
    return null;
  }

  public removeReciept() {
    window.sessionStorage.removeItem(RECIEPT_KEY);
  }
  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }

  public savePrescription(prescription: Prescription): Boolean {
    try {
      window.sessionStorage.removeItem(PRESCRIPTION_KEY);
      window.sessionStorage.setItem(
        PRESCRIPTION_KEY,
        JSON.stringify(prescription)
      );
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public getPrescription(): Prescription {
    const user = window.sessionStorage.getItem(PRESCRIPTION_KEY);

    if (user) {
      let userObj = Object.assign(new Prescription(), JSON.parse(user));
      return userObj;
    }
    return null;
  }

  public removePrescription() {
    window.sessionStorage.removeItem(PRESCRIPTION_KEY);
  }
}
