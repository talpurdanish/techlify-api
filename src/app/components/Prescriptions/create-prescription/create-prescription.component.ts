import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonFunctions } from 'src/app/helper/common.function';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';
import { Roles } from 'src/app/models/Roles';
import { Prescription } from 'src/app/models/details/prescription';
import { Login } from 'src/app/models/login';
import { Medication } from 'src/app/models/medication';
import { Patient } from 'src/app/models/patient';
import { PrescriptionMedication } from 'src/app/models/prescriptionMedication';
import { Result } from 'src/app/models/result';
import { MedicationService } from 'src/app/services/medication.service';
import { PatientService } from 'src/app/services/patient.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-create-prescription',
  templateUrl: './create-prescription.component.html',
  styleUrls: ['./create-prescription.component.css'],
})
export class CreatePrescriptionComponent implements OnInit {
  PatientID: number = 0;
  age: string = '';

  mainForm: FormGroup;
  AddVitalsForm: FormGroup;
  selectedLabTests: { label: string; key: string; id: number }[] = [];
  selectedLabTestString: string = '';
  medicationList: { Code: number; Name: string }[] = [];
  unitsList: { Name: string }[] = [];
  savePrescriptionDisabled: boolean = true;

  isSuccessful = false;
  isSignUpFailed = false;
  isSubmitted = false;
  result: Result;
  prescription: Prescription = new Prescription();

  loading: boolean = false;
  patientLoaded: boolean = false;

  showVitals: boolean = false;

  selectedMedicationList: { sno: number; content: string }[] = [];

  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  currentUser: Login = new Login();

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private medicineService: MedicationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.createForm();
    this.createVitalsForm();

