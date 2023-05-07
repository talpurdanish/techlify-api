import { RecieptReportComponent } from './components/Reciepts/reciept-report/reciept-report.component';
import { ViewRecieptsComponent } from './components/Reciepts/view-reciepts/view-reciepts.component';
import { CreateRecieptComponent } from './components/Reciepts/CreateReciept/CreateReciept.component';
import { ViewAppointmentsComponent } from './components/Appointments/ViewAppointments/ViewAppointments.component';
import { PatientDetailComponent } from './components/Patients/patient-detail/patient-detail.component';
import { AddPatientComponent } from './components/Patients/add-patients/add-patients.component';
import { ViewPatientComponent } from './components/Patients/view-patients/view-patients.component';
import { ErrorNotFoundComponent } from './shared/_layouts/errorpages/error-not-found/error-not-found.component';
import { AuthGuard } from './security/auth.guard';

import { ViewUserComponent } from './components/Users/view-user/view-user.component';
import { LoginLayoutComponent } from './shared/_layouts/login-layout/login-layout.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './components/Users/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

import { SiteLayoutComponent } from './shared/_layouts/site-layout/site-layout.component';

import { Error404Component } from './shared/_layouts/errorpages/error404/error404.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ViewProcedureTypesComponent } from './components/ProceduresAndTypes/ViewProcedureTypes/ViewProcedureTypes.component';
import { ViewProceduresComponent } from './components/ProceduresAndTypes/ViewProcedures/ViewProcedures.component';
import { ViewMedicationTypesComponent } from './components/MedicationAndType/ViewMedicationTypes/ViewMedicationTypes.component';
import { ViewMedicationsComponent } from './components/MedicationAndType/ViewMedication/ViewMedications.component';
import { CreatePrescriptionComponent } from './components/Prescriptions/create-prescription/create-prescription.component';
import { TestsComponent } from './components/Lab/Tests/Tests.component';
import { TestParametersComponent } from './components/Lab/testparameters/testparameters.component';
import { LabreportsComponent } from './components/Lab/labreports/labreports.component';
import { ViewPrescriptionComponent } from './components/Prescriptions/view-prescription/view-prescription.component';
import { ProfileComponent } from './components/Profiles/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Users',
        component: ViewUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'register/:id',
        component: RegisterComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'Patients',
        component: ViewPatientComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'CreatePatient',
        component: AddPatientComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'CreatePatient/:id',
        component: AddPatientComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PatientDetails/:id',
        component: PatientDetailComponent,
      },
      {
        path: 'Patients',
        component: ViewPatientComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'Appointments',
        component: ViewAppointmentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'CreateReciept/:id',
        component: CreateRecieptComponent,
      },
      {
        path: 'Reciepts',
        component: ViewRecieptsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ProcedureTypes',
        component: ViewProcedureTypesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Procedures',
        component: ViewProceduresComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'MedicationTypes',
        component: ViewMedicationTypesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Medications',
        component: ViewMedicationsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'CreatePrescription/:id',
        component: CreatePrescriptionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Prescriptions',
        component: ViewPrescriptionComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'Tests',
        component: TestsComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'TestParameters',
        component: TestParametersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Reports',
        component: LabreportsComponent,
        canActivate: [AuthGuard],
      },

      { path: 'error404', component: Error404Component },
      { path: 'error', component: ErrorNotFoundComponent },
    ],
  },

  {
    path: '',
    component: LoginLayoutComponent,
    children: [{ path: 'login', component: LoginComponent }],
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  collasping = true;
}
