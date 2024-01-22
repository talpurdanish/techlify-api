import { ErrorNotFoundComponent } from './shared/_layouts/errorpages/error-not-found/error-not-found.component';
import { AuthGuard } from './security/auth.guard';

import { ViewUserComponent } from './components/Users/view-user/view-user.component';
import { LoginLayoutComponent } from './shared/_layouts/login-layout/login-layout.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

import { SiteLayoutComponent } from './shared/_layouts/site-layout/site-layout.component';

import { Error404Component } from './shared/_layouts/errorpages/error404/error404.component';
import { LogoutComponent } from './components/logout/logout.component';

import { ProfileComponent } from './components/Profiles/profile/profile.component';
import { ViewCharactersComponent } from './components/characters/view-characters/view-characters.component';
import { AddCharactersComponent } from './components/characters/add-characters/add-characters.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },

      {
        path: 'Users',
        component: ViewUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Characters',
        component: ViewCharactersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'AddCharacter',
        component: AddCharactersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'AddCharacter/:fid',
        component: AddCharactersComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'register/:fid',
        component: RegisterComponent,
        canActivate: [AuthGuard],
      },
      { path: 'login', component: LoginComponent },

      { path: 'error404', component: Error404Component },
      { path: 'error', component: ErrorNotFoundComponent },
    ],
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
