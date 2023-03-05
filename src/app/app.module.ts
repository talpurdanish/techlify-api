import { DatatableDirective } from './shared/Datatable.directive';
import { UniqueUsernameValidator } from 'src/app/lib/validators/UniqueUsernameValidator';
import { UniquePmdcNoValidator } from './lib/validators/UniquePmdcNoValidator';
import { UniqueCnicValidator } from './lib/validators/UniqueCNICValidator';
import { ControlMessagesComponent } from './shared/ControlMessages/ControlMessages.component';
import { ModalService } from './shared/modal/modal.service';
import { ModalComponent } from './shared/modal/modal.component';
import { UserService } from 'src/app/services/user.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/Users/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { httpInterceptorProviders } from './helper/http.interceptor';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { MenuComponent } from './shared/menu/menu.component';
import { SiteLayoutComponent } from './shared/_layouts/site-layout/site-layout.component';
import { LoginLayoutComponent } from './shared/_layouts/login-layout/login-layout.component';
import { AccordionModule } from './lib/accordion/accordion.module';
import { ViewUserComponent } from './components/Users/view-user/view-user.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbdSortableHeader,
  SortEvent,
} from './lib/directives/sortable.directive';

import { AsyncPipe, DecimalPipe, JsonPipe } from '@angular/common';

import {
  NgbDatepicker,
  NgbDate,
  NgbModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { IMaskModule } from 'angular-imask';
import { CustomAdapter } from './shared/CustomDateAdapter';
import { CustomDateParserFormatter } from './shared/CustomDateParserFormatter ';
import { Error404Component } from './shared/_layouts/errorpages/error404/error404.component';
import { ErrorNotFoundComponent } from './shared/_layouts/errorpages/error-not-found/error-not-found.component';
import { LogoutComponent } from './components/logout/logout.component';

import { DataTablesModule } from 'angular-datatables';
import { ChangeRoleComponent } from './components/Users/change-role/change-role.component';
import { FmdcModalService } from '../app/components/Users/fmdc-modal/fmdc-modal.service';
import { ToastrModule } from 'ngx-toastr';
import { ChangePasswordComponent } from './components/Users/change-password/change-password.component';
import { ViewRecieptsComponent } from './components/Reciepts/view-reciepts/view-reciepts.component';
import { SafeUrlPipe } from './helper/safeUrl.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ViewUserComponent,
    HomeComponent,
    ProfileComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    SiteLayoutComponent,
    LoginLayoutComponent,
    ModalComponent,
    ControlMessagesComponent,
    Error404Component,
    ErrorNotFoundComponent,
    LogoutComponent,
    ChangeRoleComponent,
    ChangePasswordComponent,
    ViewRecieptsComponent,
    SafeUrlPipe,
  ],
  providers: [
    httpInterceptorProviders,
    DecimalPipe,
    UserService,
    ModalService,
    FmdcModalService,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    UniqueCnicValidator,
    UniquePmdcNoValidator,
    UniqueUsernameValidator,
    NgbActiveModal,
    NgbModal,
    DatatableDirective,
  ],
  entryComponents: [
    ChangeRoleComponent,
    ChangePasswordComponent,
    ViewRecieptsComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    NgxPaginationModule,
    AccordionModule,
    BrowserAnimationsModule,
    JsonPipe,
    // NgbDatepicker,
    NgbModule,
    DecimalPipe,
    AsyncPipe,
    NgbTypeaheadModule,
    NgbdSortableHeader,
    NgbPaginationModule,
    IMaskModule,
    ReactiveFormsModule,
    DataTablesModule,
    ToastrModule.forRoot(),
    NgbTooltipModule,
  ],
})
export class AppModule {}