    this.unitsList.push({ Name: 'Teaspoons' });
    this.unitsList.push({ Name: 'TableSpoons' });
    this.unitsList.push({ Name: 'Capsules' });
    this.unitsList.push({ Name: 'Tablets' });
    this.unitsList.push({ Name: 'Drops' });
  }

  updateSelectedLabTests(
    labtests: { label: string; key: string; id: number }[]
  ) {
    if (this.isAdmin || this.isDoctor) {
      this.selectedLabTests = [];
      this.selectedLabTests = labtests;
      this.prescription = this.storageService.getPrescription();
      if (this.prescription == null) this.populatePrescription();
      if (this.prescription != null && this.prescription != undefined) {
        this.selectedLabTests.forEach((test) => {
          this.prescription.Tests.push(test.id);
        });
      }
      this.storageService.removePrescription();
      this.storageService.savePrescription(this.prescription);
    }
  }

  createForm() {
    this.mainForm = this.formBuilder.group({
      diagnosis: ['', [Validators.maxLength(1000)]],
      remarks: ['', [Validators.maxLength(1000)]],
      medicationId: [''],
      quantity: [''],
      times: [''],
      unit: [''],
    });
  }

  get diagnosis() {
    return this.mainForm.get('diagnosis');
  }

  get remarks() {
    return this.mainForm.get('remarks');
  }

  get medicationId() {
    return this.mainForm.get('medicationId');
  }

  get quantity() {
    return this.mainForm.get('quantity');
  }

  get times() {
    return this.mainForm.get('times');
  }
  get unit() {
    return this.mainForm.get('unit');
  }

  fillMedicationList() {
    if (this.isAdmin || this.isDoctor)
      this.medicineService.getMedications(null).subscribe({
        next: (output) => {
          let results = new Result(output);
          var data = results.results;
          for (const prop in data) {
            let jsonObj = JSON.stringify(data[prop]);
            var obj = JSON.parse(jsonObj);
            var medicine = { Code: obj.code, Name: obj.name };
            this.medicationList.push(medicine);
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

  populatePrescription(): void {
    if (this.isAdmin || this.isDoctor)
      this.route.params.subscribe((param) => {
        if (param && param['id']) {
          this.prescriptionService
            .getPrescription(param['id'], true)
            .subscribe({
              next: (output) => {
                let results = new Result(output);
                var data = results.results;
                let jsonObj = JSON.stringify(data);
                console.log(jsonObj);
                var obj = JSON.parse(jsonObj);
                let prescription = new Prescription(obj);
                if (prescription.PatientId > 0) {
                  if (prescription.Medicines == null)
                    prescription.Medicines = [];
                  this.storageService.savePrescription(prescription);
                  this.load();
                }
              },
              error: (err: any) => {
                let results = new Result(err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'FMDC',
                  detail: results.message,
                });
              },
            });
        }
      });
  }

  reset() {
    this.storageService.removePrescription();
  }
  load(): void {
    if (this.isAdmin || this.isDoctor) {
      this.loading = true;

      this.prescription = this.storageService.getPrescription();
      if (this.prescription == null) this.populatePrescription();
      if (this.prescription != null && this.prescription != undefined) {
        this.PatientID = this.prescription.PatientId;
        this.patientLoaded = true;
      }
      this.loading = false;
    }
  }

  deleteMedicine(id: number): void {
    if (this.isAdmin || this.isDoctor)
      if (id > 0) {
        var medicines = this.prescription.Medicines;
        this.prescription.Medicines = [];
        this.selectedMedicationList = [];

        medicines.forEach((element) => {
          if (element.sno != id) {
            this.prescription.Medicines.push(element);
            this.prescription.MedicineStrings.push(element.ToOutput());
            this.selectedMedicationList.push({
              sno: element.sno,
              content: element.ToString(),
            });
          }
        });

        if (this.prescription.Medicines.length == 0) {
          this.savePrescriptionDisabled = true;
        }
        this.storageService.savePrescription(this.prescription);
        this.load();
      }
  }

  updateVitals() {
    if (this.isAdmin || this.isDoctor) {
      this.prescription = this.storageService.getPrescription();
      if (this.prescription == null) this.populatePrescription();
      if (this.prescription != null && this.prescription != undefined) {
        this.prescription.Bp = this.bp.value;
        this.prescription.Bsr = this.bsr.value;
        this.prescription.Pulse = this.pulse.value;
        this.prescription.Temp = this.temp.value;
        this.prescription.Wt = this.wt.value;
        this.prescription.Ht = this.ht.value;
      }
      this.storageService.removePrescription();
      this.storageService.savePrescription(this.prescription);
      this.showVitals = true;
    }
  }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.isAdmin = this.currentUser.role == Roles.Administrator;
      this.isDoctor = this.currentUser.role == Roles.Doctor;
      this.isStaff = this.currentUser.role == Roles.Staff;
      if (!this.isAdmin && !this.isDoctor) {
        this.router.navigate(['/login']);
      }
      this.fillMedicationList();
      this.populatePrescription();
    } else {
      this.router.navigate(['/login']);
    }
  }

  validationErrors: AllValidationErrors[] = [];
  totalErrors: number;
  onSubmit(): void {
    this.validationErrors = AllValidationErrors.getFormValidationErrors(
      this.mainForm.controls
    );
    this.totalErrors = this.validationErrors.length;
    if (this.isAdmin || this.isDoctor) {
      var prescription = this.storageService.getPrescription();

      if (prescription.Medicines.length > 0) {
        this.prescriptionService
          .createPrescription(
            prescription.Appointmentid,
            prescription.PatientId,
            prescription.DoctorId,
            prescription.MedicineStrings,
            prescription.Tests,
            prescription.Bp,
            prescription.Pulse,
            prescription.Bsr,
            prescription.Temp,
            prescription.Wt,
            prescription.Ht,
            this.diagnosis.value,
            this.remarks.value
          )
          .subscribe({
            next: (data) => {
              let results = new Result(data);
              this.messageService.add({
                severity: results.success ? 'success' : 'error',
                summary: 'FMDC',
                detail: results.message,
              });
              if (results.success) {
                // this.router.navigate(['/Patients']);
              }
            },
            error: (err: any) => {
              let results = new Result(err);
              this.messageService.add({
                severity: 'error',
                summary: 'FMDC',
                detail: results.message,
              });
              // this.router.navigate(['/Patients']);
            },
          });
      }
    }
  }

  addMedicine() {
    if (this.isAdmin || this.isDoctor) {
      const id = CommonFunctions.getPrimeNgDropdownValue(
        this.medicationId.value
      );
      const quantity = this.quantity.value;
      const units = this.unit.value;
      const times = this.times.value;
      if (id > 0 && quantity > 0 && units != '' && times > 0) {
        this.medicineService.getMedication(id).subscribe({
          next: (output) => {
            let results = new Result(output);
            var data = results.results;

            let jsonObj = JSON.stringify(data);

            const obj = JSON.parse(jsonObj);
            var medicine = new Medication();
            medicine.Code = obj.code;
            medicine.Name = obj.name;
            var sno = this.prescription.Medicines.length + 1;

            var pMedicine = new PrescriptionMedication();
            pMedicine.Code = medicine.Code;
            pMedicine.Medicine = medicine.Name;
            pMedicine.Quantity = quantity;
            pMedicine.Units = units;
            pMedicine.Times = times;
            pMedicine.PrescriptionId = this.prescription.id;
            this.prescription.Medicines.push(pMedicine);
            this.prescription.MedicineStrings.push(pMedicine.ToOutput());
            this.storageService.savePrescription(this.prescription);

            this.selectedMedicationList.push({
              sno: sno,
              content: pMedicine.ToString(),
            });

            // this.load();
            this.savePrescriptionDisabled = false;
          },
        });
      }
    }
  }

  createVitalsForm() {
    this.AddVitalsForm = this.formBuilder.group({
      bp: [''],
      pulse: [''],
      bsr: [''],
      temp: [''],
      wt: [''],
      ht: [''],
    });
  }

  get bp() {
    return this.AddVitalsForm.get('bp');
  }

  get pulse() {
    return this.AddVitalsForm.get('pulse');
  }

  get bsr() {
    return this.AddVitalsForm.get('bsr');
  }

  get temp() {
    return this.AddVitalsForm.get('temp');
  }

  get wt() {
    return this.AddVitalsForm.get('wt');
  }
  get ht() {
    return this.AddVitalsForm.get('ht');
  }
}
