import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private storageService: StorageService, private router: Router) {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
    } else {
      this.router.navigate(['/login']);
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

  ngOnInit(): void {}
}
