import { CommonFunctions } from './../helper/common.function';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const CONTROLLER_URL = CommonFunctions.API_URL + '/todos';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient) {}

  getTodoList(): Observable<any> {
    return this.http.get(CONTROLLER_URL, {
      responseType: 'json',
    });
  }

  markCompleted(ids: string[]): Observable<any> {
    return this.http.post(
      CONTROLLER_URL + '/Manage',
      {
        ids: JSON.stringify(ids),
        type: 1,
      },
      CommonFunctions.httpOptions
    );
  }

  deleteMany(ids: string[]): Observable<any> {
    return this.http.post(
      CONTROLLER_URL + '/Manage',
      {
        ids: JSON.stringify(ids),
        type: 2,
      },
      CommonFunctions.httpOptions
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(
      CONTROLLER_URL + '/' + id,
      CommonFunctions.httpOptions
    );
  }

  create(id: string, title: string): Observable<any> {
    const url = CONTROLLER_URL + (id == '' ? '' : `/${id}`);
    if (id == '') {
      return this.http.post(url, `"${title}"`, CommonFunctions.httpOptions);
    } else {
      return this.http.put(url, `"${title}"`, CommonFunctions.httpOptions);
    }
  }
}
