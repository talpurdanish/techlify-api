import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Result } from 'src/app/models/result';
import { Login } from 'src/app/models/login';

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

  isLoading: boolean = false;
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // if (this.storageService.isLoggedIn()) {
    //   this.isLoggedIn = true;
    // }
  }
  onSubmit(): void {
    const { username, password } = this.form;
    this.isLoading = true;
    this.authService.login(username, password).subscribe({
      next: (data) => {
        let result = new Result(data);
        if (!result.error) {
          this.storageService.saveUser(result.results);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.isLoading = false;

          this.router.navigateByUrl('/home');
        } else {
          this.errorMessage = 'Incorrect Username/Password';
          this.isLoginFailed = true;
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Incorrect Username/Password';
        this.isLoginFailed = true;
        this.isLoading = false;
      },
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
