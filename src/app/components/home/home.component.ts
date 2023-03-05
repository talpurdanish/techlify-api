import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/users';
import { Login } from 'src/app/models/login';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  content?: string;
  listUsers: User[] = [];
  currentUser: Login = new Login();
  constructor(private storageService: StorageService, private router: Router) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
    } else {
      this.router.navigate(['/login']);
    }
  }
}
