import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Result } from 'src/app/models/result';
import { Login } from 'src/app/models/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoginFailed: boolean = false;
  isSubmitted: boolean = false;
  errorMessage: String = '';
  loginForm: FormGroup;
  isLoading: boolean = false;
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    this.createForm();
  }
  onSubmit(): void {
    this.isSubmitted = true;
    if (
      this.loginForm.dirty &&
      this.username.value.length > 0 &&
      this.password.value.length > 0
    ) {
      this.isLoading = true;
      this.authService
        .login(this.username.value, this.password.value)
        .subscribe({
          next: (data) => {
            let result = new Result(data);
            if (!result.error) {
              this.storageService.saveUser(result.results);
              this.isLoginFailed = false;
              this.isLoading = false;
              this.router.navigateByUrl('/home');
              this.isSubmitted = false;
            } else {
              this.errorMessage = 'Incorrect Username/Password';
              this.isLoginFailed = true;
              this.isLoading = false;
              this.isSubmitted = false;
            }
          },
          error: () => {
            this.isSubmitted = false;
            this.errorMessage = 'Incorrect Username/Password';
            this.isLoginFailed = true;
            this.isLoading = false;
            this.isSubmitted = false;
          },
        });
    } else {
      this.errorMessage = 'Username / Password is required';
    }
  }
  reloadPage(): void {
    window.location.reload();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],

      password: [
        '',
        [
          Validators.required,

          Validators.minLength(6),
          Validators.maxLength(25),
        ],
      ],
    });
  }
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
