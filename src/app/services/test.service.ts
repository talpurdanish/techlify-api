import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../helper/filter';
import { CommonFunctions } from '../helper/common.function';

const CONTROLLER_NAME = '/Tests';
@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private http: HttpClient) {}

  createOrUpdate(
    id: number,
    name: string,
    description: number
  ): Observable<any> {
    if (id <= 0)
      return this.http.post(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          name,
          description,
        },
        CommonFunctions.httpOptions
      );
    else
      return this.http.put(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          id,
          name,
          description,
        },
        CommonFunctions.httpOptions
      );
  }

  getTests(filter: Filter): Observable<any> {
    filter = filter == null ? new Filter('', 1, 10, 1) : filter;
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME, {
      params: {
        term: filter.term,
        searchfield: filter.searchfield,
        sortfield: filter.sortfield,
        order: filter.order,
      },
      responseType: 'json',
    });
  }

  getTest(id: number): Observable<any> {
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id, {
      responseType: 'json',
    });
  }

  deleteTest(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      CommonFunctions.httpOptions
    );
  }
}
