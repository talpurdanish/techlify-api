import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../helper/filter';
import { CommonFunctions } from '../helper/common.function';

const CONTROLLER_NAME = '/Appointments';
@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  addAppointment(userId: number, patientId: number): Observable<any> {
    return this.http.post(
      CommonFunctions.API_URL + CONTROLLER_NAME,
      {
        userId,
        patientId,
      },
      CommonFunctions.httpOptions
    );
  }

  getAppointments(filter: Filter): Observable<any> {
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

  getPatientAppointments(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL +
        CONTROLLER_NAME +
        '/GetPatientAppointments/' +
        id,
      { responseType: 'json' }
    );
  }

  getAppointment(id: number): Observable<any> {
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id, {
      responseType: 'json',
    });
  }

  getPendingAppointments(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetPending',
      { responseType: 'json' }
    );
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      CommonFunctions.httpOptions
    );
  }

  getAppointmentStats(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetStats',
      { responseType: 'json' }
    );
  }
  addEndDate(patientId: number, type: string): Observable<any> {
    return this.http.put(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/AddEndDate',
      {
        id: patientId,
        value: type,
      },
      CommonFunctions.httpOptions
    );
  }
}
