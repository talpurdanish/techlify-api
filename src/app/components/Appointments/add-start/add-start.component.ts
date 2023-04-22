import { MessageService } from 'primeng/api';
import { AppointmentService } from './../../../services/appointment.service';
import { User } from './../../../models/users';
import { UserService } from 'src/app/services/user.service';
import { Result } from './../../../models/result';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-start',
  templateUrl: './add-start.component.html',
  styleUrls: ['./add-start.component.css'],
})
export class AddStartComponent implements OnInit {
  @Input() id: number;

  AddAppointmentForm: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  result: Result;
  doctorsList: { Id: any; Name: string }[] = [];
  patientId: number = -1;
  constructor(
    private apptService: AppointmentService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    this.createForm();
    this.patientId = this.config.data['id'];
    this.FillDoctorsList();
  }

  ngOnInit() {}

  createForm() {
    this.AddAppointmentForm = this.fb.group({
      userId: ['', [Validators.required]],
    });
  }

  get userId() {
    return this.AddAppointmentForm.get('userId');
  }

  FillDoctorsList(): void {
    this.doctorsList = [];
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

  onSubmit(): void {
    if (this.AddAppointmentForm.dirty && this.AddAppointmentForm.valid) {
      var f_id = this.userId.value;
      var fPatientId = this.patientId;

      this.apptService.addAppointment(f_id, fPatientId).subscribe({
        next: (data) => {
          this.result = new Result(data);
          this.messageService.add({
            severity: this.result.success ? 'success' : 'error',
            summary: 'FMDC',
            detail: this.result.message,
          });

          if (this.result.success) {
            this.ref.close();
          }
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        error: (err) => {
          this.result = new Result(err);
          this.messageService.add({
            severity: this.result.success ? 'success' : 'error',
            summary: 'FMDC',
            detail: this.result.message,
          });
          this.isSignUpFailed = true;
        },
      });
    }
  }
}
