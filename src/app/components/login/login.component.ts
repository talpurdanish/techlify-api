import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Result } from 'src/app/models/result';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  username: string = '';
  isLoading: boolean = false;
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.username = this.storageService.getUser().Username;
    }
  }
  onSubmit(): void {
    const { username, password } = this.form;
    this.isLoading = true;
    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.username = this.storageService.getUser().Username;

        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.errorMessage = 'Incorrect Username/Password';
        this.isLoginFailed = true;
      },
    });
    this.isLoading = false;
  }
  reloadPage(): void {
    window.location.reload();
  }
}
