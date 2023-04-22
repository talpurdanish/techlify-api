import { Reciept } from './../../../../models/details/reciept';

import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PatientService } from 'src/app/services/patient.service';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Result } from 'src/app/models/result';
import { Table } from 'primeng/table';
import { CommonFunctions } from 'src/app/helper/common.function';
import { Filter } from 'src/app/helper/filter';
import { RecieptsService } from 'src/app/services/reciept.service';
import { RecieptReportComponent } from 'src/app/components/Reciepts/reciept-report/reciept-report.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-reciept-detail',
  templateUrl: './reciept-detail.component.html',
  styleUrls: ['./reciept-detail.component.css'],
})
export class RecieptDetailComponent implements OnInit {
  @Input('PatientId') PatientId = -1;
  @ViewChild('dt') dt: Table | undefined;
  reciepts: Reciept[] = [];
  recieptSrc: Reciept[] = [];
  totalRecords: number;
  loading: boolean;
  ref: DynamicDialogRef;
  constructor(
    private recieptService: RecieptsService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {}

  count = 0;

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.reciepts = [];
    this.recieptSrc = [];
    this.recieptService.getPatientReciepts(this.PatientId).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (var prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var obj = JSON.parse(jsonObj);
          var reciept = new Reciept(obj);
          this.recieptSrc.push(reciept);
        }

        if (this.recieptSrc && event != null) {
          this.reciepts = this.recieptSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.reciepts = this.recieptSrc;
        }
        this.loading = false;
        this.totalRecords = this.recieptSrc.length;
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
    this.ref = this.dialogService.open(RecieptReportComponent, {
      header: 'View Reciept',
      data: {
        id: id,
      },
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }
}
