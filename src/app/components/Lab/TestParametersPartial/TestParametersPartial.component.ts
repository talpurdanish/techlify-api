import { TestParameter } from '../../../models/Lab/TestParameter';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';

import { Result } from 'src/app/models/result';

import { Table } from 'primeng/table';
import { TestParameterService } from 'src/app/services/test-parameter.service';

@Component({
  selector: 'app-TestParametersPartial',
  templateUrl: './TestParametersPartial.component.html',
  styleUrls: ['./TestParametersPartial.component.css'],
})
export class TestParametersPartialComponent implements OnInit, OnChanges {
  @Input() TestId: number = 0;
  @ViewChild('dt') dt: Table | undefined;
  testParameters: TestParameter[] = [];

  totalRecords: number;

  loading: boolean;
  selectedTestParameter: TestParameter;
  currentUser: Login = new Login();

  constructor(
    private testParameterService: TestParameterService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnChanges() {
    this.load(null);
  }

  load(event: LazyLoadEvent) {
    if (this.TestId > 0) {
      this.loading = true;
      this.testParameters = [];
      this.testParameterService.getTestParameter(this.TestId, true).subscribe({
        next: (data) => {
          var jsonObj = JSON.stringify(data.results);
          var uData = JSON.parse(jsonObj);
          for (const prop in uData) {
            let jsonObj = JSON.stringify(uData[prop]);
            var obj = JSON.parse(jsonObj);
            var appt = new TestParameter(obj);

            this.testParameters.push(appt);
          }
          this.loading = false;
        },
        error: (data) => {
          let results = new Result(data);
          this.messageService.add({
            severity: 'error',
            summary: 'FMDC',
            detail: results.message,
          });
          this.testParameters = [];
          this.loading = false;
        },
      });
    }
  }
}
