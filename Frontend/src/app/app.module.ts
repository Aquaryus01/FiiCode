import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthenticateModule } from './_modules/authenticate/authenticate.module';
import {SettingsService} from './_services/settings.service'
import {UserService} from './_services/user.service'

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AuthenticateModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
