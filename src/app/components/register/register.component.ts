import { ProvinceService } from 'src/app/services/province.service';
import { CommonFunctions } from 'src/app/helper/common.function';
import { ValidationService } from 'src/app/services/Validation.service';
import { UserService } from 'src/app/services/user.service';
import { CityService } from 'src/app/services/city.service';
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
import { Roles } from 'src/app/models/Roles';

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
  citiesList = [];
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
    private router: Router,
    private storageService: StorageService,

    private messageService: MessageService
  ) {
    this.createForm();

    this.genders = [
      { Name: 'Male', id: '0' },
      { Name: 'Female', id: '1' },
      { Name: 'Other', id: '2' },
    ];
  }

  ngOnInit(): void {
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
              summary: 'Disney',
              detail: results.message,
            });

            // this.router.navigate(['/users']);
          },
        });
      }
    });
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
          summary: 'Disney',
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
          summary: 'Disney',
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
        var finalPicData = this.imageSrc.replace(
          'data:' + file.type + ';base64,',
          ''
        );
        alert(finalPicData);
        this.picture.patchValue(finalPicData);
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

  PopulateValues(user: User) {
    try {
      this.mainForm.patchValue({
        userId: user.id,
        username: user.Username,
        uname: user.Name,
        dateofBirth: CommonFunctions.ChangeSqlDatetoDate(
          user.DateofBirth.toString()
        ),
        gender: user.Gender,
        phoneNo: user.PhoneNo,
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

      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(6),
          Validators.maxLength(25),
          ValidationService.matchValidator('confirmpassword', true),
        ],
      ],
      confirmpassword: [
        '',
        [
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.required,
          ValidationService.matchValidator('password'),
        ],
      ],

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      dateofBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      provinceId: ['', [Validators.required]],
      phoneNo: [''],
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

  get dateofBirth() {
    return this.mainForm.get('dateofBirth');
  }
  get gender() {
    return this.mainForm.get('gender');
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
  get password() {
    return this.mainForm.get('password');
  }
  get confirmpassword() {
    return this.mainForm.get('confirmpassword');
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
      var fpassword = this.password.value;
      var fdob = this.dateofBirth.value;
      var fgender = this.gender.value;
      var fcityId = CommonFunctions.getPrimeNgDropdownValue(this.cityId.value);
      var froleId = Roles.User;
      var fphoneNo = this.phoneNo.value;
      var fid = this.userId.value;

      this.userService
        .createOrUpdate(
          this.isEdit ? fid : '-1',
          fname,
          fusername,
          fpassword,
          fdob,
          fgender,
          fcityId,
          froleId,
          fphoneNo,
          this.picture.value
        )
        .subscribe({
          next: (data) => {
            let result = new Result(data);

            this.messageService.add({
              severity: result.success ? 'success' : 'error',
              summary: 'Disney',
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
              summary: 'Disney',
              detail: results.message,
            });
          },
        });
    }
  }
}
