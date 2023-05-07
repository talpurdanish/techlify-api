import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-paywithpaypal',
  templateUrl: './paywithpaypal.component.html',
  styleUrls: ['./paywithpaypal.component.css'],
})
export class PaywithpaypalComponent implements OnInit {
  currentUser: Login = new Login();
  sendUrl: string;
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
    public config: DynamicDialogConfig
  ) {
    this.sendUrl = this.config.data['url'];
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();

      this.LoadForm();
    } else {
      this.router.navigate(['/login']);
    }
  }

  LoadForm(): void {
    this.url = this.sendUrl;

    this.show = true;
  }
}
