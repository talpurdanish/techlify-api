import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../helper/filter';
import { CommonFunctions } from '../helper/common.function';

const CONTROLLER_NAME = '/Procedures';
@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  constructor(private http: HttpClient) {}

  createOrUpdate(
    id: number,
    name: string,
    cost: number,
    typeId: number
  ): Observable<any> {
    if (id <= 0)
      return this.http.post(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          name,
          cost,
          typeId,
        },
        CommonFunctions.httpOptions
      );
    else
      return this.http.put(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          id,
          name,
          cost,
          typeId,
        },
        CommonFunctions.httpOptions
      );
  }

  getProcedures(filter: Filter): Observable<any> {
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

  getPatientsProcedures(id: number): Observable<any> {
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id, {
      responseType: 'json',
    });
  }

  getProcedure(id: number): Observable<any> {
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id, {
      responseType: 'json',
    });
  }

  deleteProcedure(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      CommonFunctions.httpOptions
    );
  }
}
