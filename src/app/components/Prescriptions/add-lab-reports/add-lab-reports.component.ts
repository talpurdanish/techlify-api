import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Roles } from 'src/app/models/Roles';
import { Login } from 'src/app/models/login';
import { Result } from 'src/app/models/result';
import { StorageService } from 'src/app/services/storage.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-add-lab-reports',
  templateUrl: './add-lab-reports.component.html',
  styleUrls: ['./add-lab-reports.component.css'],
})
export class AddLabReportsComponent implements OnInit {
  @Output() UpdateLabTests = new EventEmitter<
    { label: string; key: string; id: number }[]
  >();
  selectedValues: { label: string; key: string; id: number }[] = [];
  mainForm: FormGroup;
  LabTests: { label: string; key: string; id: number }[] = [];
  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  currentUser: Login = new Login();
  constructor(
    private formBuilder: FormBuilder,
    private testService: TestService,
    private messageService: MessageService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.mainForm = this.formBuilder.group({
      tests: new FormArray([]),
    });
  }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.isAdmin = this.currentUser.role == Roles.Administrator;
      this.isDoctor = this.currentUser.role == Roles.Doctor;
      this.isStaff = this.currentUser.role == Roles.Staff;
      if (!this.isAdmin && !this.isDoctor) {
        this.router.navigate(['/Prescriptions']);
      }
      this.populateTests();
    } else {
      this.router.navigate(['/login']);
    }
  }

  populateTests() {
    if (this.isAdmin || this.isDoctor)
      this.testService.getTests(null).subscribe({
        next: (data) => {
          var jsonObj = JSON.stringify(data.results);
          var uData = JSON.parse(jsonObj);
          for (const prop in uData) {
            let jsonObj = JSON.stringify(uData[prop]);
            var obj = JSON.parse(jsonObj);
            this.LabTests.push({
              label: obj.name,
              key: this.getKey(obj.name),
              id: obj.id,
            });
            this.addCheckboxes();
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

  getKey(obj: string): string {
    return obj.toLowerCase().replace(' ', '');
  }

  updateSelectedLabTests() {
    if (this.isAdmin || this.isDoctor)
      this.selectedValues = this.mainForm.value.tests
        .map((checked, i) => (checked ? this.LabTests[i] : null))
        .filter((v) => v !== null);
    console.log('mainform ' + JSON.stringify(this.selectedValues));
    this.UpdateLabTests.emit(this.selectedValues);
    this.mainForm.reset();
  }

  get testsFormArray() {
    return this.mainForm.controls['tests'] as FormArray;
  }

  private addCheckboxes() {
    if (this.isAdmin || this.isDoctor)
      this.LabTests.forEach(() =>
        this.testsFormArray.push(new FormControl(false))
      );
  }
}
