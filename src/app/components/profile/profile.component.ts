import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/models/login';
import { FmdcModalService } from '../Users/fmdc-modal/fmdc-modal.service';
import { ChangePasswordComponent } from '../Users/change-password/change-password.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: Login = new Login();
  elem: any;
  isFullScreen: boolean;
  constructor(
    private storageService: StorageService,
    private router: Router,
    private customModal: FmdcModalService,
    @Inject(DOCUMENT) private document: any
  ) {}
  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.chkScreenMode();
    this.elem = document.documentElement;
  }
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  logout(): void {
    this.router.navigate(['/Logout']);
  }
  ToggleFullScreen(): void {
    this.chkScreenMode();
    if (!this.isFullScreen) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
  }

  fullscreenmodes(event) {
    this.chkScreenMode();
  }
  chkScreenMode() {
    if (document.fullscreenElement) {
      //fullscreen
      this.isFullScreen = true;
    } else {
      //not in full screen
      this.isFullScreen = false;
    }
  }
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  } /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  modalRef: NgbModalRef;
  open(): void {
    this.modalRef = this.customModal.showFeaturedDialog(
      ChangePasswordComponent,
      this.currentUser.Id,
      'Change Password',
      this.currentUser.FirstName
    );
  }
}
