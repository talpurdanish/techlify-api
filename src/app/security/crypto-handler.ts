import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
const ENCRYPTION_KEY = 'G-KaPdSgVkYp3s6v8y/B?E(H+MbQeThW';
const ENCRYPTION_IV = 'Z3JNEL9o4v1gXMFy';
@Injectable({
  providedIn: 'root',
})
export class CryptoHandler {
  constructor() {}
  //The set method is use for encrypt the value.
  set(value) {
    var key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    var iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_IV);
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(value) {
    var key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    var iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_IV);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keysize: 256 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
