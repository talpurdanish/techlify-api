import { CommonFunctions } from './../../../helper/common.function';
import { ValidationService } from 'src/app/services/Validation.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { CityService } from './../../../services/city.service';
import { Component, Inject, Injector, Input, OnInit } from '@angular/core';

import { ProvincesService } from 'src/app/services/provinces.service';
import { Province } from 'src/app/models/provinces';
import { City } from 'src/app/models/city';
import { Role } from 'src/app/models/Role';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { Result } from 'src/app/models/result';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() requiredFileType: string;

  fileName = '';
  profilepic = '';
  isSuccessful = false;
  isSignUpFailed = false;
  isSubmitted = false;
  errorMessage = '';
  provincesList: Province[] = [];
  rolesList: Role[] = [];
  citiesList: City[] = [];
  currentDate: Date = new Date();
  todaymax2: NgbDateStruct;
  startDate: NgbDateStruct;
  userForm: FormGroup;
  isEdit: boolean = false;

  constructor(
    private provinceService: ProvincesService,
    private cityService: CityService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,

    @Inject(Injector) private readonly injector: Injector
  ) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const day = this.currentDate.getDate();
    this.todaymax2 = { year: year, month: month + 1, day: day };
    this.createForm();
  }
  private get toasterService() {
    return this.injector.get(ToastrService);
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.PopulateEditvalue();
      this.FillProvinceList();
      this.FillCitiesList(1);
      this.FillRolesList();
      this.startDate = this.todaymax2;
      this.route.params.subscribe((param) => {
        console.log(param);
        if (param && param['id']) {
          this.userService.getUser(param['id']).subscribe({
            next: (data) => {
              let jsonObj = JSON.stringify(data);
              let result = JSON.parse(jsonObj) as User;
              this.PopulateValues(result);
              this.isEdit = true;
            },
            error: (err) => {
              let results = new Result(err);
              this.toasterService.error(
                results.message,
                'Federal Medical and Dental Clinic',
                {
                  timeOut: 3000,
                }
              );
              this.router.navigate(['/users']);
            },
          });
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  PopulateEditvalue(): void {
    let user = JSON.stringify(history.state.data);

    if (user != undefined) {
      this.userService.getUser(history.state.data.userId).subscribe({
        next: (data) => {
          // let jsonObj = JSON.stringify(data);
          let result = new User(data);

          this.PopulateValues(result);
        },
        error: (err) => {
          let results = new Result(err);
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

  // Fill Methods
  FillCitiesList(provinceId: number): void {
    this.citiesList = [];

    this.cityService.getCities(provinceId).subscribe({
      next: (data) => {
        for (const prop in data) {
          var city: City = Object.assign(new City(), data[prop]);

          this.citiesList.push(city);
        }
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

  FillProvinceList(): void {
    this.provinceService.getProvinces().subscribe({
      next: (data) => {
        for (const prop in data) {
          var province: Province = Object.assign(new Province(), data[prop]);

          this.provincesList.push(province);
        }
      },
      error: (err) => {
        let results = new Result(err);
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

  onProvinceSelected(event): void {
    const value = event.target.value;
    if (value > 0) {
      this.FillCitiesList(value);
    }
    // this.selectedProvince = value;
  }

  // onCitySelected(event): void {
  //   const value = event.target.value;
  //   this.selectedCity = value;
  // }
  onDateSelect(event): void {
    this.dateofBirth.patchValue(new Date(event.target.value));
  }

  FillRolesList(): void {
    this.userService.getRoles().subscribe({
      next: (data) => {
        for (const prop in data) {
          var role: Role = Object.assign(new Role(), data[prop]);

          this.rolesList.push(role);
        }
      },

      error: (err) => {
        let results = new Result(err);
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

  changeDateofBirthFormat(value: string): string {
    var dateArray = value.split('-');
    var day = Number(dateArray[0]);
    if (day < 10) {
      dateArray[0] = '0' + dateArray[0];
    }
    var month = Number(dateArray[1]);
    if (month < 10) {
      dateArray[1] = '0' + dateArray[1];
    }
    var year = dateArray[2];
    var date =
      year + '-' + dateArray[1] + '-' + dateArray[0] + 'T00:00:00.000Z';
    return date;
  }

  changeCNICValue(value: string): string {
    var start = value.substring(0, 5);
    var middle = value.substring(5, 12);
    var end = value.substring(12, 13);

    return start + '-' + middle + '-' + end;
  }

  // onRoleSelected(event): void {
  //   this.selectedRole = event.target.value;
  // }
  phonePlaceHolder: string;
  onPhoneTypeSelected(event): void {
    const value = event.target.value;
    if (value == 2) {
      this.phoneNoMask = { mask: '+(92)00000-0000000' };
      this.phonePlaceHolder = '+(92)_____-_______';
    } else if (value == 1) {
      this.phoneNoMask = { mask: '0300-0000000' };
      this.phonePlaceHolder = '03__-_______';
    }
  }
  //Form Submit
  onSubmit(): void {
    this.isSubmitted = true;
    if (this.userForm.dirty && this.userForm.valid) {
      var fname = this.uname.value;
      var fusername = this.username.value;
      var faddress = this.address.value;
      // var fpictureURL = this.pictureURL.value;
      var fdob = this.changeDateofBirthFormat(this.dateofBirth.value);
      var fgender = this.gender.value;
      var fcnic = this.changeCNICValue(this.cnic.value);
      var fpmdcNo = this.pmdcNo.value;
      var fcityId = this.cityId.value;
      var froleId = this.roleId.value;
      var fprovinceId = this.provinceId.value;
      var fphoneNo = this.phoneNo.value;
      var fphoneType = this.phoneType.value;
      var fid = this.userId.value;
      this.userService
        .createOrUpdate(
          this.isEdit ? fid : '-1',
          fname,
          fusername,
          faddress,
          fdob,
          fgender,
          fcnic,
          fpmdcNo,
          fcityId,
          froleId,
          fprovinceId,
          fphoneNo,
          fphoneType,
          this.profilepic
        )
        .subscribe({
          next: (data) => {
            let result = new Result(data);
            this.errorMessage = result.message;
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            this.userForm.reset();
            this.isSubmitted = false;
          },
          error: (err) => {
            let result = new Result(err);
            this.errorMessage = result.message;
            this.isSignUpFailed = true;
          },
        });
    }
  }

  //Mask Variables and Function
  cnicMask = {
    mask: '00000-0000000-0',
  };

  phoneNoMask: { mask: string }; //   mask: this.phoneNoFunc,

  onAccept() {
    console.log('on accept');
  }
  onComplete() {
    console.log('on complete');
  }

  //File Upload Functions
  imageSrc: string = '../../../../assets/images/profile.png';
  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageSrc = reader.result as string;
        };
      }

      this.convertFile(event.target.files[0]).subscribe((base64) => {
        this.profilepic = base64;
      });
    }
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }

  cancelUpload() {
    this.userService.cancelUpload();
  }

  reset() {
    this.userService.reset();
    this.userForm.reset();
  }

  samplePatchValues() {
    this.userForm.patchValue({
      username: 'talpurdanish',
      uname: 'Danish',
      address: 'House no 2040 st 69 i-10/1',
      dateofBirth: '1983/21/07',
      gender: 1,
      cnic: '61101-09876565-1',
      pmdcNo: '123',
      cityId: 1,
      roleId: 1,
      provinceId: 1,
      phoneNo: '03009876543',
      phoneType: 1,
      picture: '',
    });
  }

  PopulateValues(user: User) {
    try {
      this.startDate = CommonFunctions.ChangeDatetoNgbDatestruct(
        user.DateofBirth.toString()
      );
    } catch (e) {
      console.log(e);
    }

    this.userForm.patchValue({
      userId: user.UserId,
      username: user.Username,
      uname: user.Name,
      address: user.Address,
      dateofBirth: user.DateofBirth,
      gender: user.Gender,
      cnic: user.CNIC,
      pmdcNo: user.PMDCNo,
      cityId: user.CityId,
      roleId: user.RoleId,
      provinceId: user.ProvinceName,
      phoneNo: user.PhoneNo,
      phoneType: user.PhoneType,
      picture: user.Picture,
      isActive: user.IsActive,
    });
  }

  createForm() {
    this.userForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
        [ValidationService.usernameValidator(this.userService)],
      ],

      uname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      address: ['', [Validators.maxLength(250)]],
      dateofBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      cnic: [
        '',
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
        ],
        [ValidationService.cnicValidator(this.userService)],
      ],
      pmdcNo: [
        '',
        [Validators.required],
        [ValidationService.pmdcNoValidator(this.userService)],
      ],
      cityId: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
      provinceId: ['', [Validators.required]],
      phoneNo: [''],
      phoneType: [''],
      picture: [''],
      userId: [''],
      IsActive: [''],
    });
  }
  get userId() {
    return this.userForm.get('userId');
  }
  get username() {
    return this.userForm.get('username');
  }
  get uname() {
    return this.userForm.get('uname');
  }
  get address() {
    return this.userForm.get('address');
  }
  get dateofBirth() {
    return this.userForm.get('dateofBirth');
  }
  get gender() {
    return this.userForm.get('gender');
  }
  get cnic() {
    return this.userForm.get('cnic');
  }
  get pmdcNo() {
    return this.userForm.get('pmdcNo');
  }
  get cityId() {
    return this.userForm.get('cityId');
  }
  get roleId() {
    return this.userForm.get('roleId');
  }
  get provinceId() {
    return this.userForm.get('provinceId');
  }
  get phoneNo() {
    return this.userForm.get('phoneNo');
  }
  get phoneType() {
    return this.userForm.get('phoneType');
  }
  get picture() {
    return this.userForm.get('picture');
  }
  get IsActive() {
    return this.userForm.get('isActive');
  }
}
