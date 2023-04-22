import { Medication } from '../../../models/medication';
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
import { MedicationService } from 'src/app/services/medication.service';
import { MedicationTypeService } from 'src/app/services/medicationtype.service';
import { Roles } from 'src/app/models/Roles';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';

@Component({
  selector: 'app-ViewMedications',
  templateUrl: './ViewMedications.component.html',
  styleUrls: ['./ViewMedications.component.css'],
})
export class ViewMedicationsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  medications: Medication[] = [];
  medicationsSrc: Medication[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedMedication: Medication;
  filterForm: FormGroup;
  currentUser: Login = new Login();

  mainForm: FormGroup;
  isSubmitted: boolean = false;
  typesList: { id: any; Name: string }[] = [];

  isAdmin = false;
  isDoctor = false;
  isStaff = false;

  constructor(
    public medicationService: MedicationService,
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
      this.FillTypesList();
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
    this.medications = [];
    this.medicationsSrc = [];
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
    this.medicationService.getMedications(filter).subscribe({
      next: (data) => {
        var jsonObj = JSON.stringify(data.results);
        var uData = JSON.parse(jsonObj);
        for (const prop in uData) {
          let jsonObj = JSON.stringify(uData[prop]);
          var obj = JSON.parse(jsonObj);
          var appt = new Medication(obj);

          this.medicationsSrc.push(appt);
        }
        if (this.medicationsSrc && event != null) {
          this.medications = this.medicationsSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.medications = this.medicationsSrc;
        }
        this.loading = false;
        this.totalRecords = this.medicationsSrc.length;
        if (event == null) this.dt.reset();
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.medications = [];
        this.medicationsSrc = [];
        this.loading = false;
        this.totalRecords = this.medicationsSrc.length;
      },
    });
  }

  resetMedications(): void {
    this.medications = [];
    this.medicationsSrc = [];
    this.i = 0;
  }

  reset(event) {
    this.mainForm.reset();

    this.isSubmitted = false;

    event.preventDefault();
  }

  Manage(id: number, medication: Medication): void {
    switch (id) {
      case 1:
        this.mainForm.patchValue({
          code: medication.Code,
          name: medication.Name,
          typeId: medication.TypeId,
          brand: medication.Brand,
          description: medication.Description,
        });
        break;
      case 2:
        this.Delete(medication.Code);
        break;
    }
  }

  Delete(id: number): void {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.medicationService.deleteMedication(id).subscribe({
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

  FillTypesList(): void {
    this.typesList = [];
    this.medicationTypeService.getMedicationTypes(null).subscribe({
      next: (data) => {
        let results = new Result(data);
        var types = results.results;
        for (const prop in types) {
          var pObj = JSON.stringify(types[prop]);
          var type = JSON.parse(pObj);
          this.typesList.push({ id: type.id, Name: type.name });
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

  createForm() {
    this.mainForm = this.formBuilder.group({
      code: [''],
      name: ['', [Validators.required, Validators.maxLength(250)]],
      brand: ['', [Validators.maxLength(1000)]],
      description: ['', [Validators.maxLength(1000)]],
      typeId: ['', [Validators.required]],
    });
  }

  get code() {
    return this.mainForm.get('code');
  }
  get name() {
    return this.mainForm.get('name');
  }
  get brand() {
    return this.mainForm.get('brand');
  }
  get description() {
    return this.mainForm.get('description');
  }

  get typeId() {
    return this.mainForm.get('typeId');
  }
  validationErrors: AllValidationErrors[] = [];
  totalErrors: number;
  onSubmit(): void {
    this.validationErrors = AllValidationErrors.getFormValidationErrors(
      this.mainForm.controls
    );
    this.totalErrors = this.validationErrors.length;

    this.isSubmitted = true;
    if (this.mainForm.dirty && this.mainForm.valid) {
      var fCode = this.code.value;

      var fName = this.name.value;
      var fTypeId = this.typeId.value;
      var fBrand = this.brand.value;
      var fDescription = this.description.value;
      this.medicationService
        .createOrUpdate(fCode, fName, fBrand, fDescription, fTypeId)
        .subscribe({
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
