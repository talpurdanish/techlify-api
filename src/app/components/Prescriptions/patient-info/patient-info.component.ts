import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonFunctions } from 'src/app/helper/common.function';
import { Roles } from 'src/app/models/Roles';
import { Login } from 'src/app/models/login';
import { Patient } from 'src/app/models/patient';
import { Result } from 'src/app/models/result';
import { PatientService } from 'src/app/services/patient.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css'],
})
export class PatientInfoComponent implements OnInit {
  @Input('PatientId') PatientId = -1;
  patient = new Patient();
  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  currentUser: Login = new Login();
  age: string = '';
  constructor(
    private patientService: PatientService,
    private messageService: MessageService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.isAdmin = this.currentUser.role == Roles.Administrator;
      this.isDoctor = this.currentUser.role == Roles.Doctor;
      this.isStaff = this.currentUser.role == Roles.Staff;
      if (!this.isAdmin && !this.isDoctor) {
        this.router.navigate(['/Prescriptions']);
      }
      this.populatePatient();
    } else {
      this.router.navigate(['/login']);
    }
  }

  populatePatient() {
    if (this.isAdmin || this.isDoctor)
      this.patientService.getPatient(this.PatientId).subscribe({
        next: (output) => {
          let results = new Result(output);
          var data = results.results;
          if (results.success) {
            let jsonObj = JSON.stringify(data);
            var userObj = JSON.parse(jsonObj);
            this.patient = new Patient(userObj);
            var dob = CommonFunctions.ChangeSqlDatetoDate(
              this.patient.DateofBirth
            );
            this.age = CommonFunctions.calculateAge(dob);
          }
        },
        error: (err) => {
          let results = new Result(err);
          this.messageService.add({
            severity: 'error',
            summary: 'FMDC',
            detail: results.message,
          });

          // this.router.navigate(['/patients']);
        },
      });
  }
}
