import { HttpHeaders } from '@angular/common/http';

export class CommonFunctions {
  static ChangeSqlDatetoDate(sqldate: string): Date {
    let dateTimeParts = sqldate.split(/[- : T]/);
    const day: number = Number(dateTimeParts[2]);
    const year: number = Number(dateTimeParts[0]);
    var month = Number(dateTimeParts[1]) - 1;

    return new Date(year, month, day);
  }

  static changeDateofBirthFormat(value: string): string {
    var dateArray = new Date(value);

    var day = dateArray.getDate();
    var dayStr = (day < 10 ? '0' : '') + day;

    var month = dateArray.getMonth() + 1;
    var monthStr = (month < 10 ? '0' : '') + month;
    var year = dateArray.getFullYear();
    var date = year + '-' + monthStr + '-' + dayStr + 'T00:00:00.000Z';
    return date;
  }

  static changeTimeFormat(value: string): string {
    var dateArray = new Date(value);

    var hour = dateArray.getHours();
    var hourStr = (hour < 10 ? '0' : '') + hour;

    var minute = dateArray.getMinutes() + 1;
    var minuteStr = (minute < 10 ? '0' : '') + minute;

    var date = hourStr + minuteStr;
    return date;
  }

  static changeCNICValue(value: string): string {
    if (value.indexOf('-') == -1) {
      var start = value.substring(0, 5);
      var middle = value.substring(5, 12);
      var end = value.substring(12, 13);
      return start + '-' + middle + '-' + end;
    } else {
      return value;
    }
  }

  static getPrimeNgDropdownValue(dropdown: any): number {
    let isNumber = CommonFunctions.isNumber(dropdown);
    let returnValue = 0;
    if (!isNumber) {
      let jsonObj = JSON.stringify(dropdown);
      let result = JSON.parse(jsonObj);

      returnValue = result.value;
    } else {
      returnValue = dropdown;
    }
    returnValue = returnValue == null ? 0 : returnValue;
    return returnValue;
  }

  static isNumber(str: string): boolean {
    var parsed = parseFloat(str);
    var casted = +str;
    return parsed === casted && !isNaN(parsed) && !isNaN(casted);
  }

  static ComputeField(str: string): number {
    let fd = 1;
    if (str != undefined && str != null) {
      switch (str.toLowerCase()) {
        case 'name':
          fd = 1;
          break;
        case 'pmdcno':
          fd = 2;
          break;
        case 'cnic':
          fd = 3;
          break;
        case 'rolename':
          fd = 4;
          break;
        case 'username':
          fd = 5;
          break;
        case 'cityname':
          fd = 6;
          break;
        case 'phoneno':
          fd = 7;
          break;
        case 'gender':
          fd = 8;
          break;
      }
    }
    return fd;
  }
  static calculateAge(dob: Date): string {
    var str = '';

    var todayDate = new Date();
    var ageyear = todayDate.getFullYear() - dob.getFullYear();
    var agemonth = todayDate.getMonth() - dob.getMonth();
    var ageday = todayDate.getDate() - dob.getDate();

    var dobDay = dob.getDate();

    if (agemonth <= 0) {
      ageyear--;
      agemonth = 12 + agemonth;
    }
    if (ageday < dobDay) {
      agemonth--;
      ageday = 30 + ageday;
    }
    if (agemonth == 12) {
      ageyear = ageyear + 1;
      agemonth = 0;
    }

    str =
      (ageyear > 0 ? ageyear + ' yr(s), ' : '') +
      agemonth +
      ' month(s) & ' +
      ageday +
      ' day(s) ';

    return str;
  }
  public static API_URL = 'https://localhost:4000/api';
  public static httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  public static multiPartHttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
  };
}
