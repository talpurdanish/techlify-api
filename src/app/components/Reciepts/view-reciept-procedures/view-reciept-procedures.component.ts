import { Procedure } from './../../../models/procedure';
import { RecieptReportComponent } from './../../Reciepts/reciept-report/reciept-report.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctions } from './../../../helper/common.function';
import { Filter } from './../../../helper/filter';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { RecieptsService } from 'src/app/services/reciept.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Reciept } from 'src/app/models/details/reciept';

import { Result } from 'src/app/models/result';

import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-view-reciept-procedures',
  templateUrl: './view-reciept-procedures.component.html',
  styleUrls: ['./view-reciept-procedures.component.css'],
})
export class ViewRecieptProceduresComponent implements OnInit, OnChanges {
  @Input('Procedures') ProceduresIds: Procedure;

  @ViewChild('dt') dt: Table | undefined;
  recieptProcedures: Procedure[] = [];

  totalRecords: number;
  loading: boolean;
  ngOnDestroy(): void {}

  constructor(
    public recieptService: RecieptsService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
    } else {
      this.router.navigate(['/login']);
    }
  }

  count = 0;

  load() {
    this.loading = true;
    this.recieptProcedures = [];

    for (const proc in this.ProceduresIds) {
      var procedure = new Procedure(this.ProceduresIds[proc]);
      this.recieptProcedures.push(procedure);
      // this.recieptService
      //   .getRecieptProcedures(this.ProceduresIds[proc])
      //   .subscribe({
      //     next: (output) => {
      //       let results = new Result(output);
      //       var data = results.results;

      //       let jsonObj = JSON.stringify(data);

      //       var obj = JSON.parse(jsonObj);
      //       var procedure = new Procedure(obj);
      //       this.recieptProcedures.push(procedure);
      //     },
      //     error: (data) => {
      //       let results = new Result(data);
      //       this.messageService.add({
      //         severity: 'error',
      //         summary: 'FMDC',
      //         detail: results.message,
      //       });
      //       this.recieptProcedures = [];

      //       this.loading = false;
      //       this.totalRecords = this.recieptProcedures.length;
      //     },
      //   });
    }
    this.loading = false;
    this.totalRecords = this.recieptProcedures.length;
  }

  reset(): void {
    this.recieptProcedures = [];
  }

  ngAfterViewInit(): void {}

  ngOnChanges(): void {
    this.load();
  }
}
