import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../helper/filter';
import { CommonFunctions } from '../helper/common.function';
import { PrescriptionMedication } from '../models/prescriptionMedication';

const CONTROLLER_NAME = '/Prescriptions';
@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  constructor(private http: HttpClient) {}

  createPrescription(
    appointmentid: number,
    patientid: number,
    doctorid: number,
    medications: string[],
    tests: number[],
    Bp: string,
    Pulse: number,
    Bsr: number,
    Temp: number,
    Wt: number,
    Ht: number,
    Diagnosis: string,
    Remarks: string
  ): Observable<any> {
    return this.http.post(
      CommonFunctions.API_URL + CONTROLLER_NAME,
      {
        appointmentid,
        patientid,
        doctorid,
        medications: JSON.stringify(medications),
        tests: JSON.stringify(tests),
        Bp,
        Pulse,
        Bsr,
        Temp,
        Wt,
        Ht,
        Diagnosis,
        Remarks,
      },
      CommonFunctions.httpOptions
    );
  }

  getPrescriptions(filter: Filter): Observable<any> {
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

  getPatientPrescriptions(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL +
        CONTROLLER_NAME +
        '/GetPatientPrescriptions/' +
        id,
      {
        responseType: 'json',
      }
    );
  }

  getPrescription(id: number, create: boolean = false): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL +
        CONTROLLER_NAME +
        '/' +
        id +
        (create ? '?type=1' : ''),
      {
        responseType: 'json',
      }
    );
  }

  deletePrescription(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      CommonFunctions.httpOptions
    );
  }

  generatePrescription(id: string): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GeneratePrescription/' + id,
      { responseType: 'blob' }
    );
  }
}
