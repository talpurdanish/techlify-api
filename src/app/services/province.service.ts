import { CommonFunctions } from './../helper/common.function';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const CONTROLLER_NAME = '/provinces';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  constructor(private http: HttpClient) {}
  getProvinces(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME,
      CommonFunctions.httpOptions
    );
  }
}
