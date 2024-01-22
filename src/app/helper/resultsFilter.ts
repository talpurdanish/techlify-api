export class ReportFilter {
  startDate: string = '';
  endDate: string = '';
  filterByDateRange: boolean = false;
  id: number = 0;

  constructor(
    startDate: string = null,
    endDate: string = null,
    filterByDateRange: boolean = false,
    id: number = -1
  ) {
    this.startDate = startDate ?? this.formatDate(new Date(1900, 1, 1));
    this.endDate = endDate ?? this.formatDate(new Date());
    this.filterByDateRange = filterByDateRange;
    this.id = id;
  }

  public reset(): void {
    this.startDate = new Date(1990, 1, 1).toString();
    this.endDate = Date().toString();
    this.filterByDateRange = false;
    this.id = -1;
  }

  private formatDate(date: Date): string {
    return (
      date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    );
  }
}
