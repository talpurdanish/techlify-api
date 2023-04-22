import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { StorageService } from 'src/app/services/storage.service';
import { Result } from 'src/app/models/result';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.css'],
})
export class ChangeRoleComponent implements OnInit {
  @Input() id: string;
  changeRoleForm: FormGroup;
  rolesList: { Name: string; Id: Number }[] = [];
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  result: Result;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.createForm();
    this.id = this.config.data['id'];
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.rolesList = [
        { Name: 'Administrator', Id: 0 },
        { Name: 'Doctor', Id: 1 },
        { Name: 'Staff', Id: 2 },
      ];
    } else {
      this.router.navigate(['/login']);
    }
  }

  createForm() {
    this.changeRoleForm = this.fb.group({
      roleId: ['', [Validators.required]],
    });
  }

  get roleId() {
    return this.changeRoleForm.get('roleId');
  }

  onSubmit(): void {
    if (this.changeRoleForm.dirty && this.changeRoleForm.valid) {
      var froleId = this.roleId.value;
      var fUserId = this.id;
      this.userService.changeRole(fUserId, froleId).subscribe({
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
