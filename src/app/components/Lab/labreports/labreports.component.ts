import { Report } from '../../../models/details/report';

import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Result } from 'src/app/models/result';
import { Table } from 'primeng/table';
import { LabReportService } from 'src/app/services/labreport.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Login } from 'src/app/models/login';
import { CommonFunctions } from 'src/app/helper/common.function';
import { Filter } from 'src/app/helper/filter';
import { ReportComponent } from '../report/report.component';
import { TestService } from 'src/app/services/test.service';
import { UserService } from 'src/app/services/user.service';
import { PatientService } from 'src/app/services/patient.service';
import { Roles } from 'src/app/models/Roles';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';

@Component({
  selector: 'app-labreports',
  templateUrl: './labreports.component.html',
  styleUrls: ['./labreports.component.css'],
})
export class LabreportsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  reports: Report[] = [];
  reportSrc: Report[] = [];
  i = 0;
  selectedId: number = 0;
  showUpdate: boolean = false;
  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedReport: Report;
  filterForm: FormGroup;
  currentUser: Login = new Login();

  isAdmin = false;
  isDoctor = false;
  isStaff = false;

  currentDate: Date = new Date();

  constructor(
    private reportService: LabReportService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private testService: TestService,
    private userService: UserService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.isAdmin = this.currentUser.role == Roles.Administrator;
      this.isDoctor = this.currentUser.role == Roles.Doctor;
      this.isStaff = this.currentUser.role == Roles.Staff;
      this.filterForm = this.formBuilder.group({
        term: ['', [Validators.required]],
      });
      this.initForm();
    } else {
      this.router.navigate(['/login']);
    }
  }

  count = 0;
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
  load(event: LazyLoadEvent) {
    this.loading = true;
    this.reports = [];
    this.reportSrc = [];
    this.i = 0;
    var filter: Filter;

    if (event != null) {
      let jsonObj = JSON.stringify(event.filters);
      let global = JSON.parse(jsonObj);
      if (global.global != undefined) {
        filter = new Filter(
          global.global.value,
          1,
          CommonFunctions.ComputeField(event.sortField),
          event.sortOrder
        );
      }
    }
    this.reportService.getLabReports(filter).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;

        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var userObj = JSON.parse(jsonObj);
          var patient = new Report(userObj);

          this.reportSrc.push(patient);
          // this.selectedReport = patient;
          // this.updatePicture();
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
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.reports = [];
        this.reportSrc = [];
        this.loading = false;
        this.totalRecords = this.reportSrc.length;
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

  completeReport(event) {
    if (this.isAdmin || this.isStaff)
      if (
        this.selectedReport != null &&
        this.selectedReport.Status !== 'Completed'
      ) {
        this.showUpdate = false;
        this.selectedId = this.selectedReport.id;
        this.showUpdate = true;
      }
  }

  reloadTable(event): void {
    if (this.isAdmin || this.isStaff)
      if (event) {
        this.load(null);
        this.showUpdate = false;
      }
  }

  deliveryDateChanged(value: any) {
    let date = new Date(value);

    if (value != '') {
      const time = date.getHours() + ':' + date.getMinutes();
      console.log(time);
      this.deliveryTime.patchValue(time[1]);
    }
  }

  // reports forms methods and variables
  tests: { id: any; Name: any }[] = [];
  patients: { id: any; Name: any }[] = [];
  doctors: { id: any; Name: any }[] = [];

  mainForm: FormGroup;
  isSubmitted = false;
  minDateValue: Date = new Date();

  initForm() {
    this.populateDoctors();
    this.populateTests();
    this.populatePatients();
    this.createForm();
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

      if (this.mainForm.dirty && this.isSubmitted) {
        const fDeliveryDate = this.deliveryDate.value;
        const fReportTime = this.deliveryTime.value;
        const fTestId = this.testId.value;
        const fPatientId = this.patientId.value;
        const fDoctorId = this.doctorId.value;
        console.log(fDeliveryDate);
        this.reportService
          .createOrUpdate(
            -1,
            fDeliveryDate,
            CommonFunctions.changeTimeFormat(fReportTime),
            fPatientId,
            fDoctorId,
            fTestId
          )
          .subscribe({
            next: (data) => {
              let results = new Result(data);
              this.messageService.add({
                severity: results.success ? 'success' : 'error',
                summary: 'FMDC',
                detail: results.message,
              });
              if (results.success) {
                this.load(null);
                this.mainForm.reset();
              }
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
  }

  createForm() {
    this.mainForm = this.formBuilder.group({
      deliveryDate: ['', [Validators.required]],
      deliveryTime: ['', [Validators.required]],
      testId: ['', [Validators.required]],
      patientId: ['', [Validators.required]],
      doctorId: ['', [Validators.required]],
      note: ['', [Validators.maxLength(1000)]],
    });
  }
  get deliveryDate() {
    return this.mainForm.get('deliveryDate');
  }
  get deliveryTime() {
    return this.mainForm.get('deliveryTime');
  }
  get testId() {
    return this.mainForm.get('testId');
  }
  get patientId() {
    return this.mainForm.get('patientId');
  }
  get doctorId() {
    return this.mainForm.get('doctorId');
  }
  get note() {
    return this.mainForm.get('note');
  }

  populateTests() {
    if (this.isAdmin || this.isStaff)
      this.testService.getTests(null).subscribe({
        next: (data) => {
          var jsonObj = JSON.stringify(data.results);
          var uData = JSON.parse(jsonObj);
          for (const prop in uData) {
            let jsonObj = JSON.stringify(uData[prop]);
            var obj = JSON.parse(jsonObj);
            var test = { id: obj.id, Name: obj.name };

            this.tests.push(test);
          }
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

  populateDoctors() {
    if (this.isAdmin || this.isStaff)
      this.userService.getDoctors().subscribe({
        next: (data) => {
          var jsonObj = JSON.stringify(data.results);
          var uData = JSON.parse(jsonObj);
          for (const prop in uData) {
            let jsonObj = JSON.stringify(uData[prop]);
            var obj = JSON.parse(jsonObj);
            var test = { id: obj.id, Name: obj.value };

            this.doctors.push(test);
          }
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

  populatePatients() {
    if (this.isAdmin || this.isStaff)
      this.patientService.getPatients(null).subscribe({
        next: (data) => {
          var jsonObj = JSON.stringify(data.results);
          var uData = JSON.parse(jsonObj);
          for (const prop in uData) {
            let jsonObj = JSON.stringify(uData[prop]);
            var obj = JSON.parse(jsonObj);
            var test = { id: obj.id, Name: obj.name };

            this.patients.push(test);
          }
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
