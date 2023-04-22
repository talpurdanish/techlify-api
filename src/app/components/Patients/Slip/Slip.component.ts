import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';

import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { PatientService } from 'src/app/services/patient.service';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-Slip',
  templateUrl: './Slip.component.html',
  styleUrls: ['./Slip.component.css'],
})
export class SlipComponent implements OnInit {
  currentUser: Login = new Login();
  id: string;
  type: number = 1;
  show: boolean = false;
  url: any;
  isPdfLoaded = false;
  private pdf: PDFDocumentProxy;

  onLoaded(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isPdfLoaded = true;
  }

  // PATIENTS_API_URL = 'http://localhost:4000/api/fmdc/patients/';
  // PRES_API_URL = 'http://localhost:4000/api/fmdc/prescriptions/';
  constructor(
    public userService: UserService,
    private storageService: StorageService,
    private patientService: PatientService,
    private prescrptionService: PrescriptionService,
    private router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.id = this.config.data['id'];
    this.type = this.config.data['type'] ?? 1;
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.LoadReport();
    } else {
      this.router.navigate(['/login']);
    }
  }

  LoadReport(): void {
    if (this.id != '') {
      // this.url =
      //   this.type == 1
      //     ? this.PATIENTS_API_URL + 'GenerateSlip/' + this.id
      //     : this.PRES_API_URL + 'GeneratePrescription/' + this.id;
      if (this.type == 1) {
        this.patientService.generateSlip(this.id).subscribe({
          next: (data) => {
            this.url = data;
          },
        });
      } else {
        this.prescrptionService.generatePrescription(this.id).subscribe({
          next: (data) => {
            this.url = data;
          },
        });
      }

      this.show = true;
    }
  }
  print() {
    this.pdf.getData().then((u8) => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf',
      });

      const blobUrl = window.URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    });
  }
}
