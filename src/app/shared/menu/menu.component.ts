import { StorageService } from './../../services/storage.service';
import { MenuService } from './../../services/menu.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../models/menuitem';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  constructor(
    private menuService: MenuService,
    private storageService: StorageService
  ) {
    if (storageService.isLoggedIn()) {
      const user = this.storageService.getUser();
      var role: string = user.Role;
      this.menuItems = this.menuService.getMenu(role);
    }
  }

  ngOnInit(): void {}
}
