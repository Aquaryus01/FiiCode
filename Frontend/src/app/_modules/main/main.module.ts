import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {AuthGuard} from './_guards/auth.guard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule} from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { CardsComponent } from './main/cards/cards.component';
import { CardComponent } from './main/cards/card/card.component';
import { StartPageComponent } from './start-page/start-page.component';

const appRoutes: Routes = [
  { path: 'allergy', component:  MainComponent, canActivate: [AuthGuard]},
   {path: '', component:  StartPageComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [MainComponent, NavbarComponent, CardsComponent, CardComponent, StartPageComponent],
  providers: [AuthGuard]
})
export class MainModule { }