import { StorageService } from './../../services/storage.service';
import { MenuService } from './../../services/menu.service';
import { Component, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';

import { MenuItem } from 'primeng/api';
import { Administrator } from './Administrator';
import { Roles } from 'src/app/models/Roles';
import { Doctor } from './Doctor';
import { Staff } from './Staff';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  items: MenuItem[];

  constructor(private storageService: StorageService) {
    if (storageService.isLoggedIn()) {
      const user = this.storageService.getUser();
      var role: string = user.role;

      if (role == Roles.Administrator) {
        this.items = Administrator.items;
      } else if (role == Roles.Doctor) {
        this.items = Doctor.items;
      } else if (role == Roles.Staff) {
        this.items = Staff.items;
      }
    }
  }

  ngOnInit(): void {}
}
