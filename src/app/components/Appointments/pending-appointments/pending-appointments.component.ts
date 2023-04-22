import { AppointmentService } from './../../../services/appointment.service';
import { Appointment } from './../../../models/details/appointment';
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
  selector: 'app-pending-appointments',
  templateUrl: './pending-appointments.component.html',
  styleUrls: ['./pending-appointments.component.css'],
})
export class PendingAppointmentsComponent implements OnInit {
  @Output() UpdatePendingCount = new EventEmitter<number>();
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

  updatePendingCount(value: number) {
    this.UpdatePendingCount.emit(value);
  }

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.appointments = [];
    this.appointmentSrc = [];

    this.appointmentService.getPendingAppointments().subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var obj = JSON.parse(jsonObj);
          var apt = new Appointment(obj);
          apt.AppointmentDate = CommonFunctions.ChangeSqlDatetoDate(
            apt.AppointmentDate.toString()
          );
          this.appointmentSrc.push(apt);
        }
        this.updatePendingCount(this.appointmentSrc.length);
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

  addEndDate(id: number) {
    this.appointmentService.addEndDate(id, 'a').subscribe({
      next: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: results.success ? 'success' : 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.load(null);
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
      },
    });
  }
}
