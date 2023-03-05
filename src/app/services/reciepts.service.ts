import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
const API_URL = 'http://localhost:4000/api/fmdc/reciepts/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const multiPartHttpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
};
@Injectable({
  providedIn: 'root',
})
export class RecieptsService {
  constructor(private http: HttpClient) {}

  getReciepts(): Observable<any> {
    return this.http.get(API_URL + 'GetReciepts', { responseType: 'json' });
  }

  generateReport(id: number): Observable<any> {
    return this.http.get(API_URL + 'GenerateReciept\\' + id, {
      responseType: 'json',
    });
  }
}
