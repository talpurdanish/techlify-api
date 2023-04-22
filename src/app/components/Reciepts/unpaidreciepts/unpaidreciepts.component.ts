import { Reciept } from 'src/app/models/details/reciept';
import { LazyLoadEvent, MessageService } from 'primeng/api';

import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Result } from 'src/app/models/result';
import { Table } from 'primeng/table';
import { CommonFunctions } from 'src/app/helper/common.function';
import { RecieptsService } from 'src/app/services/reciept.service';

@Component({
  selector: 'app-unpaidreciepts',
  templateUrl: './unpaidreciepts.component.html',
  styleUrls: ['./unpaidreciepts.component.css'],
})
export class UnpaidrecieptsComponent implements OnInit {
  @Output() UpdatePendingCount = new EventEmitter<number>();
  @ViewChild('dt') dt: Table | undefined;

  reciepts: Reciept[] = [];
  recieptSrc: Reciept[] = [];
  totalRecords: number;
  loading: boolean;
  constructor(
    private recieptService: RecieptsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  count = 0;

  updatePendingCount(value: number) {
    this.UpdatePendingCount.emit(value);
  }

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.reciepts = [];
    this.recieptSrc = [];

    this.recieptService.getUnpaidReciepts().subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var obj = JSON.parse(jsonObj);
          var reciept = new Reciept(obj);
          this.recieptSrc.push(reciept);
        }
        this.updatePendingCount(this.recieptSrc.length);
        if (this.recieptSrc && event != null) {
          this.reciepts = this.recieptSrc.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.reciepts = this.recieptSrc;
        }
        this.loading = false;
        this.totalRecords = this.recieptSrc.length;
        if (event == null) this.dt.reset();
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

  updateStatus(id: number) {
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
}
