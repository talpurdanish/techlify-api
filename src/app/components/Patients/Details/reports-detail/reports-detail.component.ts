import { Report } from './../../../../models/details/report';

import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PatientService } from 'src/app/services/patient.service';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Result } from 'src/app/models/result';
import { Table } from 'primeng/table';
import { CommonFunctions } from 'src/app/helper/common.function';
import { Filter } from 'src/app/helper/filter';
import { RecieptsService } from 'src/app/services/reciept.service';
import { LabReportService } from 'src/app/services/labreport.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LabreportsComponent } from 'src/app/components/Lab/labreports/labreports.component';
import { ReportComponent } from 'src/app/components/Lab/report/report.component';

@Component({
  selector: 'app-reports-detail',
  templateUrl: './reports-detail.component.html',
  styleUrls: ['./reports-detail.component.css'],
})
export class ReportsDetailComponent implements OnInit {
  @Input('PatientId') PatientId = -1;
  @ViewChild('dt') dt: Table | undefined;
  reports: Report[] = [];
  reportSrc: Report[] = [];
  totalRecords: number;
  loading: boolean;
  ref: DynamicDialogRef;
  constructor(
    private reportService: LabReportService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {}

  count = 0;

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.reports = [];
    this.reportSrc = [];
    this.reportService.getPatientReports(this.PatientId).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (var prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          this.reportSrc.push(new Report(JSON.parse(jsonObj)));
        }

        if (this.reportSrc && event != null) {
          this.reports = this.reportSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.reports = this.reportSrc;
        }
        this.loading = false;
        this.totalRecords = this.reportSrc.length;
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

  open(id: number) {
    this.ref = this.dialogService.open(ReportComponent, {
      header: 'Test Report',
      data: {
        id: id,
      },
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }
}
