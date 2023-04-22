import { SlipComponent } from './../Slip/Slip.component';
import { AppointmentService } from './../../../services/appointment.service';
import { AddStartComponent } from './../../Appointments/add-start/add-start.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageService } from './../../../services/storage.service';
import { MenuItem, MessageService } from 'primeng/api';
import { PatientService } from 'src/app/services/patient.service';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Result } from 'src/app/models/result';
import { Patientsbuttons } from 'src/app/models/patientsbuttons';
import { ContextMenu } from 'primeng/contextmenu';
import { Roles } from 'src/app/models/Roles';

@Component({
  selector: 'app-appointment-buttons',
  templateUrl: './appointment-buttons.component.html',
  styleUrls: ['./appointment-buttons.component.css'],
})
export class AppointmentButtonsComponent implements OnInit {
  @Input('PatientId') PatientId = -1;
  @Output() updated = new EventEmitter<boolean>();
  patientButton: Patientsbuttons = new Patientsbuttons();
  role: string;
  ref: DynamicDialogRef;
  disabled: boolean = true;
  items: MenuItem[] = [];
  isAdmin = false;
  isDoctor = false;
  isStaff = false;
  constructor(
    private patientService: PatientService,
    private messageService: MessageService,
    private storageService: StorageService,
    private dialogService: DialogService,
    private apptService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.storageService.getUser();
    this.isAdmin = currentUser.role == Roles.Administrator;
    this.isDoctor = currentUser.role == Roles.Doctor;
    this.isStaff = currentUser.role == Roles.Staff;
    if (this.isAdmin || this.isStaff)
      if (this.PatientId > 0)
        this.patientService.getAppointButtons(this.PatientId).subscribe({
          next: (output) => {
            let results = new Result(output);
            var data = results.results;

            let jsonObj = JSON.stringify(data);
            var Obj = JSON.parse(jsonObj);
            this.patientButton.StartVisible = Obj.startVisible;
            this.patientButton.EndVisible = Obj.endVisible;
            this.patientButton.RecieptVisible = Obj.recieptVisible;
            this.patientButton.PrescriptionVisible = Obj.prescriptionVisible;
            this.patientButton.AId = Obj.aId;
            this.disabled =
              !this.patientButton.StartVisible &&
              !this.patientButton.EndVisible &&
              !this.patientButton.RecieptVisible &&
              !this.patientButton.PrescriptionVisible;

            this.addMenuItems();
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

  // showContext(cm: ContextMenu, event: MouseEvent) {
  //   cm.show(event);
  //   event.stopPropagation();
  // }

  addMenuItems() {
    if (this.isAdmin || this.isStaff) {
      if (this.patientButton.StartVisible)
        this.items.push({
          label: 'Start Appointment',
          icon: 'pi pi-fw pi-angle-double-right',
          command: () => this.Manage(1),
        });

      if (this.patientButton.EndVisible) {
        if (this.patientButton.PrescriptionVisible && this.isDoctor)
          this.items.push({
            label: 'Add Prescription',
            icon: 'pi pi-fw pi-mobile',
            command: () => this.Manage(2),
          });
        this.items.push({
          label: 'Print Slip',
          icon: 'pi pi-fw pi-print',
          command: () => this.Manage(3),
        });

        this.items.push({
          label: 'End Appointment',
          icon: 'pi pi-fw pi-angle-double-left',
          command: () => this.Manage(4),
        });
      }
      if (
        this.patientButton.RecieptVisible &&
        (this.role == 'Administrator' || this.role == 'staff')
      )
        this.items.push({
          label: 'Print Reciept',
          icon: 'pi pi-fw pi-calendar',
          command: () => this.Manage(5),
        });
    }
  }
  update(value: boolean) {
    this.updated.emit(value);
  }

  open(type: number, id: number) {
    if (this.isAdmin || this.isStaff)
      if (type === 1) {
        this.ref = this.dialogService.open(AddStartComponent, {
          header: 'Add Appointment',
          data: {
            id: id,
            type: 1,
          },
          width: '40%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: false,
        });

        this.ref.onClose.subscribe((data: any) => {
          this.update(true);
        });
      } else if (type === 2) {
        this.ref = this.dialogService.open(SlipComponent, {
          header: 'View Slip',
          data: {
            id: this.PatientId,
          },
          width: '70%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
        });
      }
  }

  //1 Start
  //2 Prescription
  //3 Slip
  //4 End
  //5 Reciept
  Manage(type: number): void {
    if (this.isAdmin || this.isStaff)
      if (this.PatientId > 0) {
        switch (type) {
          case 1:
            this.open(1, this.PatientId);
            break;
          case 2:
            this.router.navigate([
              '/CreatePrescription/' + this.patientButton.AId,
            ]);
            break;
          case 3:
            this.open(2, this.PatientId);
            break;
          case 4:
            this.addEndDate();
            break;
          case 5:
            this.router.navigate(['/CreateReciept/' + this.PatientId]);
            break;
        }
      }
  }

  addEndDate() {
    if (this.isAdmin || this.isStaff)
      this.apptService.addEndDate(this.PatientId, 'p').subscribe({
        next: (data) => {
          let results = new Result(data);
          this.messageService.add({
            severity: results.success ? 'success' : 'error',
            summary: 'FMDC',
            detail: results.message,
          });
          this.update(results.success);
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
