import { MedicationTypes } from 'src/app/models/medicationType';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Filter } from '../../../helper/filter';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';

import { Result } from 'src/app/models/result';

import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MedicationTypeService } from 'src/app/services/medicationtype.service';
import { Roles } from 'src/app/models/Roles';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';

@Component({
  selector: 'app-ViewMedicationTypes',
  templateUrl: './ViewMedicationTypes.component.html',
  styleUrls: ['./ViewMedicationTypes.component.css'],
})
export class ViewMedicationTypesComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  medicationTypes: MedicationTypes[] = [];
  medicationTypesSrc: MedicationTypes[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedMedicationTypes: MedicationTypes;
  filterForm: FormGroup;
  currentUser: Login = new Login();

  mainForm: FormGroup;
  isSubmitted: boolean = false;
  result: Result;
  doctorsList: { Id: any; Name: string }[] = [];
  patientsList: { Id: any; Name: string }[] = [];
  isAdmin = false;
  isDoctor = false;
  isStaff = false;

  constructor(
    public medicationTypeService: MedicationTypeService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.formBuilder.group({
      term: ['', [Validators.required]],
    });

    this.createForm();
  }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.isAdmin = this.currentUser.role == Roles.Administrator;
      this.isDoctor = this.currentUser.role == Roles.Doctor;
      this.isStaff = this.currentUser.role == Roles.Staff;
      if (!this.isAdmin && !this.isStaff) {
        this.router.navigate(['/']);
      }
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
    this.medicationTypes = [];
    this.medicationTypesSrc = [];
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
    this.medicationTypeService.getMedicationTypes(filter).subscribe({
      next: (data) => {
        var jsonObj = JSON.stringify(data.results);
        var uData = JSON.parse(jsonObj);
        for (const prop in uData) {
          let jsonObj = JSON.stringify(uData[prop]);
          var obj = JSON.parse(jsonObj);
          var appt = new MedicationTypes(obj);

          this.medicationTypesSrc.push(appt);
        }
        if (this.medicationTypesSrc && event != null) {
          this.medicationTypes = this.medicationTypesSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.medicationTypes = this.medicationTypesSrc;
        }
        this.loading = false;
        this.totalRecords = this.medicationTypesSrc.length;
        if (event == null) this.dt.reset();
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.medicationTypes = [];
        this.medicationTypesSrc = [];
        this.loading = false;
        this.totalRecords = this.medicationTypesSrc.length;
      },
    });
  }

  resetMedicationTypess(): void {
    this.medicationTypes = [];
    this.medicationTypesSrc = [];
    this.i = 0;
  }

  Manage(id: number, type: MedicationTypes): void {
    if (this.isAdmin || this.isStaff)
      switch (id) {
        case 1:
          this.mainForm.patchValue({
            id: type.id,
            name: type.Name,
          });
          break;

        case 2:
          this.Delete(type.id);
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
          this.medicationTypeService.deleteMedicationType(id).subscribe({
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
      id: [''],
      name: ['', [Validators.required]],
    });
  }

  get id() {
    return this.mainForm.get('id');
  }
  get name() {
    return this.mainForm.get('name');
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
        var fId = this.id.value;
        var fName = this.name.value;

        this.medicationTypeService.createOrUpdate(fId, fName).subscribe({
          next: (data) => {
            let result = new Result(data);
            this.messageService.add({
              severity: result.success ? 'success' : 'error',
              summary: 'FMDC',
              detail: result.message,
            });
            if (result.success) {
              this.mainForm.reset();
              this.isSubmitted = false;
              this.load(null);
            }
          },
          error: (err) => {
            let result = new Result(err);
            this.messageService.add({
              severity: result.success ? 'success' : 'error',
              summary: 'FMDC',
              detail: result.message,
            });
            this.isSubmitted = false;
          },
        });
      }
    }
  }
}
