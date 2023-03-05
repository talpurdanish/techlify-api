import { NavigationEnd, Router } from '@angular/router';
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
    private menuService: MenuService
  ) {}
  ngOnInit(): void {
    this.menuService.addMenuItems();

    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.username = user.Username;
    }
  }
}
