import { Router } from '@angular/router';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Login } from 'src/app/models/login';
import { ChangePasswordComponent } from '../../Users/change-password/change-password.component';

import { Dialog } from 'primeng/dialog';

import { DOCUMENT } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.css'],
})
export class ProfileButtonComponent implements OnInit {
  currentUser: Login = new Login();
  elem: any;
  isFullScreen: boolean;
  ref: DynamicDialogRef;
  items: MenuItem[];
  constructor(
    private storageService: StorageService,
    private router: Router,
    private dialogService: DialogService,
    private authService: AuthService,

    @Inject(DOCUMENT) private document: any
  ) {
    this.items = [
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-wrench',
      },
      {
        label: 'Toggle Fullscreen',
        icon: 'pi pi-fw pi-desktop',
        command: () => this.ToggleFullScreen(),
      },
      {
        label: 'Change Password',
        icon: 'pi pi-fw pi-lock-open',
        command: () => this.open(),
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.logout(),
      },
    ];
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();

    this.chkScreenMode();
    this.elem = document.documentElement;
  }
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
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

  modalRef: Dialog;
  open(): void {
    this.ref = this.dialogService.open(ChangePasswordComponent, {
      header: 'Change Password',
      data: {
        id: this.currentUser.id,
      },
      width: '40%',
      contentStyle: { overflow: 'none' },
      baseZIndex: 10000,
      maximizable: false,
    });
  }
  logout(): void {
    if (this.storageService.isLoggedIn()) {
      this.authService.logout().subscribe({
        next: (res) => {
          this.storageService.clean();
        },
        error: (err) => {},
      });
      console.log('logout called');
    }
    this.router.navigate(['/login']);
  }
}
