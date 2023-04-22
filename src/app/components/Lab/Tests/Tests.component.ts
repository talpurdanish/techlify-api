import { Test } from '../../../models/Lab/Tests';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { TestService } from 'src/app/services/test.service';
import { Roles } from 'src/app/models/Roles';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';

@Component({
  selector: 'app-Tests',
  templateUrl: './Tests.component.html',
  styleUrls: ['./Tests.component.css'],
})
export class TestsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  tests: Test[] = [];
  testsSrc: Test[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedTest: Test = new Test();
  filterForm: FormGroup;
  currentUser: Login = new Login();

  mainForm: FormGroup;
  isSubmitted: boolean = false;
  typesList: { id: any; Name: string }[] = [];
  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  constructor(
    public testService: TestService,
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
    this.tests = [];
    this.testsSrc = [];
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
    this.testService.getTests(filter).subscribe({
      next: (data) => {
        var jsonObj = JSON.stringify(data.results);
        var uData = JSON.parse(jsonObj);
        for (const prop in uData) {
          let jsonObj = JSON.stringify(uData[prop]);
          var obj = JSON.parse(jsonObj);
          var appt = new Test(obj);

          this.testsSrc.push(appt);
        }
        if (this.testsSrc && event != null) {
          this.tests = this.testsSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.tests = this.testsSrc;
        }
        this.loading = false;
        this.totalRecords = this.testsSrc.length;
        if (event == null) this.dt.reset();
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.tests = [];
        this.testsSrc = [];
        this.loading = false;
        this.totalRecords = this.testsSrc.length;
      },
    });
  }

  resetTests(): void {
    this.tests = [];
    this.testsSrc = [];
    this.i = 0;
  }

  reset(event) {
    this.mainForm.reset();

    this.isSubmitted = false;

    event.preventDefault();
  }

  Manage(id: number, test: Test): void {
    switch (id) {
      case 1:
        this.mainForm.patchValue({
          id: test.id,
          name: test.Name,
          description: test.Description,
        });
        break;
      case 2:
        this.Delete(test.id);
        break;
    }
  }

  Delete(id: number): void {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.testService.deleteTest(id).subscribe({
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
      description: ['', [Validators.maxLength(1000)]],
    });
  }

  get id() {
    return this.mainForm.get('id');
  }
  get name() {
    return this.mainForm.get('name');
  }

  get description() {
    return this.mainForm.get('description');
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
      var fid = this.id.value;
      var fName = this.name.value;
      var fDescription = this.description.value;
      this.testService.createOrUpdate(fid, fName, fDescription).subscribe({
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
