import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctions } from './../../../helper/common.function';
import { Filter } from './../../../helper/filter';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, LazyLoadEvent, MenuItem } from 'primeng/api';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/users';
import { Login } from 'src/app/models/login';

import { ChangeRoleComponent } from '../change-role/change-role.component';
import { Result } from 'src/app/models/result';

import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
})
export class ViewUserComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dt') dt: Table | undefined;
  USERS: User[] = [];
  usersSource: User[] = [];
  i = 0;
  data: any;

  ref: DynamicDialogRef;
  totalRecords: number;

  loading: boolean;
  selectedUser: User;
  filterForm: FormGroup;

  items: MenuItem[];

  ngOnDestroy(): void {}
  currentUser: Login = new Login();
  constructor(
    public userService: UserService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.filterForm = this.formBuilder.group({
        term: ['', [Validators.required]],
      });

      this.items = [
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          command: () => this.ManageUser(1, this.selectedUser),
        },
        {
          label: 'Change Role',
          icon: 'pi pi-fw pi-sitemap',
          command: () => this.ManageUser(2, this.selectedUser),
        },
        {
          label: 'Activate/Deactivate',
          icon: 'pi pi-fw pi-check',
          command: () => this.ManageUser(3, this.selectedUser),
        },
        {
          label: 'Reset Password',
          icon: 'pi pi-fw pi-key',
          command: () => this.ManageUser(4, this.selectedUser),
        },
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-times',
          command: () => this.ManageUser(5, this.selectedUser),
        },
      ];
    } else {
      this.router.navigate(['/login']);
    }
  }

  get Term() {
    return this.filterForm.get('term');
  }

  getPageNumber(firstRow: number, rows: number): number {
    let page = 1;
    if (firstRow != 0 && rows > 0) {
      page = Math.ceil(rows / firstRow) + 1;
    }
    return page;
  }

  applyFilterGlobal(term: string) {
    this.dt!.filterGlobal(term, 'contains');
  }

  loadUsers(event: LazyLoadEvent) {
    this.loading = true;
    this.USERS = [];
    this.usersSource = [];
    this.i = 0;
    var filter: Filter;
    if (event != null) {
      let jsonObj = JSON.stringify(event.filters);
      let global = JSON.parse(jsonObj);
      if (global.global != undefined) {
        filter = new Filter(
          global.global.value,
          1,
          CommonFunctions.ComputeField(event.sortField),
          event.sortOrder
        );
      }
    }
    this.userService.getUsers(filter).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var userObj = JSON.parse(jsonObj);
          var user = new User(userObj);
          this.usersSource.push(user);
          this.selectedUser = user;
          // this.updatePicture();
        }
        if (this.usersSource && event != null) {
          this.USERS = this.usersSource.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.USERS = this.usersSource;
        }
        this.loading = false;
        this.totalRecords = this.usersSource.length;
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'Disney',
          detail: results.message,
        });
        this.USERS = [];
        this.usersSource = [];
        this.loading = false;
        this.totalRecords = this.usersSource.length;
      },
    });
  }

  getUsers(): void {
    this.USERS = [];
    this.usersSource = [];
    this.i = 0;
  }

  updatePicture(): void {
    if (
      this.usersSource[this.i].Picture != '' &&
      this.usersSource[this.i].Picture !== undefined &&
      this.usersSource[this.i].ImageType != '' &&
      this.usersSource[this.i].ImageType !== undefined
    ) {
      this.usersSource[this.i].Picturesrc = this.usersSource[this.i].Picture;
      this.usersSource[this.i].hasImage = true;
    } else {
      this.usersSource[this.i].Picturesrc =
        '../../../../assets/images/profile.png';
      this.usersSource[this.i].hasImage = false;
    }
    this.i = this.i + 1;
  }

  convertToImage(binary: any, imageType: string): any {
    var slashIndex = binary.indexOf('base64');
    var base64 = true;
    if (slashIndex == -1) {
      slashIndex = binary.indexOf('/');
      base64 = false;
    }
    const newIndex = slashIndex + (base64 ? 6 : 0);
    const newBinary = binary.substring(newIndex, binary.length - newIndex);

    const str = 'data:' + imageType + ';base64,' + newBinary;

    return str;
  }

  ngAfterViewInit(): void {}

  open(type: string, userid: any) {
    if (type === 'role') {
      this.ref = this.dialogService.open(ChangeRoleComponent, {
        header: 'Change User Role',
        data: {
          id: userid,
        },
        width: '40%',
        contentStyle: { overflow: 'none' },
        baseZIndex: 10000,
        maximizable: false,
      });

      this.ref.onClose.subscribe((data: any) => {
        if (data) {
          this.loadUsers(null);
        }
      });
    }
  }

  ManageUser(id: number, user: User): void {
    switch (id) {
      case 1:
        this.router.navigate(['/register/' + user.id]);
        break;
      case 2:
        this.open('role', user.id);
        break;
      case 3:
      case 4:
        this.userService.manageUser(id, user.id).subscribe({
          next: (data) => {
            let results = new Result(data);
            this.messageService.add({
              severity: results.success ? 'success' : 'error',
              summary: 'Disney',
              detail: results.message,
            });
            this.loadUsers(null);
          },
          error: (data) => {
            let results = new Result(data);
            this.messageService.add({
              severity: 'error',
              summary: 'Disney',
              detail: results.message,
            });
          },
        });
        break;
      case 5:
        this.Delete(user.id);
        break;
    }
  }

  Delete(id: any): void {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptIcon: 'pi pi-fw pi-recycle',
      rejectIcon: 'pi pi-fw pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.userService.deleteUser(id).subscribe({
          next: (data) => {
            let results = new Result(data);
            this.messageService.add({
              severity: results.success ? 'success' : 'error',
              summary: 'Disney',
              detail: results.message,
            });
            this.loadUsers(null);
          },
          error: (data) => {
            let results = new Result(data);
            this.messageService.add({
              severity: 'error',
              summary: 'Disney',
              detail: results.message,
            });
          },
        });
      },
      reject: () => {},
    });
  }
}
