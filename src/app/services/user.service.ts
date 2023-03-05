import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

const API_URL = 'http://localhost:4000/api/fmdc/users/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const multiPartHttpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getUsers(): Observable<any> {
    return this.http.get(API_URL + 'GetUsers', { responseType: 'json' });
  }

  getUser(id: number): Observable<any> {
    return this.http.get(API_URL + 'GetUser\\' + id, { responseType: 'json' });
  }

  getRoles(): Observable<any> {
    return this.http.get(API_URL + 'GetRoles', { responseType: 'json' });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(API_URL + 'Delete/' + id, httpOptions);
  }

  createOrUpdate(
    userId: string,
    name: string,
    username: string,
    address: string,
    dateofBirth: string,
    gender: string,
    cnic: string,
    pmdcNo: string,
    cityId: number,
    roleId: number,
    provinceId: number,
    phoneNo: string,
    phoneType: string,
    picture: string
  ): Observable<any> {
    // picture = picture.substring(23);
    // if (picture.indexOf('==') < 0) picture = picture + '==';
    return this.http.post(
      API_URL,
      {
        userId,
        name,
        username,
        address,
        dateofBirth,
        gender,
        cnic,
        pmdcNo,
        cityId,
        roleId,
        provinceId,
        phoneNo,
        phoneType,
        picture,
      },
      httpOptions
    );
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
      API_URL + 'UploadImageFromStream',
      { image },
      multiPartHttpOptions
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
    return this.http.get(API_URL + type, {
      params: { id: id, title: value },
      responseType: 'json',
    });
  }

  manageUser(type: string, userId: number): Observable<any> {
    var url: string = '';

    switch (type) {
      case 'resetpwd':
        url = API_URL + 'ResetPassword\\' + userId;
        break;
      case 'actdeactuser':
        url = API_URL + 'ToggleUserStatus\\' + userId;
        break;
    }

    return this.http.post(url, httpOptions);
  }

  changeRole(
    userId: number,

    roleId: number
  ): Observable<any> {
    // picture = picture.substring(23);
    // if (picture.indexOf('==') < 0) picture = picture + '==';
    return this.http.post(
      API_URL + 'ChangeRole',
      {
        userId,
        roleId,
      },
      httpOptions
    );
  }
}
