import { Procedure } from './../../../models/procedure';
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
import { ProcedureService } from 'src/app/services/procedure.service';
import { ProcedureTypeService } from 'src/app/services/proceduretype.service';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';

@Component({
  selector: 'app-ViewProcedures',
  templateUrl: './ViewProcedures.component.html',
  styleUrls: ['./ViewProcedures.component.css'],
})
export class ViewProceduresComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  procedures: Procedure[] = [];
  proceduresSrc: Procedure[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedProcedure: Procedure;
  filterForm: FormGroup;
  currentUser: Login = new Login();

  mainForm: FormGroup;
  isSubmitted: boolean = false;
  result: Result;
  doctorsList: { Id: any; Name: string }[] = [];
  patientsList: { Id: any; Name: string }[] = [];
  typesList: any;

  constructor(
    public procedureService: ProcedureService,
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
    this.procedures = [];
    this.proceduresSrc = [];
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
    this.procedureService.getProcedures(filter).subscribe({
      next: (data) => {
        var jsonObj = JSON.stringify(data.results);
        var uData = JSON.parse(jsonObj);
        for (const prop in uData) {
          let jsonObj = JSON.stringify(uData[prop]);
          var obj = JSON.parse(jsonObj);
          var appt = new Procedure(obj);

          this.proceduresSrc.push(appt);
        }
        if (this.proceduresSrc && event != null) {
          this.procedures = this.proceduresSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.procedures = this.proceduresSrc;
        }
        this.loading = false;
        this.totalRecords = this.proceduresSrc.length;
        if (event == null) this.dt.reset();
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        this.procedures = [];
        this.proceduresSrc = [];
        this.loading = false;
        this.totalRecords = this.proceduresSrc.length;
      },
    });
  }

  resetProcedures(): void {
    this.procedures = [];
    this.proceduresSrc = [];
    this.i = 0;
  }

  Manage(id: number, procedure: Procedure): void {
    switch (id) {
      case 1:
        this.mainForm.patchValue({
          id: procedure.id,
          name: procedure.Name,
          cost: procedure.Cost,
          typeId: procedure.TypeId,
        });
        break;

      case 2:
        this.Delete(procedure.id);
        break;
    }
  }

  Delete(id: number): void {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.procedureService.deleteProcedure(id).subscribe({
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
    this.procedureTypeService.getProcedureTypes(null).subscribe({
      next: (data) => {
        let results = new Result(data);
        var types = results.results;
        for (const prop in types) {
          var pObj = JSON.stringify(types[prop]);
          var type = JSON.parse(pObj);
          this.typesList.push({ Name: type.name, id: type.id });
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
      id: [''],
      name: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      typeId: ['', [Validators.required]],
    });
  }

  get id() {
    return this.mainForm.get('id');
  }
  get name() {
    return this.mainForm.get('name');
  }
  get cost() {
    return this.mainForm.get('cost');
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
      var fId = this.id.value;
      var fName = this.name.value;
      var fCost = this.cost.value;
      var fTypeId = this.typeId.value;

      this.procedureService
        .createOrUpdate(fId, fName, fCost, fTypeId)
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
