import { ViewRecieptsComponent } from './../../Reciepts/view-reciepts/view-reciepts.component';
import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/users';
import { Login } from 'src/app/models/login';

import { ModalService } from 'src/app/shared/modal/modal.service';

import { DatatableOptions } from '../../../models/DataTableOptions';
import { Subject } from 'rxjs';
import { FmdcModalService } from '../fmdc-modal/fmdc-modal.service';
import { ChangeRoleComponent } from '../change-role/change-role.component';
import { Result } from 'src/app/models/result';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
})
export class ViewUserComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: true })
  datatableElement: any = DataTableDirective;
  min: any = 0;
  max: any = 0;
  USERS: User[] = [];
  i = 0;
  data: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  usersAvailable: boolean;
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    $.fn.dataTable.ext.search.pop();
  }
  currentUser: Login = new Login();
  constructor(
    public userService: UserService,
    private storageService: StorageService,
    private router: Router,
    private modalService: ModalService,
    private viewContainerRef: ViewContainerRef,
    private customModal: FmdcModalService,
    @Inject(Injector) private readonly injector: Injector
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.getUsers();
    } else {
      this.router.navigate(['/login']);
    }

    this.dtOptions = DatatableOptions.GetOptions('users');
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }

  reload(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getUsers();
    });
  }

  showToast(): void {
    this.toasterService.success('');
  }
  modalRef;
  open(type: string, title: string, userid: number, uname: string) {
    if (type === 'role') {
      this.modalRef = this.customModal.showFeaturedDialog(
        ChangeRoleComponent,
        userid,
        title,
        uname
      );
      this.modalRef.result.then(
        (data: any) => {
          if (data) this.reload();
        },
        (reason: any) => {}
      );
    } else if (type === 'pwd') {
      this.modalRef = this.customModal.showFeaturedDialog(
        ChangePasswordComponent,
        userid,
        title,
        uname
      );
    } else if (type === 'gr') {
      this.modalRef = this.customModal.showFeaturedDialog(
        ViewRecieptsComponent,
        userid,
        title,
        uname
      );
    }
  }

  getUsers(): void {
    this.USERS = [];
    this.i = 0;
    this.userService.getUsers().subscribe({
      next: (data) => {
        for (const prop in data) {
          this.USERS.push(new User(data[prop]));
          this.updatePicture();
        }
        this.dtTrigger.next(this.dtOptions);
      },
    });
    this.usersAvailable = this.USERS.length > 0;
  }

  updatePicture(): void {
    if (this.USERS[this.i].Picture != '') {
      this.USERS[this.i].Picturesrc = this.USERS[this.i].Picture;
      this.USERS[this.i].hasImage = true;
    } else {
      this.USERS[this.i].Picturesrc = '../../../../assets/images/profile.png';
      this.USERS[this.i].hasImage = false;
    }
    this.i = this.i + 1;
  }

  openModal(
    e,
    modalTitle: string,
    modalText: string,
    modalType: string,
    open: boolean
  ) {
    e.preventDefault();
    if (open) {
      this.modalService.setRootViewContainerRef(this.viewContainerRef);
      this.modalService.addDynamicComponent(modalTitle, modalText, modalType);
    }
  }

  // EditUser(id: number): void {
  //   this.router.navigate(['/register'], id });
  // }

  ManageUser(type: string, id: number, uname: string = ''): void {
    if (type != 'addrole') {
      this.userService.manageUser(type, id).subscribe({
        next: (data) => {
          let results = new Result(data);
          this.toasterService.success(
            results.message,
            'Federal Medical and Dental Clinic',
            {
              timeOut: 3000,
            }
          );
          this.reload();
        },
        error: (data) => {
          let results = new Result(data);
          this.toasterService.error(
            results.message,
            'Federal Medical and Dental Clinic',
            {
              timeOut: 3000,
            }
          );
        },
      });
    } else {
      this.open('role', 'Change Role', id, uname);
    }
  }

  private get toasterService() {
    return this.injector.get(ToastrService);
  }

  Delete(id: number): void {
    var c = confirm('Are you sure you want to delete this user?');
    if (c) {
      this.userService.deleteUser(id).subscribe({
        next: (data) => {
          let results = new Result(data);
          this.toasterService.success(
            results.message,
            'Federal Medical and Dental Clinic',
            {
              timeOut: 3000,
            }
          );
          this.reload();
        },
        error: (data) => {
          let results = new Result(data);
          this.toasterService.error(
            results.message,
            'Federal Medical and Dental Clinic',
            {
              timeOut: 3000,
            }
          );
        },
      });
    }
  }
}
