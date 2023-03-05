import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
export class CommonFunctions {
  static ChangeSqlDatetoDate(sqldate: string): Date {
    let dateTimeParts = sqldate.split(/[- : T]/);
    const day: number = Number(dateTimeParts[2]);
    const year: number = Number(dateTimeParts[0]);
    var month = Number(dateTimeParts[1]) - 1;

    return new Date(year, month, day);
  }
  static ChangeDatetoNgbDatestruct(sqldate: string): NgbDateStruct {
    var date: Date = this.ChangeSqlDatetoDate(sqldate);
    var ngbDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    return ngbDate;
  }
}
