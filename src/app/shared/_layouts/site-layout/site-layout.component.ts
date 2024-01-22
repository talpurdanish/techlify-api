import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from 'src/app/models/Roles';
import { Login } from 'src/app/models/login';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css'],
})
export class SiteLayoutComponent implements OnInit {
  currentUser: Login = new Login();
  sidebarVisible = false;
  sideBarButtonVisible: string = '';
  picture: any;

  isAdmin: boolean = false;
  isLoggedin: boolean = false;

  constructor(private storageService: StorageService, private router: Router) {
    this.isLoggedin = this.storageService.isLoggedIn();
    if (this.isLoggedin) {
      this.currentUser = this.storageService.getUser();
      this.picture = this.currentUser.picture;
      this.isAdmin = this.currentUser.role == Roles.Administrator;
    }
  }

  sideBarClosed(event) {
    this.sidebarVisible = false;
    this.sideBarButtonVisible = '';
  }

  openSidebar(event) {
    this.sidebarVisible = true;
    this.sideBarButtonVisible = 'display: none;';
  }

  ngOnInit(): void {
    this.storageService.getEmitter().subscribe((user: any) => {
      this.isLoggedin = this.storageService.isLoggedIn();
      if (this.isLoggedin) {
        this.currentUser = this.storageService.getUser();
        this.picture = this.currentUser.picture;
        this.isAdmin = this.currentUser.role == Roles.Administrator;
      }
    });
  }
}
