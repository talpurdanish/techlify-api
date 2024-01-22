import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Filter } from '../helper/filter';
import { CommonFunctions } from '../helper/common.function';

const CONTROLLER_NAME = '/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getUsers(filter: Filter): Observable<any> {
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

  getUser(id: string): Observable<any> {
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME + `/${id}`, {
      responseType: 'json',
    });
  }

  getDoctors(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetDoctors',
      { responseType: 'json' }
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      CommonFunctions.httpOptions
    );
  }

  createOrUpdate(
    id: number,
    name: string,
    username: string,
    password: string,
    dateofBirth: string,
    gender: string,
    cityId: number,
    role: string,
    phoneNo: string,
    picture: string
  ): Observable<any> {
    if (id > 0) {
      return this.http.put(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          id,
          name,
          username,
          password,
          dateofBirth,
          gender,
          cityId,
          role,
          phoneNo,
          picture,
        },
        CommonFunctions.httpOptions
      );
    } else {
      return this.http.post(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          id,
          name,
          username,
          password,
          dateofBirth,
          gender,
          cityId,
          role,
          phoneNo,
          picture,
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
    id: number = -1
  ): Observable<any> {
    if (id <= 0) id = -1;
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + `/${type}`,
      {
        params: { value: value, id: id ?? -1 },
        responseType: 'json',
      }
    );
  }

  manageUser(type: number, userId: any): Observable<any> {
    var url: string = '';

    switch (type) {
      case 4:
        url =
          CommonFunctions.API_URL +
          CONTROLLER_NAME +
          '/resetpassword/' +
          userId;
        break;
      case 3:
        url =
          CommonFunctions.API_URL + CONTROLLER_NAME + '/changestatus/' + userId;
        break;
    }

    return this.http.post(url, CommonFunctions.httpOptions);
  }

  changeRole(
    userId: string,

    roleId: string
  ): Observable<any> {
    return this.http.post(
      CommonFunctions.API_URL +
        CONTROLLER_NAME +
        `/changerole/${userId}?value=${roleId}`,
      CommonFunctions.httpOptions
    );
  }
}
