import { ReportValue } from './ReportValue';
import { TestParameter } from './TestParameter';

interface ILabReport {
  id: number;
  ReportDate: string;
  ReportTime: string;
  ReportDeliveryDate: string;
  TestName: string;
  TestId: number;
  PatientId: number;
  PatientName: string;
  Doctor: string;
  DoctorId: number;
  ReportNumber: number;
  ReportNoString: string;
  Status: string;
  gender: string;
  PatinetAge: string;
  DoctorPmdcNo: string;
  Note: string;
  ReportValues: ReportValue[];
  TestParameters: TestParameter[];
}

export class LabReport implements ILabReport {
  id: number;
  ReportDate: string;
  ReportTime: string;
  ReportDeliveryDate: string;
  TestName: string;
  TestId: number;
  PatientId: number;
  PatientName: string;
  Doctor: string;
  DoctorId: number;
  ReportNumber: number;
  ReportNoString: string;
  Status: string;
  gender: string;
  PatinetAge: string;
  DoctorPmdcNo: string;
  Note: string;
  ReportValues: ReportValue[];
  TestParameters: TestParameter[];

  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.ReportDate = obj?.reportDate ?? ' ';
    this.ReportTime = obj?.reportTime ?? ' ';
    this.ReportDeliveryDate = obj?.reportDeliveryDate ?? ' ';
    this.TestName = obj?.testName ?? ' ';
    this.TestId = obj?.testId ?? 0;
    this.PatientId = obj?.patientId ?? 0;
    this.PatientName = obj?.patientName ?? ' ';
    this.Doctor = obj?.doctor ?? ' ';
    this.DoctorId = obj?.doctorId ?? 0;
    this.ReportNumber = obj?.reportNumber ?? 0;
    this.ReportNoString = obj?.reportNoString ?? ' ';
    this.Status = obj?.status ?? ' ';
    this.gender = obj?.gender ?? ' ';
    this.PatinetAge = obj?.patinetAge ?? ' ';
    this.DoctorPmdcNo = obj?.doctorPmdcNo ?? ' ';
    this.Note = obj?.note ?? ' ';
  }
}
