import { CommonFunctions } from './../helper/common.function';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const CONTROLLER_NAME = '/cities';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private http: HttpClient) {}
  getCities(provinceid: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + `/${provinceid}`,
      httpOptions
    );
  }
}
