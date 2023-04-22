import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { PatientService } from 'src/app/services/patient.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { LabReportService } from 'src/app/services/labreport.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  currentUser: Login = new Login();
  id: string;
  show: boolean = false;
  url: any;
  isPdfLoaded = false;
  private pdf: PDFDocumentProxy;

  onLoaded(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isPdfLoaded = true;
  }

  constructor(
    public userService: UserService,
    private storageService: StorageService,
    private router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private reportService: LabReportService
  ) {
    this.id = this.config.data['id'];
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
      // this.url = this.API_URL + 'GenerateReport/' + this.id;
      this.reportService.generateReport(this.id).subscribe({
        next: (data) => {
          this.url = data;
        },
      });
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
