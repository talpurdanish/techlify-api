import { User } from 'src/app/models/users';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { AppointmentService } from './../../../services/appointment.service';
import { Appointment } from './../../../models/details/appointment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctions } from './../../../helper/common.function';
import { Filter } from './../../../helper/filter';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';

import { Result } from 'src/app/models/result';

import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Roles } from 'src/app/models/Roles';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';

@Component({
  selector: 'app-ViewAppointments',
  templateUrl: './ViewAppointments.component.html',
  styleUrls: ['./ViewAppointments.component.css'],
})
export class ViewAppointmentsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  appointments: Appointment[] = [];
  appointmentsSrc: Appointment[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedAppointment: Appointment;
  filterForm: FormGroup;
  currentUser: Login = new Login();

  mainForm: FormGroup;
  isSubmitted: boolean = false;
  result: Result;
  doctorsList: { Id: any; Name: string }[] = [];
  patientsList: { Id: any; Name: string }[] = [];

  constructor(
    public appointmentService: AppointmentService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private patientService: PatientService
  ) {
    this.filterForm = this.formBuilder.group({
      term: ['', [Validators.required]],
    });

    this.createForm();
    this.FillDoctorsList();
    this.FillPatientsList();
  }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();

      this.isAdmin = this.currentUser.role == Roles.Administrator;
      this.isDoctor = this.currentUser.role == Roles.Doctor;
      this.isStaff = this.currentUser.role == Roles.Staff;
    } else {
      this.router.navigate(['/login']);
    }
  }

  get Term() {
    return this.filterForm.get('term');
  }

  getPageNumber(firstRow: number, rows: number): number {
    let page = 1;
    if (firstRow != 0 && rows > 0) {
      page = Math.ceil(rows / firstRow) + 1;
    }

    return page;
  }

  applyFilterGlobal(term: string) {
    this.dt!.filterGlobal(term, 'contains');
  }

  count = 0;

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.appointments = [];
    this.appointmentsSrc = [];
    this.i = 0;
    var filter: Filter;

    if (event != null) {
      let jsonObj = JSON.stringify(event.filters);
      let global = JSON.parse(jsonObj);
      let searchTerm = '';
      if (global.global != undefined) {
        searchTerm = global.global.value;
      }

      let sortField =
        event.sortField == undefined ? 10 : Number.parseInt(event.sortField);
      let sortOrder = event.sortOrder == undefined ? 1 : event.sortOrder;

      filter = new Filter(searchTerm, 1, sortField, sortOrder);
    }
    this.appointmentService.getAppointments(filter).subscribe({
      next: (data) => {
        var jsonObj = JSON.stringify(data.results);
        var uData = JSON.parse(jsonObj);
        for (const prop in uData) {
          let jsonObj = JSON.stringify(uData[prop]);
          var obj = JSON.parse(jsonObj);
          var appt = new Appointment(obj);

          this.appointmentsSrc.push(appt);
        }
        if (this.appointmentsSrc && event != null) {
          this.appointments = this.appointmentsSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.appointments = this.appointmentsSrc;
        }
        this.loading = false;
        this.totalRecords = this.appointmentsSrc.length;
        if (event == null) this.dt.reset();
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.appointments = [];
        this.appointmentsSrc = [];
        this.loading = false;
        this.totalRecords = this.appointmentsSrc.length;
      },
    });
  }

  resetAppointments(): void {
    this.appointments = [];
    this.appointmentsSrc = [];
    this.i = 0;
  }

  Manage(id: number, appt: Appointment): void {
    if (this.isAdmin || this.isStaff)
      switch (id) {
        case 1:
          this.router.navigate(['/CreateAppointment/' + appt.id]);
          break;

        case 3:
        case 4:
          break;
        case 5:
          this.Delete(appt.id);
          break;
      }
  }

  Delete(id: number): void {
    if (this.isAdmin || this.isStaff)
      this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.appointmentService.deleteAppointment(id).subscribe({
            next: (data) => {
              let results = new Result(data);
              this.messageService.add({
                severity: results.success ? 'success' : 'error',
                summary: 'FMDC',
                detail: results.message,
              });
              if (results.success) this.load(null);
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
        },
        reject: () => {},
      });
  }

  createForm() {
    this.mainForm = this.formBuilder.group({
      userId: ['', [Validators.required]],
      patientId: ['', [Validators.required]],
    });
  }

  get userId() {
    return this.mainForm.get('userId');
  }
  get patientId() {
    return this.mainForm.get('patientId');
  }

  FillDoctorsList(): void {
    if (this.isAdmin || this.isStaff) {
      this.doctorsList = [];
      this.userService.getDoctors().subscribe({
        next: (output) => {
          let results = new Result(output);
          var data = results.results;
          for (const prop in data) {
            let jsonObj = JSON.stringify(data[prop]);
            var userObj = JSON.parse(jsonObj);

            var doctor = { Id: userObj.id, Name: userObj.value };

            this.doctorsList.push(doctor);
          }
        },
      });
    }
  }
  FillPatientsList(): void {
    if (this.isAdmin || this.isStaff) {
      this.patientsList = [];
      this.patientService.getPatients(null).subscribe({
        next: (output) => {
          let results = new Result(output);
          var data = results.results;
          for (const prop in data) {
            let jsonObj = JSON.stringify(data[prop]);
            var obj = JSON.parse(jsonObj);

            var patient = { Id: obj.id, Name: obj.name };

            this.patientsList.push(patient);
          }
        },
      });
    }
  }

  validationErrors: AllValidationErrors[] = [];
  totalErrors: number;
  onSubmit(): void {
    this.validationErrors = AllValidationErrors.getFormValidationErrors(
      this.mainForm.controls
    );
    this.totalErrors = this.validationErrors.length;
    if (this.isAdmin || this.isStaff) {
      this.isSubmitted = true;
      if (this.mainForm.dirty && this.mainForm.valid) {
        var fUserId = this.userId.value;
        var fPatientId = this.patientId.value;

        this.appointmentService.addAppointment(fUserId, fPatientId).subscribe({
          next: (data) => {
            this.result = new Result(data);
            this.messageService.add({
              severity: this.result.success ? 'success' : 'error',
              summary: 'FMDC',
              detail: this.result.message,
            });
            this.isSubmitted = false;
            this.load(null);
            this.FillPatientsList();
          },
          error: (err) => {
            this.result = new Result(err);
            this.messageService.add({
              severity: this.result.success ? 'success' : 'error',
              summary: 'FMDC',
              detail: this.result.message,
            });
            this.isSubmitted = false;
          },
        });
      }
    }
  }
}
