export class Result {
  success: boolean;
  message: string;

  constructor(data: any) {
    let jsonObj = JSON.stringify(data);

    let result = JSON.parse(jsonObj) as Result;
    this.success = result.success;
    this.message = result.message;
  }
}
