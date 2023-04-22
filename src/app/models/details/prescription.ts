import { Test } from '../Lab/Tests';
import { PrescriptionMedication } from './../prescriptionMedication';

interface IPrescription {
  id: number;
  Appointmentid: number;
  Date: string;
  PatientId: number;
  PatientName: string;
  PatientNumber: string;
  StartTime: string;
  DoctorId: number;
  Doctor: string;
  MedStrings: PrescriptionMedication[];
  Medicines: PrescriptionMedication[];
  Tests: number[];
  MedicineStrings: string[];
  TestNames: string[];
  Bp: string;
  Pulse: number;
  Bsr: number;
  Temp: number;
  Wt: number;
  Ht: number;
  Diagnosis: string;
  Remarks: string;
}

export class Prescription implements IPrescription {
  id: number;
  Appointmentid: number;
  Date: string;
  PatientId: number;
  PatientName: string;
  PatientNumber: string;
  StartTime: string;
  DoctorId: number;
  Doctor: string;
  MedStrings: PrescriptionMedication[];
  Medicines: PrescriptionMedication[] = [];
  MedicineStrings: string[] = [];
  Tests: number[] = [];
  TestNames: string[] = [];
  Bp: string;
  Pulse: number;
  Bsr: number;
  Temp: number;
  Wt: number;
  Ht: number;
  Diagnosis: string;
  Remarks: string;

  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.Appointmentid = obj?.appointmentid ?? 0;
    this.Date = obj?.date ?? new Date();
    this.PatientName = obj?.patientName ?? '';
    this.PatientNumber = obj?.patientNumber ?? 0;
    this.StartTime = obj?.startTime ?? '';
    this.Doctor = obj?.doctor ?? '';

    this.PatientId = obj?.patientId ?? 0;
    this.DoctorId = obj?.doctorId ?? 0;

    this.Bp = obj?.bp ?? '';
    this.Pulse = obj?.pulse ?? 0;
    this.Bsr = obj?.bsr ?? 0;
    this.Temp = obj?.temp ?? 0;
    this.Wt = obj?.wt ?? 0;
    this.Ht = obj?.ht ?? 0;

    this.Diagnosis = obj?.Diagnosis ?? '';
    this.Remarks = obj?.Remarks ?? '';

    if (obj?.medstrings != undefined && obj?.medstrings != null) {
      var data = obj?.medstrings;

      for (const prop in data) {
        let jsonObj = JSON.stringify(data[prop]);
        var objM = JSON.parse(jsonObj);
        var prescription = new PrescriptionMedication(objM);
        const unit =
          prescription.Quantity == 1
            ? prescription.Units.substring(0, prescription.Units.length - 1)
            : prescription.Units;

        const timesStr = prescription.Times == 1 ? ' a day' : ' times/day';

        this.MedicineStrings.push(
          prescription.Medicine +
            ' ............... ' +
            prescription.Quantity +
            ' ' +
            unit +
            ' ' +
            prescription.Times +
            timesStr
        );
      }
    }
    var data = obj?.tests;

    if (obj?.tests != undefined && obj?.tests != null) {
      var data = obj?.tests;
      for (const prop in data) {
        this.TestNames.push(data[prop]);
      }
    }
  }
}
