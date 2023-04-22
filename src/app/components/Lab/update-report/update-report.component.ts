import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TestParameter } from 'src/app/models/Lab/TestParameter';
import { Roles } from 'src/app/models/Roles';
import { Login } from 'src/app/models/login';
import { Result } from 'src/app/models/result';
import { LabReportService } from 'src/app/services/labreport.service';
import { StorageService } from 'src/app/services/storage.service';
import { TestParameterService } from 'src/app/services/test-parameter.service';

@Component({
  selector: 'app-update-report',
  templateUrl: './update-report.component.html',
  styleUrls: ['./update-report.component.css'],
})
export class UpdateReportComponent implements OnInit, OnChanges {
  @Output() UpdateLabTests = new EventEmitter<boolean>();
  @Input() ID: number = -1;

  AddReportValuesForm: FormGroup;
  updateDisabled: boolean = false;
  Parameters: TestParameter[] = [];
  isSubmitted: boolean;
  paramvalues: { id: number; value: number }[] = [];
  currentUser: Login = new Login();
  isAdmin: boolean = false;
  isDoctor: boolean = false;
  isStaff: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private reportService: LabReportService,
    private messageService: MessageService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.AddReportValuesForm = this.formBuilder.group({
      parameters: new FormArray([]),
      ids: new FormArray([]),
    });
  }
  ngOnChanges() {
    this.populateTestParameters();
  }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.isAdmin = this.currentUser.role == Roles.Administrator;
      this.isDoctor = this.currentUser.role == Roles.Doctor;
      this.isStaff = this.currentUser.role == Roles.Staff;
      if (!this.isAdmin && !this.isStaff) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  populateTestParameters() {
    this.Parameters = [];
    if (this.ID > 0)
      this.reportService.getPendingParameters(this.ID).subscribe({
        next: (data) => {
          var jsonObj = JSON.stringify(data.results);
          var uData = JSON.parse(jsonObj);
          for (const prop in uData) {
            let jsonObj = JSON.stringify(uData[prop]);
            var obj = JSON.parse(jsonObj);
            const param = new TestParameter(obj);
            this.Parameters.push(param);
            this.addControls();
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

  get parameters() {
    return this.AddReportValuesForm.controls['parameters'] as FormArray;
  }

  private addControls() {
    this.Parameters.forEach(() =>
      this.parameters.push(new FormControl([0, [Validators.required]]))
    );
  }

  onSubmit(): void {
    this.paramvalues = [];
    this.Parameters.forEach((param, i) => {
      this.paramvalues.push({
        id: param.id,
        value: this.AddReportValuesForm.value.parameters[i],
      });
    });

    this.isSubmitted = true;
    if (this.AddReportValuesForm.dirty && this.AddReportValuesForm.valid) {
      if (this.paramvalues.length > 0 && this.ID > 0)
        this.reportService.updateValues(this.paramvalues, this.ID).subscribe({
          next: (data) => {
            let result = new Result(data);
            this.messageService.add({
              severity: result.success ? 'success' : 'error',
              summary: 'FMDC',
              detail: result.message,
            });
            if (result.success) {
              this.AddReportValuesForm.reset();
              this.UpdateLabTests.emit(true);
            }
          },
          error: (err) => {
            let result = new Result(err);
            this.messageService.add({
              severity: result.success ? 'success' : 'error',
              summary: 'FMDC',
              detail: result.message,
            });
            this.isSubmitted = false;
          },
        });
    }
  }

  validationErrors: string[] = [];
  validationErrorMessages: { key: string; error: string; message: string }[] =
    [];
  totalErrors: number = 0;

  getFormValidationErrors() {
    this.totalErrors = 0;
    this.validationErrors = [];
    Object.keys(this.AddReportValuesForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors =
        this.AddReportValuesForm.get(key).errors;
      if (controlErrors != null) {
        this.totalErrors++;
        Object.keys(controlErrors).forEach((keyError) => {
          this.validationErrors.push('One of the values is required');
        });
      }
    });
  }
}
