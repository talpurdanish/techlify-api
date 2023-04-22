import { Filter } from './../helper/filter';
import { Procedure } from './../models/procedure';
import { CommonFunctions } from './../helper/common.function';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const CONTROLLER_NAME = '/reciepts';

@Injectable({
  providedIn: 'root',
})
export class RecieptsService {
  constructor(private http: HttpClient) {}

  getUnpaidReciepts(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetUnpaidReciepts',
      { responseType: 'json' }
    );
  }

  getReciepts(filter: Filter): Observable<any> {
    filter = filter == null ? new Filter('', 1, 1, 1) : filter;
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

  getReciept(id: number): Observable<any> {
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id, {
      responseType: 'json',
    });
  }

  deleteReciept(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/Delete/' + id,
      CommonFunctions.httpOptions
    );
  }
  createReciept(
    RecieptNumber: string,
    PatientId: number,
    DoctorId: number,
    AppointmentId: string,
    PatientName: string,
    PatientNumber: string,
    Doctor: string,
    Date: string,
    Time: string,
    AuthorizedBy: string,
    AuthorizedById: string,
    Discount: number,
    Total: number,
    GrandTotal: number,
    Appointment: string,
    Paid: boolean,
    Procedures: Procedure[]
  ): Observable<any> {
    return this.http.post(
      CommonFunctions.API_URL + CONTROLLER_NAME,
      {
        RecieptNumber,
        PatientId,
        DoctorId,
        AppointmentId,
        PatientName,
        PatientNumber,
        Doctor,
        Date,
        Time,
        AuthorizedBy,
        AuthorizedById,
        Discount,
        Total,
        GrandTotal,
        Appointment,
        Paid,
        Procedures,
      },
      CommonFunctions.httpOptions
    );
  }

  updateStatus(id: number): Observable<any> {
    return this.http.put(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      CommonFunctions.httpOptions
    );
  }
  getIncomeStats(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetStats',
      { responseType: 'json' }
    );
  }
  getRecieptProcedures(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + '/procedures/GetProcedure/' + id,
      { responseType: 'json' }
    );
  }
  generateReciept(id: string): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GenerateReciept/' + id,
      { responseType: 'blob' }
    );
  }

  getPatientReciepts(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetPatientReciepts/' + id,
      {
        responseType: 'json',
      }
    );
  }
}
