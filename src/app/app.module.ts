import { ValidationService } from 'src/app/services/Validation.service';
import { StorageService } from 'src/app/services/storage.service';
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
import { CarouselModule } from 'primeng/carousel';

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
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';

import { httpInterceptorProviders } from './helper/http.interceptor';
import { errorInterceptorProviders } from './security/error.interceptor';

import { SiteLayoutComponent } from './shared/_layouts/site-layout/site-layout.component';
import { LoginLayoutComponent } from './shared/_layouts/login-layout/login-layout.component';
import { ViewUserComponent } from './components/Users/view-user/view-user.component';
import { ErrorNotFoundComponent } from './shared/_layouts/errorpages/error-not-found/error-not-found.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ChangeRoleComponent } from './components/Users/change-role/change-role.component';
import { ChangePasswordComponent } from './components/Users/change-password/change-password.component';

import { Error404Component } from './shared/_layouts/errorpages/error404/error404.component';

//Custom Modules
import { UniqueUsernameValidator } from 'src/app/lib/validators/UniqueUsernameValidator';

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

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CryptoHandler } from './security/crypto-handler';
import { RSAHelper } from './security/RSAHelper';
import { ProfileButtonComponent } from './components/Profiles/profile-button/profile-button.component';
import { ProfileComponent } from './components/Profiles/profile/profile.component';
import { CharacterService } from './services/character.service';
import { MessagesModule } from 'primeng/messages';
import { ViewCharactersComponent } from './components/characters/view-characters/view-characters.component';
import { AddCharactersComponent } from './components/characters/add-characters/add-characters.component';

import { TotalVotesByTimeComponent } from './components/admin/total-votes-by-time/total-votes-by-time.component';

import { PopularCharacterByTimeComponent } from './components/admin/popular-character-by-time/popular-character-by-time.component';
import { TopCharacterComponent } from './components/admin/top-character/top-character.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ViewUserComponent,
    HomeComponent,
    ProfileComponent,
    SiteLayoutComponent,
    LoginLayoutComponent,
    Error404Component,
    ErrorNotFoundComponent,
    LogoutComponent,
    ChangeRoleComponent,
    ChangePasswordComponent,
    SafeUrlPipe,
    ProfileButtonComponent,
    ViewCharactersComponent,
    AddCharactersComponent,
    AdminDashboardComponent,
    TotalVotesByTimeComponent,
    PopularCharacterByTimeComponent,
    TopCharacterComponent,
  ],
  providers: [
    httpInterceptorProviders,
    errorInterceptorProviders,

    DecimalPipe,
    UserService,
    MenuService,
    AuthService,
    UniqueUsernameValidator,
    DialogService,
    MessageService,
    ConfirmationService,
    ProvinceService,
    CityService,
    StorageService,
    ValidationService,
    CryptoHandler,
    RSAHelper,
    CharacterService,
  ],
  entryComponents: [ChangeRoleComponent, ChangePasswordComponent],
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
    MessagesModule,
    CarouselModule,
  ],
})
export class AppModule {}
