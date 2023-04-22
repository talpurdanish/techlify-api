import { RecieptReportComponent } from './../reciept-report/reciept-report.component';
import { ViewRecieptsComponent } from './../view-reciepts/view-reciepts.component';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { CommonFunctions } from './../../../helper/common.function';
import { StorageService } from './../../../services/storage.service';
import { ProcedureService } from './../../../services/procedure.service';
import { Reciept } from './../../../models/details/reciept';
import { Procedure } from './../../../models/procedure';

import { MessageService } from 'primeng/api';

import { User } from './../../../models/users';
import { UserService } from 'src/app/services/user.service';
import { Result } from './../../../models/result';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RecieptsService as RecieptService } from 'src/app/services/reciept.service';

@Component({
  selector: 'app-CreateReciept',
  templateUrl: './CreateReciept.component.html',
  styleUrls: ['./CreateReciept.component.css'],
})
export class CreateRecieptComponent implements OnInit, OnDestroy {
  mainForm: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  isSubmitted = false;
  result: Result;
  doctorsList: { Id: string; Name: string }[] = [];
  proceduresList: { Id: string; Name: string }[] = [];
  patientId: number = -1;
  reciept: Reciept = new Reciept();
  AuthorizedBy: string = '';
  loading: boolean = false;
  procedures: Procedure[] = [];
  ref: DynamicDialogRef;
  discountDisabled: boolean = true;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private recieptService: RecieptService,
    private procedureService: ProcedureService,
    private storageService: StorageService,
    private dialogService: DialogService
  ) {
    this.populateReciept();
    this.createForm();
    this.FillDoctorsList();
    this.FillProceduresList();
  }

  ngOnInit() {
    this.discountDisabled =
      this.reciept == null || this.reciept.Procedures.length <= 0;
  }
  ngOnDestroy(): void {
    this.reset();
  }

  createForm() {
    this.mainForm = this.fb.group({
      doctorId: [''],
      procedureId: [''],
      discount: [''],
    });
  }

  get doctorId() {
    return this.mainForm.get('doctorId');
  }

  get procedureId() {
    return this.mainForm.get('procedureId');
  }

  get discount() {
    return this.mainForm.get('discount');
  }

  FillDoctorsList(): void {
    this.userService.getDoctors().subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var userObj = JSON.parse(jsonObj);

          var doctor = { Id: userObj.id, Name: userObj.value };

          this.doctorsList.push(doctor);
        }
      },
    });
  }

  FillProceduresList(): void {
    this.procedureService.getProcedures(null).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var obj = JSON.parse(jsonObj);
          var procedure = { Id: obj.id, Name: obj.name };
          this.proceduresList.push(procedure);
        }
      },
    });
  }

  reset() {
    this.storageService.removeReciept();
  }
  load(): void {
    this.loading = true;

    this.reciept = this.storageService.getReciept();
    if (this.reciept == null) this.populateReciept();
    if (this.reciept != null && this.reciept != undefined) {
      this.procedures = this.reciept.Procedures;
      this.reciept.Total = 0;
      this.procedures.forEach((element) => {
        this.reciept.Total += element.Cost;
      });

      this.reciept.GrandTotal =
        this.reciept.Total -
        (this.reciept.Discount > 0
          ? (this.reciept.Discount * this.reciept.Total) / 100
          : 0);
      this.AuthorizedBy =
        this.reciept.AuthorizedBy != undefined ||
        this.reciept.AuthorizedBy != null
          ? 'Dr. ' + this.reciept.AuthorizedBy
          : '';
    }
    this.loading = false;
  }

  addProcedure(): void {
    const id = this.procedureId.value;

    if (id != undefined && id != null && id != '') {
      this.procedureService.getProcedure(id).subscribe({
        next: (output) => {
          let results = new Result(output);
          var data = results.results;

          let jsonObj = JSON.stringify(data);

          const obj = JSON.parse(jsonObj);
          var procedure = new Procedure();
          procedure.id = obj.id;
          procedure.Name = obj.name;
          procedure.Cost = obj.cost;

          var sno = this.reciept.Procedures.length + 1;
          procedure.SNo = sno;
          this.reciept.Procedures.push(procedure);
          this.storageService.saveReciept(this.reciept);
          this.load();
          this.discountDisabled = false;
        },
      });
    }
  }

  deleteProcedure(id: number): void {
    if (id > 0) {
      var procedures = this.reciept.Procedures;
      this.reciept.Procedures = [];
      procedures.forEach((element) => {
        if (element.SNo != id) {
          this.reciept.Procedures.push(element);
        }
      });
      if (this.reciept.Procedures.length == 0) {
        this.discountDisabled = true;
        this.reciept.Discount = 0;
        this.reciept.AuthorizedBy = '';
        this.reciept.AuthorizedById = '0';
      }
      this.storageService.saveReciept(this.reciept);
      this.load();
    }
  }

  addDiscount() {
    const discount = this.discount.value;
    const authId = this.doctorId.value;

    if (discount > 0 && authId != null && authId != '' && authId != undefined) {
      var reciept = this.storageService.getReciept();
      if (reciept.Procedures.length > 0) {
        this.userService.getUser(authId).subscribe({
          next: (output) => {
            let results = new Result(output);
            var data = results.results;
            let jsonObj = JSON.stringify(data);
            var user = JSON.parse(jsonObj);
            reciept.Discount = discount;
            reciept.AuthorizedBy = user.name;
            reciept.AuthorizedById = user.id;

            this.storageService.saveReciept(reciept);
            this.load();
          },
        });
      } else {
      }
    }
  }
  populateReciept(): void {
    this.route.params.subscribe((param) => {
      if (param && param['id']) {
        this.recieptService.getReciept(param['id']).subscribe({
          next: (output) => {
            let results = new Result(output);
            var data = results.results;

            let jsonObj = JSON.stringify(data);

            var obj = JSON.parse(jsonObj);
            this.reciept = new Reciept(obj);
            if (this.reciept.PatientId > 0 && this.reciept.DoctorId > 0) {
              this.AuthorizedBy =
                this.reciept.AuthorizedBy != undefined ||
                this.reciept.AuthorizedBy != null
                  ? 'Dr. ' + this.reciept.AuthorizedBy
                  : '';
              if (this.reciept.Procedures == null) this.reciept.Procedures = [];
              this.storageService.saveReciept(this.reciept);
              this.load();
            } else {
            }
          },
          error: (err: any) => {
            let results = new Result(err);
            this.messageService.add({
              severity: 'error',
              summary: 'FMDC',
              detail: results.message,
            });

            // this.router.navigate(['/Patients']);
          },
        });
      }
    });
  }

  generateReciept(): void {
    if (this.reciept.Procedures.length > 0) {
      this.recieptService
        .createReciept(
          this.reciept.RecieptNumber,
          this.reciept.PatientId,
          this.reciept.DoctorId,
          this.reciept.AppointmentId,
          this.reciept.PatientName,
          this.reciept.PatientNumber,
          this.reciept.Doctor,
          this.reciept.Date,
          this.reciept.Time,
          this.reciept.AuthorizedBy,
          this.reciept.AuthorizedById,
          this.reciept.Discount,
          this.reciept.Total,
          this.reciept.GrandTotal,
          this.reciept.Appointment,
          this.reciept.Paid,
          this.reciept.Procedures
        )
        .subscribe({
          next: (data) => {
            let results = new Result(data);
            this.messageService.add({
              severity: results.success ? 'success' : 'error',
              summary: 'FMDC',
              detail: results.message,
            });
            if (results.success) {
              // this.router.navigate(['/Patients']);
            }
          },
          error: (err: any) => {
            let results = new Result(err);
            this.messageService.add({
              severity: 'error',
              summary: 'FMDC',
              detail: results.message,
            });
            // this.router.navigate(['/Patients']);
          },
        });
    }
  }

  // open(type: string, id: number) {
  //   if (type === 'gr') {
  //     this.ref = this.dialogService.open(RecieptReportComponent, {
  //       header: 'View Reciept',
  //       data: {
  //         id: id,
  //       },
  //       width: '70%',
  //       contentStyle: { overflow: 'auto' },
  //       baseZIndex: 10000,
  //       maximizable: true,
  //     });

  //     this.ref.onClose.subscribe((data: any) => {
  //       this.reset();
  //       this.router.navigate(['/Patients']);
  //     });
  //   }
  // }
}
