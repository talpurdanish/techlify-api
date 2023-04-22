import { Procedure } from './../procedure';
interface IReciept {
  id: number;
  RecieptNumber: string;
  PatientId: number;
  DoctorId: number;
  AppointmentId: string;
  PatientName: string;
  PatientNumber: string;
  Doctor: string;
  Date: string;
  Time: string;
  AuthorizedBy: string;
  AuthorizedById: string;
  Discount: number;
  Total: number;
  GrandTotal: number;
  Appointment: string;
  Paid: boolean;
  Procedures: Procedure[];
  ProcedureIds: number[];
}

export class Reciept implements IReciept {
  id: number = 0;
  RecieptNumber: string = '0';
  PatientId: number = 0;
  DoctorId: number = 0;
  AppointmentId: string = '';
  PatientName: string = '';
  PatientNumber: string = '';
  Doctor: string = '';
  Date: string = '';
  Time: string = '00:00';
  AuthorizedBy: string = '';
  AuthorizedById: string = '';
  Discount: number = 0;
  Total: number = 0;
  GrandTotal: number = 0;
  Appointment: string = '';
  Paid: boolean = false;
  Procedures: Procedure[] = [];
  ProcedureIds: number[] = [];

  // constructor();
  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.RecieptNumber = obj?.thisNumber ?? '';
    this.PatientId = obj?.patientId ?? '';
    this.DoctorId = obj?.doctorId ?? '';
    this.AppointmentId = obj?.appointmentId ?? '';
    this.PatientName = obj?.patientName ?? '';
    this.PatientNumber = obj?.patientNumber ?? '';
    this.Doctor = obj?.doctor ?? '';
    this.Date = obj?.date ?? '';
    this.Time = obj?.time ?? '';
    this.AuthorizedBy = obj?.authorizedBy ?? '';
    this.AuthorizedById = obj?.authorizedById ?? '';
    this.Discount = obj?.discount ?? 0;
    this.Total = obj?.total ?? 0;
    this.GrandTotal = obj?.grandTotal ?? 0;
    this.Appointment = obj?.appointment ?? '';
    this.Paid = obj?.paid ?? false;
    this.Procedures = obj?.procedures ?? [];
    if (this.Procedures.length > 0) {
      for (var p in this.Procedures) {
        this.ProcedureIds.push(this.Procedures[p].id);
      }
    }
  }
}
