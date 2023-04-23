import { UpdateReportComponent } from './components/Lab/update-report/update-report.component';
import { RecieptReportComponent } from './components/Reciepts/reciept-report/reciept-report.component';
import { ViewRecieptProceduresComponent } from './components/Reciepts/view-reciept-procedures/view-reciept-procedures.component';
import { UnpaidrecieptsComponent } from './components/Reciepts/unpaidreciepts/unpaidreciepts.component';
import { ValidationService } from 'src/app/services/Validation.service';
import { StorageService } from 'src/app/services/storage.service';
import { RecieptsService } from './services/reciept.service';
import { CityService } from './services/city.service';
// System Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsyncPipe, DecimalPipe, JsonPipe } from '@angular/common';
//Prime Ng Modules
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { OrderListModule } from 'primeng/orderlist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TodoComponent } from './components/Todos/todo/todo.component';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { OverlayModule } from 'primeng/overlay';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SidebarModule } from 'primeng/sidebar';
import { CardModule } from 'primeng/card';
import { SplitButtonModule } from 'primeng/splitbutton';
//Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/Users/register/register.component';
import { HomeComponent } from './components/home/home.component';

import { httpInterceptorProviders } from './helper/http.interceptor';
import { errorInterceptorProviders } from './security/error.interceptor';
import { MenuComponent } from './shared/menu/menu.component';
import { SiteLayoutComponent } from './shared/_layouts/site-layout/site-layout.component';
import { LoginLayoutComponent } from './shared/_layouts/login-layout/login-layout.component';
import { ViewUserComponent } from './components/Users/view-user/view-user.component';
import { ErrorNotFoundComponent } from './shared/_layouts/errorpages/error-not-found/error-not-found.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ChangeRoleComponent } from './components/Users/change-role/change-role.component';
import { ChangePasswordComponent } from './components/Users/change-password/change-password.component';
import { ViewRecieptsComponent } from './components/Reciepts/view-reciepts/view-reciepts.component';
import { Error404Component } from './shared/_layouts/errorpages/error404/error404.component';
import { ReportsDetailComponent } from './components/Patients/Details/reports-detail/reports-detail.component';
import { PrescriptionDetailComponent } from './components/Patients/Details/prescription-detail/prescription-detail.component';
import { RecieptDetailComponent } from './components/Patients/Details/reciept-detail/reciept-detail.component';
import { CreateRecieptComponent } from './components/Reciepts/CreateReciept/CreateReciept.component';
import { SlipComponent } from './components/Patients/Slip/Slip.component';
import { PendingAppointmentsComponent } from './components/Appointments/pending-appointments/pending-appointments.component';
import { ViewAppointmentsComponent } from './components/Appointments/ViewAppointments/ViewAppointments.component';
import { AddStartComponent } from './components/Appointments/add-start/add-start.component';
import { PatientDetailComponent } from './components/Patients/patient-detail/patient-detail.component';
import { AppointmentDetailsComponent } from './components/Patients/Details/appointment-details/appointment-details.component';
import { AppointmentButtonsComponent } from './components/Patients/appointment-buttons/appointment-buttons.component';
import { PatientStatsComponent } from './components/Patients/patient-stats/patient-stats.component';
import { NotificationMenuComponent } from './components/Notification/NotificationMenu/NotificationMenu.component';
import { AddPatientComponent } from './components/Patients/add-patients/add-patients.component';
import { ViewPatientComponent } from './components/Patients/view-patients/view-patients.component';

//Custom Modules
import { UniqueUsernameValidator } from 'src/app/lib/validators/UniqueUsernameValidator';
import { UniquePmdcNoValidator } from './lib/validators/UniquePmdcNoValidator';
import { UniqueCnicValidator } from './lib/validators/UniqueCNICValidator';

