interface IAppointment {
  id: number;
  AppointmentDate: Date;
  StartTime: string;
  AppointmentEndDate: Date;
  EndTime: string;
  UserId: number;
  PatientId: number;
  PatientName: string;
  DoctorName: string;
}

export class Appointment implements IAppointment {
  public id: number;
  public AppointmentDate: Date;
  public StartTime: string;
  public AppointmentEndDate: Date;
  public EndTime: string;
  public UserId: number;
  public PatientId: number;
  public PatientName: string;
  public DoctorName: string;

  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.AppointmentDate = obj?.appointmentDate ?? new Date();
    this.StartTime = obj?.startTime ?? '';
    this.AppointmentEndDate = obj?.appointmentEndDate ?? new Date();
    this.EndTime = obj?.endTime ?? '';
    this.UserId = obj?.userId ?? 0;
    this.PatientId = obj?.patientId ?? 0;
    this.PatientName = obj?.patientName ?? '';
    this.DoctorName = obj?.doctorName ?? '';
  }
}
