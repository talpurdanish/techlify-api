import { ProvinceService } from 'src/app/services/province.service';
import { CommonFunctions } from './../../../helper/common.function';
import { ValidationService } from 'src/app/services/Validation.service';
import { UserService } from 'src/app/services/user.service';
import { CityService } from './../../../services/city.service';
import { Component, Input, OnInit } from '@angular/core';

import { Province } from 'src/app/models/provinces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { Result } from 'src/app/models/result';
import { User } from 'src/app/models/users';
import { MessageService } from 'primeng/api';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() requiredFileType: string;

  isSuccessful = false;
  isSignUpFailed = false;
  isSubmitted = false;
  errorMessage = '';
  provincesList = [];
  rolesList = [];
  citiesList = [];
  phoneTypes = [];
  genders = [];
  currentDate: Date = new Date();
  minDateValue: Date;
  maxDateValue: Date = new Date();

  mainForm: FormGroup;
  isEdit: boolean = false;

  selectedProvince: Province;
  filterValue = '';

  phoneNoMask: string;
  imageSrc: string = '../../../../assets/images/profile.png';

  constructor(
    private provinceService: ProvinceService,
    private cityService: CityService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.createForm();
    this.phoneTypes = [
      { Name: 'Mobile', id: '0' },
      { Name: 'Landline', id: '1' },
    ];
    this.genders = [
      { Name: 'Male', id: '0' },
      { Name: 'Female', id: '1' },
      { Name: 'Other', id: '2' },
    ];
    this.rolesList = [
      { Name: 'Administrator', id: '0' },
      { Name: 'Doctor', id: '1' },
      { Name: 'Staff', id: '2' },
    ];
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.cityId.disable();
      this.FillProvinceList();
      this.username.enable();
      this.route.params.subscribe((param) => {
        if (param && param['id']) {
          this.userService.getUser(param['id']).subscribe({
            next: (output) => {
              let results = new Result(output);
              var data = results.results;
              if (results.success) {
                let jsonObj = JSON.stringify(data);
                var userObj = JSON.parse(jsonObj);
                var user = new User(userObj);
                this.isEdit = true;

                this.PopulateValues(user);
                this.username.disable();
              } else {
                this.router.navigate(['/Users']);
              }
            },
            error: (err) => {
              let results = new Result(err);
              this.messageService.add({
                severity: 'error',
                summary: 'FMDC',
                detail: results.message,
              });

              // this.router.navigate(['/users']);
            },
          });
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Fill Methods
  FillCitiesList(provinceId: number): void {
    this.citiesList = [];

    this.cityService.getCities(provinceId).subscribe({
      next: (data) => {
        let results = new Result(data);
        var cities = results.results;
        for (const prop in cities) {
          var cObj = JSON.stringify(cities[prop]);
          var city = JSON.parse(cObj);
          this.citiesList.push({ Name: city.name, id: city.id });
        }
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
      },
    });
  }

  FillProvinceList(): void {
    this.provinceService.getProvinces().subscribe({
      next: (data) => {
        let results = new Result(data);
        var provinces = results.results;
        for (const prop in provinces) {
          var pObj = JSON.stringify(provinces[prop]);
          var province = JSON.parse(pObj);
          this.provincesList.push({ Name: province.name, id: province.id });
        }
        this.cityId.enable();
      },
      error: (err) => {
        let results = new Result(err);
        this.messageService.add({
          severity: 'error',
          summary: 'FMDC',
          detail: results.message,
        });
      },
    });
  }

  onProvinceSelected(event: any): void {
    if (event.value != undefined && event.value != '') {
      this.FillCitiesList(event.value);
    }
  }

  onPhoneTypeSelected(event: any): void {
    const value = CommonFunctions.getPrimeNgDropdownValue(event.value);
    this.phoneNoMask = value == 1 ? '(999)9999999999' : '0399-9999999';
  }
  myResetFunction(options: DropdownFilterOptions) {
    options.reset();
    this.filterValue = '';
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length) {
      const reader = new FileReader();
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.picture.patchValue(reader.result);
        this.imageType.patchValue(file.type);
      };
    }
  }

  cancelUpload() {
    this.userService.cancelUpload();
  }

  reset() {
    this.userService.reset();
    this.mainForm.reset();
  }

  patchSampleValues() {
    this.mainForm.patchValue({
      username: 'talpurdanish',
      uname: 'Danish',
      address: 'House no 2040 st 69 i-10/1',
      dateofBirth: '07/21/1983',
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
      this.mainForm.patchValue({
        userId: user.id,
        username: user.Username,
        uname: user.Name,
        address: user.Address,
        dateofBirth: CommonFunctions.ChangeSqlDatetoDate(
          user.DateofBirth.toString()
        ),
        gender: user.Gender,
        cnic: user.CNIC,
        pmdcNo: user.PMDCNo,

        phoneNo: user.PhoneNo,
        phoneType: user.PhoneType,
        // picture: user.Picture,
        isActive: user.IsActive,
      });
      this.username.disable();
    } catch (err) {}
  }

  createForm() {
    this.mainForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
        [ValidationService.usernameValidator(this.userService)],
      ],

      name: [
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
          Validators.minLength(15),
          Validators.maxLength(15),
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
      imageType: [''],
    });
  }
  get userId() {
    return this.mainForm.get('userId');
  }
  get username() {
    return this.mainForm.get('username');
  }
  get name() {
    return this.mainForm.get('name');
  }
  get address() {
    return this.mainForm.get('address');
  }
  get dateofBirth() {
    return this.mainForm.get('dateofBirth');
  }
  get gender() {
    return this.mainForm.get('gender');
  }
  get cnic() {
    return this.mainForm.get('cnic');
  }
  get pmdcNo() {
    return this.mainForm.get('pmdcNo');
  }
  get cityId() {
    return this.mainForm.get('cityId');
  }
  get roleId() {
    return this.mainForm.get('roleId');
  }
  get provinceId() {
    return this.mainForm.get('provinceId');
  }
  get phoneNo() {
    return this.mainForm.get('phoneNo');
  }
  get phoneType() {
    return this.mainForm.get('phoneType');
  }
  get picture() {
    return this.mainForm.get('picture');
  }
  get IsActive() {
    return this.mainForm.get('IsActive');
  }
  get imageType() {
    return this.mainForm.get('imageType');
  }

  validationErrors: AllValidationErrors[] = [];
  totalErrors: number;
  onSubmit(): void {
    this.validationErrors = AllValidationErrors.getFormValidationErrors(
      this.mainForm.controls
    );
    this.totalErrors = this.validationErrors.length;
    this.isSubmitted = true;
    if (this.mainForm.dirty && this.mainForm.valid) {
      var fname = this.name.value;
      var fusername = this.username.value;
      var faddress = this.address.value;
      var fdob = this.dateofBirth.value;
      var fgender = this.gender.value;
      var fcnic = CommonFunctions.changeCNICValue(this.cnic.value);
      var fpmdcNo = this.pmdcNo.value;
      var fcityId = CommonFunctions.getPrimeNgDropdownValue(this.cityId.value);
      var froleId = this.roleId.value;
      var fprovinceId = this.provinceId.value;
      var fphoneNo = this.phoneNo.value;
      var fphoneType =
        CommonFunctions.getPrimeNgDropdownValue(this.phoneType.value) + '';
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
          fphoneNo,
          fphoneType,
          this.picture.value
        )
        .subscribe({
          next: (data) => {
            let result = new Result(data);

            this.messageService.add({
              severity: result.success ? 'success' : 'error',
              summary: 'FMDC',
              detail: result.message,
            });

            if (result.success) {
              this.mainForm.reset();
              this.isSubmitted = false;
            }
          },
          error: (err) => {
            let results = new Result(err);
            this.messageService.add({
              severity: 'error',
              summary: 'FMDC',
              detail: results.message,
            });
          },
        });
    }
  }
}
