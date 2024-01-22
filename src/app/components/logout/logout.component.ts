import { StorageService } from './../../services/storage.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,

    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.logout();
      console.log('logout called');
    }
    this.router.navigate(['/login']);
  }

  logout(): boolean {
    var returnValue: boolean = false;
    this.authService.logout().subscribe({
      next: (res) => {
        this.storageService.clean();
        returnValue = true;
      },
      error: (err) => {
        returnValue = false;
      },
    });
    return returnValue;
    // window.location.reload();
  }
}
