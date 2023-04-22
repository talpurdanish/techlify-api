import { LabReportService } from './../../../services/labreport.service';
import { LabReport } from './../../../models/Lab/LabReport';
import { LazyLoadEvent, MessageService } from 'primeng/api';

import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Result } from 'src/app/models/result';
import { Table } from 'primeng/table';
import { CommonFunctions } from 'src/app/helper/common.function';

@Component({
  selector: 'app-pending-reports',
  templateUrl: './pending-reports.component.html',
  styleUrls: ['./pending-reports.component.css'],
})
export class PendingReportsComponent implements OnInit {
  @Output() UpdatePendingCount = new EventEmitter<number>();
  @ViewChild('dt') dt: Table | undefined;

  labReports: LabReport[] = [];
  labReportSrc: LabReport[] = [];
  totalRecords: number;
  loading: boolean;
  constructor(
    private reportService: LabReportService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  count = 0;

  updatePendingCount(value: number) {
    this.UpdatePendingCount.emit(value);
  }

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.labReports = [];
    this.labReportSrc = [];

    this.reportService.getPendingLabReports().subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var obj = JSON.parse(jsonObj);
          var apt = new LabReport(obj);

          this.labReportSrc.push(apt);
        }
        this.updatePendingCount(this.labReportSrc.length);
        if (this.labReportSrc && event != null) {
          this.labReports = this.labReportSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.labReports = this.labReportSrc;
        }
        this.loading = false;
        this.totalRecords = this.labReportSrc.length;
        if (event == null) this.dt.reset();
      },
      error: (err) => {
        let results = new Result(err);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
      },
    });
  }
}
