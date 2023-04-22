import { PatientStats } from './../../../models/patientstats';
import { PatientService } from 'src/app/services/patient.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-stats',
  templateUrl: './patient-stats.component.html',
  styleUrls: ['./patient-stats.component.css'],
})
export class PatientStatsComponent implements OnInit {
  patients: number = 0;
  males: number = 0;
  females: number = 0;
  others: number = 0;

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.UpdatePatientStats();
  }

  UpdatePatientStats() {
    this.patientService.getPatientStats().subscribe({
      next: (data) => {
        let jsonObj = JSON.stringify(data.results);
        let result = JSON.parse(jsonObj) as PatientStats;

        this.patients = result.patients;
        this.males = result.males;
        this.females = result.females;
        this.others = result.others;
      },
    });
  }
}
