import { TestParameter } from '../../../models/Lab/TestParameter';
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
import { TestParameterService } from 'src/app/services/test-parameter.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { TestService } from 'src/app/services/test.service';
import { ValidationService } from 'src/app/services/Validation.service';
import { Roles } from 'src/app/models/Roles';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';
@Component({
  selector: 'app-testparameters',
  templateUrl: './testparameters.component.html',
  styleUrls: ['./testparameters.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: '0%' }),
        animate('500ms ease-in', style({ opacity: '100%' })),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: '0%' })),
      ]),
    ]),
  ],
})
export class TestParametersComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  testParameters: TestParameter[] = [];
  testParametersSrc: TestParameter[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedTestParameter: TestParameter;
  filterForm: FormGroup;
  currentUser: Login = new Login();

  mainForm: FormGroup;
  isSubmitted: boolean = false;
  testsList: { id: any; Name: string }[] = [];

  showFemaleValue: boolean = false;

  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  constructor(
    private testParameterService: TestParameterService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private testService: TestService
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
      this.fillTests();
    } else {
      this.router.navigate(['/login']);
    }
  }

  onChange(event: any) {
    this.showFemaleValue = event.target.checked;
  }

  fillTests() {
    if (this.isAdmin || this.isStaff)
      this.testService.getTests(null).subscribe({
        next: (data) => {
          var jsonObj = JSON.stringify(data.results);
          var uData = JSON.parse(jsonObj);
          for (const prop in uData) {
            let jsonObj = JSON.stringify(uData[prop]);
            var obj = JSON.parse(jsonObj);
            var appt = { id: obj.id, Name: obj.name };

            this.testsList.push(appt);
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
    this.testParameters = [];
    this.testParametersSrc = [];
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
    this.testParameterService.getTestParameters(filter).subscribe({
      next: (data) => {
        var jsonObj = JSON.stringify(data.results);
        var uData = JSON.parse(jsonObj);
        for (const prop in uData) {
          let jsonObj = JSON.stringify(uData[prop]);
          var obj = JSON.parse(jsonObj);
          var appt = new TestParameter(obj);

          this.testParametersSrc.push(appt);
        }
        if (this.testParametersSrc && event != null) {
          this.testParameters = this.testParametersSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.testParameters = this.testParametersSrc;
        }
        this.loading = false;
        this.totalRecords = this.testParametersSrc.length;
        if (event == null) this.dt.reset();
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.testParameters = [];
        this.testParametersSrc = [];
        this.loading = false;
        this.totalRecords = this.testParametersSrc.length;
      },
    });
  }

  resetTestParameters(): void {
    this.testParameters = [];
    this.testParametersSrc = [];
    this.i = 0;
  }

  reset(event) {
    this.mainForm.reset();
    this.isSubmitted = false;
    event.preventDefault();
  }

  Manage(id: number, testParameter: TestParameter): void {
    if (this.isAdmin || this.isStaff)
      switch (id) {
        case 1:
          this.mainForm.patchValue({
            id: testParameter.id,
            name: testParameter.Name,
            maleMaxValue: testParameter.MaleMaxValue,
            maleMinValue: testParameter.MaleMinValue,
            femaleMaxValue: testParameter.FemaleMaxValue,
            femaleMinValue: testParameter.FemaleMinValue,
            unit: testParameter.Unit,
            value: testParameter.Value,
            testId: testParameter.TestId,
            referenceRange: testParameter.ReferenceRange,
            gender: testParameter.Gender,
            status: testParameter.Status,
          });
          break;
        case 2:
          this.Delete(testParameter.id);
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
          this.testParameterService.deleteTestParameter(id).subscribe({
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
      name: ['', [Validators.required, Validators.maxLength(250)]],
      maleMinValue: ['', [Validators.required]],
      maleMaxValue: [
        '',
        [Validators.required, ValidationService.greaterThan('maleMinValue')],
      ],
      femaleMinValue: [''],
      femaleMaxValue: [
        '',
        [ValidationService.greaterThan('femaleMinValue', 'gender')],
      ],
      unit: ['', [Validators.required]],
      testId: ['', [Validators.required]],
      referenceRange: [''],
      gender: [''],
      status: [''],
    });
  }

  get id() {
    return this.mainForm.get('id');
  }
  get name() {
    return this.mainForm.get('name');
  }
  get maleMaxValue() {
    return this.mainForm.get('maleMaxValue');
  }
  get maleMinValue() {
    return this.mainForm.get('maleMinValue');
  }
  get femaleMaxValue() {
    return this.mainForm.get('femaleMaxValue');
  }
  get femaleMinValue() {
    return this.mainForm.get('femaleMinValue');
  }
  get unit() {
    return this.mainForm.get('unit');
  }
  get testId() {
    return this.mainForm.get('testId');
  }
  get referenceRange() {
    return this.mainForm.get('referenceRange');
  }
  get gender() {
    return this.mainForm.get('gender');
  }
  get status() {
    return this.mainForm.get('status');
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
        const fName = this.name.value;
        const fMaleMaxValue = this.maleMaxValue.value;
        const fMaleMinValue = this.maleMinValue.value;
        const fFemaleMaxValue = this.gender.value
          ? this.femaleMaxValue.value
          : 0;
        const fFemaleMinValue = this.gender.value
          ? this.femaleMinValue.value
          : 0;
        const fUnit = this.unit.value;
        const fTestId = this.testId.value;
        const fReferenceRange = this.referenceRange.value;
        this.testParameterService
          .createOrUpdate(
            fId,
            fName,
            fMaleMaxValue,
            fMaleMinValue,
            fFemaleMaxValue,
            fFemaleMinValue,
            fUnit,
            fTestId,
            fReferenceRange
          )
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
}
