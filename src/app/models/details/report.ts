interface IReport {
  id: number;
  ReportDate: string;
  ReportTime: string;
  ReportDeliveryDate: string;
  ReportDeliveryTime: string;
  TestName: string;
  TestId: number;
  PatientId: number;
  PatientName: string;
  PatientNumber: string;
  Doctor: string;
  DoctorId: number;
  ReportNumber: number;
  ReportNoString: string;
  Status: string;
  Gender: string;
  PatientAge: string;
  PatientGender: string;
  DoctorPMDCNo: string;
  Note: string;
}

export class Report implements IReport {
  public id: number;
  public ReportDate: string;
  public ReportTime: string;
  public ReportDeliveryDate: string;
  public ReportDeliveryTime: string;
  public TestName: string;
  public TestId: number;
  public PatientId: number;
  public PatientName: string;
  public PatientNumber: string;
  public Doctor: string;
  public DoctorId: number;
  public ReportNumber: number;
  public ReportNoString: string;
  public Status: string;
  public Gender: string;
  public PatientAge: string;
  public PatientGender: string;
  public DoctorPMDCNo: string;
  public Note: string;

  constructor(obj?: any) {
    this.id = obj?.id ?? '';
    this.ReportDate = obj?.reportDate ?? '';
    this.ReportTime = obj?.reportTime ?? '';
    this.ReportDeliveryDate = obj?.reportDeliveryDate ?? '';
    this.ReportDeliveryTime = obj?.reportDeliveryTime ?? '';
    this.TestName = obj?.testName ?? '';
    this.TestId = obj?.testId ?? 0;
    this.PatientId = obj?.patientId ?? 0;
    this.PatientName = obj?.patientName ?? '';
    this.PatientNumber = obj?.patientNumber ?? '';
    this.Doctor = obj?.doctor ?? '';
    this.DoctorId = obj?.doctorId ?? 0;
    this.ReportNumber = obj?.reportNumber ?? 0;
    this.ReportNoString = obj?.reportNoString ?? '';
    this.Status = obj?.status ?? '';
    this.Gender = obj?.gender ?? '';
    this.PatientAge = obj?.patientAge ?? '';
    this.PatientGender = obj?.patientGender ?? '';
    this.DoctorPMDCNo = obj?.doctorPMDCNo ?? '';
    this.Note = obj?.note ?? '';
  }
}
