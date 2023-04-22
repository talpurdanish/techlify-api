import { Incomestats } from './../../models/incomestats';
import { RecieptsService } from 'src/app/services/reciept.service';
import { AppointmentStats } from './../../models/appointmentStats';
import { AppointmentService } from './../../services/appointment.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/users';
import { Login } from 'src/app/models/login';
import { Subscription, timer } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { Result } from 'src/app/models/result';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  content?: string;
  listUsers: User[] = [];
  currentUser: Login = new Login();
  data: any;
  options: any;
  apptStats: AppointmentStats = new AppointmentStats();
  incomeStats: Incomestats = new Incomestats();
  total: number;
  pending: number;
  todaysPensing: number;
  todaysTotal: number;
  apptSubscription!: Subscription;
  incomeSubscription!: Subscription;
  pendingAppointments: Number = 0;
  unpaidReciepts: Number = 0;
  pendingReports: number = 0;
  hasPendingAppointments: string = '';
  hasPendingReciepts: string = '';
  hasPendingReports: string = '';
  disabledAppointments: boolean = true;
  disabledReciepts: boolean = true;
  disabledReports: boolean = true;
  constructor(
    private storageService: StorageService,
    private router: Router,
    private apptService: AppointmentService,
    private recieptService: RecieptsService
  ) {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();

      this.options = {
        plugins: {
          title: {
            display: false,
          },
          legend: {
            position: 'none',
          },
        },
      };
    } else {
      this.router.navigate(['/login']);
    }
  }
  ngOnInit(): void {
    this.updateAppointmentStats();
    this.updateIncomeStats();
  }
  ngOnDestroy() {
    this.apptSubscription.unsubscribe();
  }

  updateAppointmentStats() {
    this.apptSubscription = timer(0, 60000)
      .pipe(switchMap(() => this.apptService.getAppointmentStats()))
      .subscribe((value) => {
        let results = new Result(value);
        var data = results.results;
        let jsonObj = JSON.stringify(data);

        let output = JSON.parse(jsonObj);

        this.apptStats = new AppointmentStats(output);
      });
  }

  updateIncomeStats() {
    this.apptSubscription = timer(0, 60000)
      .pipe(switchMap(() => this.recieptService.getIncomeStats()))
      .subscribe((value) => {
        let results = new Result(value);
        var data = results.results;
        if (results.message.indexOf('No Stats') == -1) {
          let jsonObj = JSON.stringify(data);

          let output = JSON.parse(jsonObj);

          this.incomeStats = new Incomestats(output);

          this.data = {
            labels: this.incomeStats.Labels,
            datasets: [
              {
                label: 'Income Stats',
                data: this.incomeStats.Data,
              },
            ],
          };
        }
      });
  }

  updateUnpaidCount(value: number) {
    this.unpaidReciepts = value;
    this.hasPendingReciepts = value > 0 ? 'hasPending' : '';
    this.disabledReciepts = value === 0;
  }
  updatePendingCount(value: number) {
    this.pendingAppointments = value;
    this.hasPendingAppointments = value > 0 ? 'hasPending' : '';
    this.disabledAppointments = value === 0;
  }

  updatePendingReportsCount(value: number) {
    this.pendingReports = value;
    this.hasPendingReports = value > 0 ? 'hasPending' : '';
    this.disabledReports = value === 0;
  }

  backToList(): void {
    this.router.navigate(['/Reports']);
  }
}
