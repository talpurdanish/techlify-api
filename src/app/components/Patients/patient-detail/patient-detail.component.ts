import { CommonFunctions } from './../../../helper/common.function';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';
import { MessageService } from 'primeng/api';
import { StorageService } from './../../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Result } from 'src/app/models/result';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
})
export class PatientDetailComponent implements OnInit {
  patient: Patient = new Patient();
  PatientID: number;
  age: string;
  dob: Date;
  patientStr: string;
  buttonTitle: string = 'Open All Tabs';
  visible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private patientService: PatientService
  ) {
    if (this.storageService.isLoggedIn()) {
      this.updatePatient();
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {}

  updatePatient() {
    this.route.params.subscribe((param) => {
      if (param && param['id']) {
        this.PatientID = param['id'];
        this.patientService.getPatient(param['id']).subscribe({
          next: (output) => {
            let results = new Result(output);
            var data = results.results;
            let jsonObj = JSON.stringify(data);
            var result = JSON.parse(jsonObj);
            this.patient = new Patient(result);
            this.dob = CommonFunctions.ChangeSqlDatetoDate(
              this.patient.DateofBirth
            );
            this.age = CommonFunctions.calculateAge(this.dob);
            this.updatePicture();
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
    });
  }

  openAllTabs(): void {
    this.visible = !this.visible;
    this.buttonTitle = this.visible ? 'Close All Tabs' : 'Open All Tabs';
  }

  backToList(): void {
    this.router.navigate(['/Patients']);
  }
  updatePicture(): void {
    if (this.patient != undefined && this.patient.Picture != '') {
      this.patient.Picturesrc = this.patient.Picture;
      this.patient.hasImage = true;
    } else {
      this.patient.Picturesrc = '../../../../assets/images/profile.png';
      this.patient.hasImage = false;
    }
  }
}
