import { AppointmentService } from './../../../services/appointment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctions } from './../../../helper/common.function';
import { Filter } from './../../../helper/filter';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, LazyLoadEvent, MenuItem } from 'primeng/api';

import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Patient } from 'src/app/models/patient';
import { Login } from 'src/app/models/login';

import { Result } from 'src/app/models/result';

import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Patientsbuttons } from 'src/app/models/patientsbuttons';
import { Roles } from 'src/app/models/Roles';

@Component({
  selector: 'app-view-Patients',
  templateUrl: './view-Patients.component.html',
  styleUrls: ['./view-Patients.component.css'],
})
export class ViewPatientComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dt') dt: Table | undefined;
  Patients: Patient[] = [];
  PatientsSource: Patient[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedPatient: Patient;
  filterForm: FormGroup;
  items: MenuItem[];

  ngOnDestroy(): void {}
  currentUser: Login = new Login();
  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  constructor(
    public patientService: PatientService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.isAdmin = this.currentUser.role == Roles.Administrator;
      this.isDoctor = this.currentUser.role == Roles.Doctor;
      this.isStaff = this.currentUser.role == Roles.Staff;
      this.filterForm = this.formBuilder.group({
        term: ['', [Validators.required]],
      });
      this.addMenuItems();
    } else {
      this.router.navigate(['/login']);
    }
  }

  reloadTable(value: boolean) {
    if (value) this.loadPatients(null);
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

  addMenuItems() {
    if (this.isAdmin || this.isStaff) {
      this.items = [
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          command: () => this.ManagePatient(1, this.selectedPatient),
        },
        {
          label: 'Details',
          icon: 'pi pi-fw pi-chevron-circle-right',
          command: () => this.ManagePatient(2, this.selectedPatient),
        },

        {
          label: 'Delete',
          icon: 'pi pi-fw pi-times',
          command: () => this.ManagePatient(3, this.selectedPatient),
        },
      ];
    } else {
      this.items = [
        {
          label: 'Details',
          icon: 'pi pi-fw pi-chevron-circle-right',
          command: () => this.ManagePatient(2, this.selectedPatient),
        },
      ];
    }
  }

  count = 0;

  loadPatients(event: LazyLoadEvent) {
    this.loading = true;
    this.Patients = [];
    this.PatientsSource = [];
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
    this.patientService.getPatients(filter).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var userObj = JSON.parse(jsonObj);
          var patient = new Patient(userObj);

          this.PatientsSource.push(patient);
          // this.selectedPatient = patient;
          // this.updatePicture();
        }
        if (this.PatientsSource && event != null) {
          this.Patients = this.PatientsSource.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.Patients = this.PatientsSource;
        }
        this.loading = false;
        this.totalRecords = this.PatientsSource.length;
        if (event == null) this.dt.reset();
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.Patients = [];
        this.PatientsSource = [];
        this.loading = false;
        this.totalRecords = this.PatientsSource.length;
      },
    });
  }

  getPatients(): void {
    if (this.isAdmin || this.isStaff) this.Patients = [];
    this.PatientsSource = [];
    this.i = 0;
  }

  updatePicture(): void {
    if (this.isAdmin || this.isStaff)
      if (
        this.PatientsSource[this.i].Picture != '' &&
        this.PatientsSource[this.i].Picture !== undefined &&
        this.PatientsSource[this.i].ImageType != '' &&
        this.PatientsSource[this.i].ImageType !== undefined
      ) {
        this.PatientsSource[this.i].Picturesrc = this.convertToImage(
          this.PatientsSource[this.i].Picture,
          this.PatientsSource[this.i].ImageType || 'image/jpeg'
        );
        this.PatientsSource[this.i].hasImage = true;
      } else {
        this.PatientsSource[this.i].Picturesrc =
          '../../../../assets/images/profile.png';
        this.PatientsSource[this.i].hasImage = false;
      }
    this.i = this.i + 1;
  }

  convertToImage(binary: any, imageType: string): any {
    var slashIndex = binary.indexOf('base64');
    var base64 = true;
    if (slashIndex == -1) {
      slashIndex = binary.indexOf('/');
      base64 = false;
    }
    const newIndex = slashIndex + (base64 ? 6 : 0);
    const newBinary = binary.substring(newIndex, binary.length - newIndex);

    const str = 'data:' + imageType + ';base64,' + newBinary;

    return str;
  }

  ngAfterViewInit(): void {}

  ManagePatient(id: number, Patient: Patient): void {
    switch (id) {
      case 1:
        if (this.isAdmin || this.isStaff)
          this.router.navigate(['/CreatePatient/' + Patient.id]);
        break;
      case 2:
        this.router.navigate(['/PatientDetails/' + Patient.id]);
        break;
      case 3:
      case 4:
        break;
      case 5:
        if (this.isAdmin || this.isStaff) this.Delete(Patient.id);
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
          this.patientService.deletePatient(id).subscribe({
            next: (data) => {
              let results = new Result(data);
              this.messageService.add({
                severity: results.success ? 'success' : 'error',
                summary: 'FMDC',
                detail: results.message,
              });
              if (results.success) this.loadPatients(null);
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
}