import {
  NgbdSortableHeader,
  SortEvent,
} from './lib/directives/sortable.directive';
import { SafeUrlPipe } from './helper/safeUrl.pipe';
//Services
import { UserService } from 'src/app/services/user.service';
import { MenuService } from 'src/app/services/menu.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProvinceService } from 'src/app/services/province.service';
import { AppointmentService } from './services/appointment.service';
import { ProcedureService } from './services/procedure.service';
import { NotificationService } from './components/Notification/Notification.service';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ProcedureTypeService } from './services/proceduretype.service';
import { ViewProcedureTypesComponent } from './components/ProceduresAndTypes/ViewProcedureTypes/ViewProcedureTypes.component';
import { ViewProceduresComponent } from './components/ProceduresAndTypes/ViewProcedures/ViewProcedures.component';
import { ViewMedicationTypesComponent } from './components/MedicationAndType/ViewMedicationTypes/ViewMedicationTypes.component';
import { ViewMedicationsComponent } from './components/MedicationAndType/ViewMedication/ViewMedications.component';
import { CreatePrescriptionComponent } from './components/Prescriptions/create-prescription/create-prescription.component';
import { PatientInfoComponent } from './components/Prescriptions/patient-info/patient-info.component';
import { AddLabReportsComponent } from './components/Prescriptions/add-lab-reports/add-lab-reports.component';
import { PrescriptionService } from './services/prescription.service';
import { PrescriptionmedicationComponent } from './components/Prescriptions/prescriptionmedication/prescriptionmedication.component';
import { LabreportsComponent } from './components/Lab/labreports/labreports.component';
import { TestParametersComponent } from './components/Lab/testparameters/testparameters.component';
import { TestsComponent } from './components/Lab/Tests/Tests.component';
import { TestService } from './services/test.service';
import { TestParameterService } from './services/test-parameter.service';
import { LabReportService } from './services/labreport.service';
import { TestParametersPartialComponent } from './components/Lab/TestParametersPartial/TestParametersPartial.component';
import { ReportComponent } from './components/Lab/report/report.component';
import { ViewPrescriptionComponent } from './components/Prescriptions/view-prescription/view-prescription.component';
import { CryptoHandler } from './security/crypto-handler';
import { RSAHelper } from './security/RSAHelper';
import { PendingReportsComponent } from './components/Lab/pending-reports/pending-reports.component';
import { ProfileButtonComponent } from './components/Profiles/profile-button/profile-button.component';
import { ProfileComponent } from './components/Profiles/profile/profile.component';
import { TodosButtonComponent } from './components/Todos/TodosButton/TodosButton.component';
import { PatientStatButtonComponent } from './components/Patients/patient-stat-button/patient-stat-button.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ViewUserComponent,
    HomeComponent,
    ProfileComponent,
    MenuComponent,
    SiteLayoutComponent,
    LoginLayoutComponent,
    Error404Component,
    ErrorNotFoundComponent,
    LogoutComponent,
    ChangeRoleComponent,
    ChangePasswordComponent,
    ViewRecieptsComponent,
    SafeUrlPipe,
    TodoComponent,
    // ViewPatientComponent,
    AddPatientComponent,
    NotificationMenuComponent,
    PatientStatsComponent,
    AppointmentButtonsComponent,
    ReportsDetailComponent,
    PrescriptionDetailComponent,
    RecieptDetailComponent,
    AppointmentDetailsComponent,
    RecieptDetailComponent,
    ReportsDetailComponent,
    PrescriptionDetailComponent,
    PatientDetailComponent,
    AddStartComponent,
    ViewAppointmentsComponent,
    PendingAppointmentsComponent,
    SlipComponent,
    CreateRecieptComponent,
    UnpaidrecieptsComponent,
    ViewRecieptProceduresComponent,
    RecieptReportComponent,
    ViewProcedureTypesComponent,
    ViewProceduresComponent,
    ViewMedicationTypesComponent,
    ViewMedicationsComponent,
    CreatePrescriptionComponent,
    PatientInfoComponent,
    AddLabReportsComponent,
    PrescriptionmedicationComponent,
    LabreportsComponent,
    TestParametersComponent,
    TestsComponent,
    TestParametersPartialComponent,
    ReportComponent,
    ViewPrescriptionComponent,
    UpdateReportComponent,
    PendingReportsComponent,
    ProfileButtonComponent,
    TodosButtonComponent,
    PatientStatButtonComponent,
  ],
  providers: [
    httpInterceptorProviders,
    errorInterceptorProviders,

    DecimalPipe,
    UserService,
    MenuService,
    AuthService,
    UniqueCnicValidator,
    UniquePmdcNoValidator,
    UniqueUsernameValidator,
    DialogService,
    MessageService,
    ConfirmationService,
    NotificationService,
    AppointmentService,
    ProcedureService,
    ProvinceService,
    CityService,
    RecieptsService,
    StorageService,
    ValidationService,
    ProcedureTypeService,
    PrescriptionService,
    TestService,
    TestParameterService,
    LabReportService,
    CryptoHandler,
    RSAHelper,
  ],
  entryComponents: [
    ChangeRoleComponent,
    ChangePasswordComponent,
    RecieptReportComponent,
    AddStartComponent,
    SlipComponent,
    ReportComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    JsonPipe,
    DecimalPipe,
    AsyncPipe,
    NgbdSortableHeader,
    ReactiveFormsModule,
    MenuModule,
    DynamicDialogModule,
    CalendarModule,
    ToastModule,
    TableModule,
    PanelMenuModule,
    InputMaskModule,
    InputTextModule,
    DropdownModule,
    RadioButtonModule,
    ToggleButtonModule,
    FileUploadModule,
    ConfirmPopupModule,
    ImageModule,
    ContextMenuModule,
    ButtonModule,
    SelectButtonModule,
    RippleModule,
    AvatarModule,
    TooltipModule,
    ToolbarModule,
    OrderListModule,
    DialogModule,
    ConfirmDialogModule,
    PanelModule,
    ChartModule,
    BadgeModule,
    OverlayPanelModule,
    TabViewModule,
    AccordionModule,
    InputNumberModule,
    FieldsetModule,
    DividerModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    InputTextModule,
    InputTextareaModule,
    TabViewModule,
    CheckboxModule,
    SlideMenuModule,
    SidebarModule,
    CardModule,
    SplitButtonModule,
  ],
})
export class AppModule {}
