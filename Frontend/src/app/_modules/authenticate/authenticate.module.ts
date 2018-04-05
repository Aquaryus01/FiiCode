import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {AuthGuard} from './_guards/auth.guard'
const appRoutes: Routes = [
  { path: 'sign-in', component: SignInComponent, canActivate: [AuthGuard]},
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      appRoutes),
      BrowserModule,
      HttpClientModule,
      ReactiveFormsModule
  ],
  declarations: [SignInComponent, SignUpComponent, NavbarComponent],
  providers: [AuthGuard]
})
export class AuthenticateModule { }
