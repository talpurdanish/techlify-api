import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../helper/filter';
import { CommonFunctions } from '../helper/common.function';

const CONTROLLER_NAME = '/Reports';
@Injectable({
  providedIn: 'root',
})
export class LabReportService {
  constructor(private http: HttpClient) {}

  createOrUpdate(
    id: number = -1,
    reportDeliveryDate: Date,
    reportDeliveryTime: string,
    patientId: number,
    doctorId: number,
    testId: number
  ): Observable<any> {
    if (id <= 0)
      return this.http.post(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          reportDeliveryDate,
          reportDeliveryTime,
          patientId,
          doctorId,
          testId,
        },
        CommonFunctions.httpOptions
      );
    else
      return this.http.put(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          id,
          reportDeliveryDate,
          reportDeliveryTime,
          patientId,
          doctorId,
          testId,
        },
        CommonFunctions.httpOptions
      );
  }

  updateValues(
    paramvalues: { id: number; value: number }[],
    labReportId: number
  ): Observable<any> {
    return this.http.put(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/updatevalues/',
      {
        paramvalues: JSON.stringify(paramvalues),
        labReportId,
      },
      CommonFunctions.httpOptions
    );
  }

  getPendingParameters(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetPendingParameters/' + id,
      {
        responseType: 'json',
      }
    );
  }

  getLabReports(filter: Filter): Observable<any> {
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

  getLabReport(id: number): Observable<any> {
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id, {
      responseType: 'json',
    });
  }

  deleteLabReport(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      CommonFunctions.httpOptions
    );
  }

  getPatientReports(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetPatientReports/' + id,
      {
        responseType: 'json',
      }
    );
  }
  generateReport(id: string): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GenerateReport/' + id,
      { responseType: 'blob' }
    );
  }

  getPendingLabReports(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetPending/',
      { responseType: 'json' }
    );
  }
}
