import { TestParameter } from './TestParameter';

interface IReportValue {
  id: number;
  Value: number;
  TestParameterId: number;
  TestParameter: TestParameter;
  LabReportId: number;
}
export class ReportValue {
  id: number;
  Value: number;
  TestParameterId: number;
  TestParameter: TestParameter;
  LabReportId: number;

  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.Value = obj?.value ?? 0;
    this.TestParameterId = obj?.testParameterId ?? 0;
    this.LabReportId = obj?.labReportId ?? 0;
  }
}
