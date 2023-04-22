import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Filter } from '../helper/filter';
import { CommonFunctions } from '../helper/common.function';

const CONTROLLER_NAME = '/patients';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private http: HttpClient) {}
  getPatients(filter: Filter): Observable<any> {
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

  getPatient(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '\\' + id,
      { responseType: 'json' }
    );
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '\\' + id,
      CommonFunctions.httpOptions
    );
  }

  createOrUpdate(
    id: number,
    name: string,
    fatherName: string,
    address: string,
    gender: number,
    phoneType: string,
    phoneNo: string,
    bloodGroup: string,
    dateofBirth: string,
    cnic: string,
    cityId: number,
    picture: string,
    imageType: string
  ): Observable<any> {
    if (id == 0) {
      return this.http.post(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          name,
          fatherName,
          address,
          gender,
          phoneType,
          phoneNo,
          bloodGroup,
          dateofBirth,
          cnic,
          cityId,
          picture,
          imageType,
        },
        CommonFunctions.httpOptions
      );
    } else {
      return this.http.put(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          id,
          name,
          fatherName,
          address,
          gender,
          phoneType,
          phoneNo,
          bloodGroup,
          dateofBirth,
          cnic,
          cityId,
          picture,
          imageType,
        },
        CommonFunctions.httpOptions
      );
    }
  }

  uploadProgress: number;
  uploadSub: Subscription;
  uploadImage(image: string): Observable<any> {
    // if (image.indexOf('data:image/png;base64,') > -1) {
    image.replace('data:image/png;base64,', '');
    image = image.substring(23);
    // }
    image = image + '==';
    alert(image);
    const upload$ = this.http.post(
      CommonFunctions.API_URL + CONTROLLER_NAME + 'UploadImageFromStream',
      { image },
      CommonFunctions.multiPartHttpOptions
    );
    // .pipe(finalize(() => this.reset()));

    // this.uploadSub = upload$.subscribe((event) => {
    //   if (event.type == HttpEventType.UploadProgress) {
    //     this.uploadProgress = Math.round(100 * (event.loaded / event.total));
    //   }
    // });
    return upload$;
  }
  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
  checkUniqueValue(
    type: string,
    value: string,
    id: number = 0
  ): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '\\' + type,
      {
        params: { id: id, value: value },
        responseType: 'json',
      }
    );
  }

  getPatientStats(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetStats',
      { responseType: 'json' }
    );
  }

  getAppointButtons(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetButtons/' + id,
      { responseType: 'json' }
    );
  }

  generateSlip(id: string): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GenerateSlip/' + id,
      { responseType: 'blob' }
    );
  }
}
