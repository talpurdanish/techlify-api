import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const AUTH_API = 'http://localhost:4000/api/fmdc/provinces/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class ProvincesService {
  constructor(private http: HttpClient) {}
  getProvinces(): Observable<any> {
    return this.http.get(AUTH_API, httpOptions);
  }
}
