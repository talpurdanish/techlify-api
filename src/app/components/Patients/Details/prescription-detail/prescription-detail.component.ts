import { Prescription } from 'src/app/models/details/prescription';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PatientService } from 'src/app/services/patient.service';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Result } from 'src/app/models/result';
import { Table } from 'primeng/table';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SlipComponent } from '../../Slip/Slip.component';

@Component({
  selector: 'app-prescription-detail',
  templateUrl: './prescription-detail.component.html',
  styleUrls: ['./prescription-detail.component.css'],
})
export class PrescriptionDetailComponent implements OnInit {
  @Input('PatientId') PatientId = -1;
  @ViewChild('dt') dt: Table | undefined;
  prescriptions: Prescription[] = [];
  prescriptionSrc: Prescription[] = [];
  totalRecords: number;
  loading: boolean;
  ref: DynamicDialogRef;
  constructor(
    private prescriptionService: PrescriptionService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {}

  count = 0;

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.prescriptions = [];
    this.prescriptionSrc = [];

    this.prescriptionService.getPatientPrescriptions(this.PatientId).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var userObj = JSON.parse(jsonObj);
          var prescription = new Prescription(userObj);
          this.prescriptionSrc.push(prescription);
        }

        if (this.prescriptionSrc && event != null) {
          this.prescriptions = this.prescriptionSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.prescriptions = this.prescriptionSrc;
        }
        this.loading = false;
        this.totalRecords = this.prescriptionSrc.length;
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
    this.ref = this.dialogService.open(SlipComponent, {
      header: 'View Prescription',
      data: {
        id: id,
        type: 2,
      },
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }
}
