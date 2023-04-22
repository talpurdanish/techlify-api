import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { RecieptsService } from 'src/app/services/reciept.service';

@Component({
  selector: 'app-reciept-report',
  templateUrl: './reciept-report.component.html',
  styleUrls: ['./reciept-report.component.css'],
})
export class RecieptReportComponent implements OnInit {
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

  // API_URL = 'http://localhost:4000/api/fmdc/reciepts/';
  constructor(
    public userService: UserService,
    private storageService: StorageService,
    private router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private route: ActivatedRoute,
    private recieptService: RecieptsService
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
      // this.url = this.API_URL + 'GenerateReciept/' + this.id;
      this.recieptService.generateReciept(this.id).subscribe({
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
