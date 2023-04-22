export class NotificationCountResult {
  Count: number;
}

export class NotificationResult {
  Name: string;
  TranType: TransactionTypes;
  Table: TableTypes;
}

export enum TransactionTypes {
  ADD = 1,
  UPDATE = 2,
  DELETE = 3,
  LOGIN = 4,
  LOGOUT = 5,
}

export enum TableTypes {
  User = 1,
  Patient = 2,
  Prescription = 3,
  PrescriptionType = 4,
  Appointment = 5,
  Medication = 6,
  MedicationType = 7,
  Procedure = 8,
  ProcedureType = 9,
  Todo = 10,
}
