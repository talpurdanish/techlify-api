import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../helper/filter';
import { CommonFunctions } from '../helper/common.function';

const CONTROLLER_NAME = '/Medications';
@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  constructor(private http: HttpClient) {}

  createOrUpdate(
    code: number,
    name: string,
    brand: string,
    description: string,
    typeId: number
  ): Observable<any> {
    if (code <= 0)
      return this.http.post(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          name,
          brand,
          description,
          typeId,
        },
        CommonFunctions.httpOptions
      );
    else
      return this.http.put(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          code,
          name,
          brand,
          description,
          typeId,
        },
        CommonFunctions.httpOptions
      );
  }

  getMedications(filter: Filter): Observable<any> {
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

  getPatientsMedications(id: number): Observable<any> {
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id, {
      responseType: 'json',
    });
  }

  getMedication(id: number): Observable<any> {
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id, {
      responseType: 'json',
    });
  }

  deleteMedication(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      CommonFunctions.httpOptions
    );
  }
}
