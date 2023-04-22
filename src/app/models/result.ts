export class Result {
  error: boolean;
  message: string;
  code: string;
  results: {};
  success: boolean;
  constructor(data: any) {
    let jsonObj = JSON.stringify(data);
    // console.log(jsonObj);
    let result = JSON.parse(jsonObj) as Result;
    this.error = result.error;
    this.message = result.message;
    this.code = result.code;
    this.results = result.results;
    this.success = !result.error;
  }
}
