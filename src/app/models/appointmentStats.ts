interface IAppointmentStats {
  total: number;
  pending: number;
  todaystotal: number;
  todayspending: number;
}
export class AppointmentStats implements IAppointmentStats {
  total: number = 0;
  pending: number = 0;
  todaystotal: number = 0;
  todayspending: number = 0;
  constructor(obj?: any) {
    this.pending = obj?.pending ?? 0;
    this.total = obj?.total ?? 0;
    this.todayspending = obj?.todayPending ?? 0;
    this.todaystotal = obj?.todayTotal ?? 0;
  }
}
