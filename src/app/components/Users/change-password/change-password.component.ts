import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { Result } from 'src/app/models/result';
import { ValidationService } from 'src/app/services/Validation.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  @Input() id: number;
  @Input() title: string;
  @Input() uname: string;
  changePasswordForm: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  result: Result;
  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  createForm() {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        cfmPassword: ['', [Validators.required]],
      },
      {
        validator: ValidationService.confirmPasswordValidator(
          'newPassword',
          'cfmPassword'
        ),
      }
    );
  }
  toggleWithErrors(tooltip: NgbTooltip, hasError: boolean) {
    if (hasError) tooltip.toggle();
  }

  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get cfmPassword() {
    return this.changePasswordForm.get('cfmPassword');
  }

  onSubmit(): void {
    if (this.changePasswordForm.dirty && this.changePasswordForm.valid) {
      var fop = this.oldPassword.value;
      var fnp = this.newPassword.value;

      var fUserId = this.id;
      this.authService.changePassword(fUserId, fop, fnp).subscribe({
        next: (data) => {
          this.result = new Result(data);
          this.errorMessage = this.result.message;
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        error: (err) => {
          this.result = new Result(err);
          this.errorMessage = this.result.message;
          this.isSignUpFailed = true;
        },
      });
    }
  }
}
