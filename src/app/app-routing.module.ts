import { ViewRecieptsComponent } from './components/Reciepts/view-reciepts/view-reciepts.component';
import { ViewUserComponent } from './components/Users/view-user/view-user.component';
import { LoginLayoutComponent } from './shared/_layouts/login-layout/login-layout.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './components/Users/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SiteLayoutComponent } from './shared/_layouts/site-layout/site-layout.component';

import { Error404Component } from './shared/_layouts/errorpages/error404/error404.component';
import { LogoutComponent } from './components/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'Users', component: ViewUserComponent },
      { path: 'register/:id', component: RegisterComponent },
    ],
  },

  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'error404', component: Error404Component },
    ],
  },

  { path: 'profile', component: ProfileComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  collasping = true;
}
