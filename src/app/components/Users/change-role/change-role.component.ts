import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Form, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Role } from 'src/app/models/Role';
import { StorageService } from 'src/app/services/storage.service';
import { Result } from 'src/app/models/result';

@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.css'],
})
export class ChangeRoleComponent implements OnInit {
  @Input() id: number;
  @Input() title: string;
  @Input() uname: string;
  changeRoleForm: FormGroup;
  rolesList: Role[] = [];
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  result: Result;
  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.FillRolesList();
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

  FillRolesList(): void {
    this.userService.getRoles().subscribe({
      next: (data) => {
        for (const prop in data) {
          var role: Role = Object.assign(new Role(), data[prop]);

          this.rolesList.push(role);
        }
      },
    });
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
