import { ProvinceService } from './../../../services/province.service';
import { CommonFunctions } from './../../../helper/common.function';
import { ValidationService } from 'src/app/services/Validation.service';
import { PatientService } from 'src/app/services/patient.service';
import { CityService } from './../../../services/city.service';
import { Component, Input, OnInit } from '@angular/core';
import { ErrorType, ValidationError } from '../../../models/ValidationError';
import { Province } from 'src/app/models/provinces';
import { AllValidationErrors } from '../../../lib/validators/AllValidationErrors';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { Result } from 'src/app/models/result';
import { Patient } from 'src/app/models/patient';
import { MessageService } from 'primeng/api';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { Login } from 'src/app/models/login';
import { Roles } from 'src/app/models/Roles';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patients.component.html',
  styleUrls: ['./add-patients.component.css'],
})
export class AddPatientComponent implements OnInit {
  @Input() requiredFileType: string;

  fileName = '';
  profilepic = '';
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
  bloodgroupsList: { Name: string }[];
  showErrors: boolean = false;

  currentUser: Login = new Login();
  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  myResetFunction(options: DropdownFilterOptions) {
    options.reset();
    this.filterValue = '';
  }

  constructor(
    private provinceService: ProvinceService,
    private cityService: CityService,
    private patientService: PatientService,
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

    this.bloodgroupsList = [
      { Name: 'A+' },
      { Name: 'A-' },
      { Name: 'B+' },
      { Name: 'B-' },
      { Name: 'AB+' },
      { Name: 'AB-' },
      { Name: 'O+' },
      { Name: 'O-' },
    ];
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.isAdmin = this.currentUser.role == Roles.Administrator;
      this.isDoctor = this.currentUser.role == Roles.Doctor;
      this.isStaff = this.currentUser.role == Roles.Staff;

      if (!this.isAdmin && !this.isStaff) {
        this.router.navigate(['/Patients']);
      }
      this.cityId.disable();
      this.FillProvinceList();

      this.route.params.subscribe((param) => {
        if (param && param['id']) {
          this.patientService.getPatient(param['id']).subscribe({
            next: (output) => {
              let results = new Result(output);
              var data = results.results;
              if (results.success) {
                let jsonObj = JSON.stringify(data);
                var userObj = JSON.parse(jsonObj);
                var patient = new Patient(userObj);
                this.isEdit = true;
                this.PopulateValues(patient);
              } else {
                this.router.navigate(['/Patients']);
              }
            },
            error: (err) => {
              let results = new Result(err);
              this.messageService.add({
                severity: 'error',
                summary: 'FMDC',
                detail: results.message,
              });

              // this.router.navigate(['/patients']);
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
    if (!this.isAdmin && !this.isStaff) {
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
  }

  FillProvinceList(): void {
    if (!this.isAdmin && !this.isStaff)
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
    if (!this.isAdmin && !this.isStaff)
      if (event.value != undefined && event.value != '') {
        this.FillCitiesList(event.value);
      }
  }
  OnBloodgroupSelected(event): void {
    if (!this.isAdmin && !this.isStaff)
      if (event.value != undefined) {
        this.bloodGroup.patchValue(event.value);
      }
  }

  onPhoneTypeSelected(event): void {
    if (!this.isAdmin && !this.isStaff) {
      const value = CommonFunctions.getPrimeNgDropdownValue(event.value);
      this.phoneNoMask = value == 1 ? '(999)999999999' : '0399-9999999';
    }
  }

  phoneNoMask: string = '0399-9999999';

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
          this.picture.patchValue(reader.result);
          this.imageType.patchValue(file.type);
        };
      }
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
    this.patientService.cancelUpload();
  }

  reset() {
    this.patientService.reset();
    this.mainForm.reset();
  }

  samplePatchValues() {}

  PopulateValues(patient: Patient) {
    if (!this.isAdmin && !this.isStaff)
      try {
        this.FillCitiesList(patient.ProvinceId);
        this.mainForm.patchValue({
          provinceId: patient.ProvinceId,
          Id: patient.id,
          name: patient.Name,
          fatherName: patient.FatherName,
          address: patient.Address,
          dateofBirth: CommonFunctions.ChangeSqlDatetoDate(
            patient.DateofBirth.toString()
          ),
          gender: patient.Gender,
          cnic: patient.CNIC,
          patientNumber: patient.PatientNumber,
          bloodGroup: patient.BloodGroup,

          phoneNo: patient.PhoneNo,
          phoneType: patient.PhoneType,
          // picture: patient.Picture,

          cityId: patient.CityId,
        });
      } catch (err) {}
  }

  createForm() {
    this.mainForm = this.fb.group({
      Id: [],
      PatientNumber: [],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      fatherName: [
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
        [ValidationService.patientcnicValidator(this.patientService)],
      ],

      cityId: ['', [Validators.required]],
      bloodGroup: ['', [Validators.required]],
      provinceId: ['', [Validators.required]],
      phoneNo: [''],
      phoneType: [''],
      picture: [''],
      imageType: [''],
    });
  }
  get Id() {
    return this.mainForm.get('Id');
  }
  get name() {
    return this.mainForm.get('name');
  }
  get fatherName() {
    return this.mainForm.get('fatherName');
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
  get patientNumber() {
    return this.mainForm.get('patientNumber');
  }
  get cityId() {
    return this.mainForm.get('cityId');
  }
  get bloodGroup() {
    return this.mainForm.get('bloodGroup');
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
  get provinceId() {
    return this.mainForm.get('provinceId');
  }
  get imageType() {
    return this.mainForm.get('imageType');
  }

  //Form Submit
  validationErrors: AllValidationErrors[] = [];
  totalErrors: number;
  onSubmit(): void {
    this.validationErrors = AllValidationErrors.getFormValidationErrors(
      this.mainForm.controls
    );
    this.totalErrors = this.validationErrors.length;
    if (this.isAdmin || this.isStaff) {
      this.isSubmitted = true;
      if (this.mainForm.dirty && this.mainForm.valid) {
        this.showErrors = false;
        var pname = this.name.value;
        var pfatherName = this.fatherName.value;
        var paddress = this.address.value;
        var pdob = CommonFunctions.changeDateofBirthFormat(
          this.dateofBirth.value
        );
        var pgender = this.gender.value;
        var pcnic = CommonFunctions.changeCNICValue(this.cnic.value);
        var pcityId = CommonFunctions.getPrimeNgDropdownValue(
          this.cityId.value
        );
        var pbloodGroup = this.bloodGroup.value;
        var pphoneNo = this.phoneNo.value;
        var pphoneType =
          CommonFunctions.getPrimeNgDropdownValue(this.phoneType.value) + '';
        var pid = this.Id.value;
        this.patientService
          .createOrUpdate(
            !this.isEdit ? '' : pid,
            pname,
            pfatherName,
            paddress,
            pgender,
            pphoneType,
            pphoneNo,
            pbloodGroup,
            pdob,
            pcnic,
            pcityId,
            this.picture.value,
            this.imageType.value
          )
          .subscribe({
            next: (data) => {
              let result = new Result(data);
              if (result.success) {
                this.errorMessage = result.message;
                this.isSuccessful = true;
                this.isSignUpFailed = false;
                this.mainForm.reset();
                this.isSubmitted = false;
              } else {
                this.errorMessage = result.message;
                this.isSignUpFailed = true;
              }
            },
            error: (err) => {
              let result = new Result(err);
              this.errorMessage = result.message;
              this.isSignUpFailed = true;
            },
          });
      } else {
        this.showErrors = true;
      }
    }
  }
}
