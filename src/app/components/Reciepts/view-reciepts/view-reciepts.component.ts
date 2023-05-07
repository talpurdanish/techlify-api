import { RecieptReportComponent } from './../../Reciepts/reciept-report/reciept-report.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctions } from './../../../helper/common.function';
import { Filter } from './../../../helper/filter';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RecieptsService } from 'src/app/services/reciept.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Reciept } from 'src/app/models/details/reciept';

import { Result } from 'src/app/models/result';

import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PaywithpaypalComponent } from '../paywithpaypal/paywithpaypal.component';

@Component({
  selector: 'app-view-reciepts',
  templateUrl: './view-reciepts.component.html',
  styleUrls: ['./view-reciepts.component.css'],
})
export class ViewRecieptsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  reciepts: Reciept[] = [];
  recieptsSource: Reciept[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedReciept: Reciept = new Reciept();
  filterForm: FormGroup;
  show: boolean = false;
  ngOnDestroy(): void {}

  constructor(
    public recieptService: RecieptsService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
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
    this.reciepts = [];
    this.recieptsSource = [];
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
    this.recieptService.getReciepts(filter).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var obj = JSON.parse(jsonObj);
          var reciept = new Reciept(obj);

          this.recieptsSource.push(reciept);
          // this.selectedReciept = reciept;
        }
        if (this.recieptsSource && event != null) {
          this.reciepts = this.recieptsSource.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.reciepts = this.recieptsSource;
        }
        this.loading = false;
        this.totalRecords = this.recieptsSource.length;
        if (this.totalRecords == 0) {
          this.selectedReciept = null;
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
        this.reciepts = [];
        this.recieptsSource = [];
        this.loading = false;
        this.totalRecords = this.recieptsSource.length;
      },
    });
  }

  reset(): void {
    this.reciepts = [];
    this.recieptsSource = [];
    this.i = 0;
  }

  ngAfterViewInit(): void {}

  open(id: number) {
    this.ref = this.dialogService.open(RecieptReportComponent, {
      header: 'View Reciept',
      data: {
        id: id,
      },
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        this.load(null);
      }
    });
  }

  openPaypal(url: string) {
    this.ref = this.dialogService.open(PaywithpaypalComponent, {
      header: 'Pay with PayPal',
      data: {
        url: url,
      },
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        // this.updatePaidRecord(id);
      }
    });
  }
  //1 print
  //2 pay
  //3 delete
  Manage(id: number, reciept: Reciept): void {
    if (reciept.id > 0)
      switch (id) {
        case 1:
          this.open(reciept.id);
          break;
        case 2:
          this.updateStatus(reciept.id);
          break;
        case 3:
          this.Delete(reciept.id);
          break;
      }
  }

  updateStatus(id: number) {
    this.recieptService.paywithPaypal(id).subscribe({
      next: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: results.success ? 'success' : 'error',
          summary: 'FMDC',
          detail: results.message,
        });
        if (results.success) {
          // window.open(results.message, '_blank');
          // this.openPaypal(results.message);
          this.updatePaidRecord(id);
          // this.load(null);
        }
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
  }

  updatePaidRecord(id: number) {
    this.recieptService.updateStatus(id).subscribe({
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
  }

  showProcedures() {
    if (this.selectedReciept != null) {
      this.show = true;
    }
  }

  Delete(id: number): void {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.recieptService.deleteReciept(id).subscribe({
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
