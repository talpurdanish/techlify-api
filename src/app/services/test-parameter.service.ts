import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../helper/filter';
import { CommonFunctions } from '../helper/common.function';

const CONTROLLER_NAME = '/TestParameters';
@Injectable({
  providedIn: 'root',
})
export class TestParameterService {
  constructor(private http: HttpClient) {}

  createOrUpdate(
    id: number,
    name: string,
    maleMaxValue: number,
    maleMinValue: number,
    femaleMaxValue: number,
    femaleMinValue: number,
    unit: string,
    testId: number,
    referenceRange: string
  ): Observable<any> {
    if (id <= 0)
      return this.http.post(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          name,
          maleMaxValue,
          maleMinValue,
          femaleMaxValue,
          femaleMinValue,
          unit,
          testId,
          referenceRange,
        },
        CommonFunctions.httpOptions
      );
    else
      return this.http.put(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          id,
          name,
          maleMaxValue,
          maleMinValue,
          femaleMaxValue,
          femaleMinValue,
          unit,
          testId,
          referenceRange,
        },
        CommonFunctions.httpOptions
      );
  }

  getTestParameters(filter: Filter, id: number = -1): Observable<any> {
    if (id < 0) {
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
    } else {
      return this.http.get(
        CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
        {
          params: {
            type: 't',
          },
          responseType: 'json',
        }
      );
    }
  }

  getTestParameter(id: number, type: boolean = false): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL +
        CONTROLLER_NAME +
        '/' +
        id +
        (type ? '?type=t' : ''),
      {
        responseType: 'json',
      }
    );
  }

  deleteTestParameter(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      CommonFunctions.httpOptions
    );
  }
}
