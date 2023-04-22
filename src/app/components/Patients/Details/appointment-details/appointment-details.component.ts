import { AppointmentService } from './../../../../services/appointment.service';
import { Appointment } from './../../../../models/details/appointment';

import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PatientService } from 'src/app/services/patient.service';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Result } from 'src/app/models/result';
import { Table } from 'primeng/table';
import { CommonFunctions } from 'src/app/helper/common.function';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css'],
})
export class AppointmentDetailsComponent implements OnInit {
  @Input('PatientId') PatientId = -1;
  @ViewChild('dt') dt: Table | undefined;
  appointments: Appointment[] = [];
  appointmentSrc: Appointment[] = [];
  totalRecords: number;
  loading: boolean;
  constructor(
    private appointmentService: AppointmentService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  count = 0;

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.appointments = [];
    this.appointmentSrc = [];

    this.appointmentService.getPatientAppointments(this.PatientId).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (var prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var obj = JSON.parse(jsonObj);
          var apt = new Appointment(obj);
          apt.AppointmentDate = CommonFunctions.ChangeSqlDatetoDate(
            apt.AppointmentDate.toString()
          );
          this.appointmentSrc.push(apt);
        }

        if (this.appointmentSrc && event != null) {
          this.appointments = this.appointmentSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.appointments = this.appointmentSrc;
        }
        this.loading = false;
        this.totalRecords = this.appointmentSrc.length;
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
