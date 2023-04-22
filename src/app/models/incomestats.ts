interface IIncomeStats {
  Todays: number;
  Total: number;
  Labels: string[];
  Data: number[];
}
export class Incomestats {
  Todays: number;
  Total: number;
  Labels: string[] = [];
  Data: number[] = [];

  constructor(obj?: any) {
    this.Todays = obj?.todays ?? 0;
    this.Total = obj?.total ?? 0;
    this.Labels = obj?.labels ?? [];
    this.Data = obj?.data ?? [];
  }
}
