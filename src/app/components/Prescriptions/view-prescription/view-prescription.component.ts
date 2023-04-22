import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctions } from './../../../helper/common.function';
import { Filter } from './../../../helper/filter';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Prescription } from 'src/app/models/details/prescription';

import { Result } from 'src/app/models/result';

import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SlipComponent } from '../../Patients/Slip/Slip.component';
import { Login } from 'src/app/models/login';
import { Roles } from 'src/app/models/Roles';

@Component({
  selector: 'app-view-prescription',
  templateUrl: './view-prescription.component.html',
  styleUrls: ['./view-prescription.component.css'],
})
export class ViewPrescriptionComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  prescriptions: Prescription[] = [];
  prescriptionsSource: Prescription[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedPrescription: Prescription = new Prescription();
  filterForm: FormGroup;
  show: boolean = false;

  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  currentUser: Login = new Login();
  ngOnDestroy(): void {}

  constructor(
    public prescriptionService: PrescriptionService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
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
    } else {
      this.router.navigate(['/login']);
    }
    this.show = false;
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
    this.prescriptions = [];
    this.prescriptionsSource = [];
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
    this.prescriptionService.getPrescriptions(filter).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var obj = JSON.parse(jsonObj);
          var prescription = new Prescription(obj);

          this.prescriptionsSource.push(prescription);
          // this.selectedPrescription = prescription;
        }
        if (this.prescriptionsSource && event != null) {
          this.prescriptions = this.prescriptionsSource.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.prescriptions = this.prescriptionsSource;
        }
        this.loading = false;
        this.totalRecords = this.prescriptionsSource.length;
        if (this.totalRecords == 0) {
          this.selectedPrescription = null;
          this.show = false;
        }
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.prescriptions = [];
        this.prescriptionsSource = [];
        this.loading = false;
        this.totalRecords = this.prescriptionsSource.length;
      },
    });
  }

  reset(): void {
    this.prescriptions = [];
    this.prescriptionsSource = [];
    this.i = 0;
  }

  ngAfterViewInit(): void {}

  open(prescriptionid: number) {
    this.ref = this.dialogService.open(SlipComponent, {
      header: 'View Prescription',
      data: {
        id: prescriptionid,
        type: 2,
      },
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }
  //1 print
  //2 pay
  //3 delete
  Manage(id: number, prescription: Prescription): void {
    if (prescription.id > 0)
      switch (id) {
        case 1:
          this.open(prescription.id);
          break;

        case 3:
          this.Delete(prescription.id);
          break;
      }
  }

  showDetails() {
    if (this.selectedPrescription != null) {
      this.show = true;
    }
  }

  Delete(id: number): void {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.prescriptionService.deletePrescription(id).subscribe({
          next: (data) => {
            let results = new Result(data);
            this.messageService.add({
              severity: 'success',
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
      },
      reject: () => {},
    });
  }
}
