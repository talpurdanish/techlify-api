import { ProcedureTypes } from './../../../models/procedureType';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { ProcedureTypeService } from 'src/app/services/proceduretype.service';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';

@Component({
  selector: 'app-ViewProcedureTypes',
  templateUrl: './ViewProcedureTypes.component.html',
  styleUrls: ['./ViewProcedureTypes.component.css'],
})
export class ViewProcedureTypesComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  procedureTypes: ProcedureTypes[] = [];
  procedureTypesSrc: ProcedureTypes[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedProcedureTypes: ProcedureTypes;
  filterForm: FormGroup;
  currentUser: Login = new Login();

  mainForm: FormGroup;
  isSubmitted: boolean = false;
  result: Result;

  constructor(
    public procedureTypeService: ProcedureTypeService,
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
    this.procedureTypes = [];
    this.procedureTypesSrc = [];
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
    this.procedureTypeService.getProcedureTypes(filter).subscribe({
      next: (data) => {
        var jsonObj = JSON.stringify(data.results);
        var uData = JSON.parse(jsonObj);
        for (const prop in uData) {
          let jsonObj = JSON.stringify(uData[prop]);
          var obj = JSON.parse(jsonObj);
          var appt = new ProcedureTypes(obj);

          this.procedureTypesSrc.push(appt);
        }
        if (this.procedureTypesSrc && event != null) {
          this.procedureTypes = this.procedureTypesSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.procedureTypes = this.procedureTypesSrc;
        }
        this.loading = false;
        this.totalRecords = this.procedureTypesSrc.length;
        if (event == null) this.dt.reset();
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.procedureTypes = [];
        this.procedureTypesSrc = [];
        this.loading = false;
        this.totalRecords = this.procedureTypesSrc.length;
      },
    });
  }

  resetProcedureTypes(): void {
    this.procedureTypes = [];
    this.procedureTypesSrc = [];
    this.i = 0;
  }

  Manage(id: number, type: ProcedureTypes): void {
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
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.procedureTypeService.deleteProcedureType(id).subscribe({
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
    this.isSubmitted = true;
    if (this.mainForm.dirty && this.mainForm.valid) {
      var fId = this.id.value;
      var fName = this.name.value;

      this.procedureTypeService.createOrUpdate(fId, fName).subscribe({
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
            detail: this.result.message,
          });
          this.isSubmitted = false;
        },
      });
    }
  }
}
