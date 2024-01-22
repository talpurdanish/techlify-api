import { NavigationEnd, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { MenuService } from './services/menu.service';
import { Component } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoggedIn = false;
  username?: string;

  constructor(
    private storageService: StorageService,
    private primengConfig: PrimeNGConfig
  ) {}
  ngOnInit(): void {
    this.primengConfig.ripple = true;
    try {
      this.isLoggedIn = this.storageService.isLoggedIn();
      if (this.isLoggedIn) {
        const user = this.storageService.getUser();
        this.username = user.username;
      }
    } catch (e) {
      this.storageService.clean();
    }
  }
}
