import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { Result } from 'src/app/models/result';
import { ValidationService } from 'src/app/services/Validation.service';
import { Dialog } from 'primeng/dialog';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  id: string;
  result: Result;
  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.createForm();
    this.id = this.config.data['id'];
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
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
            Validators.minLength(6),
            Validators.maxLength(25),
            ValidationService.matchValidator('confirmPassword', true),
          ],
        ],
        cfmPassword: [
          '',
          [
            Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
            Validators.required,
            ValidationService.matchValidator('newPassword'),
          ],
        ],
      }
      // {
      //   validator: ValidationService.confirmPasswordValidator(
      //     'newPassword',
      //     'cfmPassword'
      //   ),
      // }
    );
  }
  toggleWithErrors(tooltip: Tooltip, hasError: boolean) {
    if (hasError) tooltip.show();
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
      this.authService.changePassword(fop, fnp).subscribe({
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
