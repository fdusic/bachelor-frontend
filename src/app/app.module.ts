import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {routing} from "./app.routing";
import {LoginComponent} from "./components/login/login.component";
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AddFacilityComponent } from './components/forms/add-facility/add-facility.component';
import {FSMService} from "./services/fsm.service";
import { FacilityDetailComponent } from './components/facility-detail/facility-detail.component';
import { FacilitiesComponent } from './components/facilities/facilities.component';
import { UpdateFacilityComponent } from './components/forms/update-facility/update-facility.component';
import { RegistrationReportComponent } from './components/forms/registration-report/registration-report.component';
import {LoginRegisterService} from "./services/login-register.service";
import { RegistrationReportsComponent } from './components/registration-reports/registration-reports.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    WelcomeComponent,
    AddFacilityComponent,
    FacilityDetailComponent,
    FacilitiesComponent,
    UpdateFacilityComponent,
    RegistrationReportComponent,
    RegistrationReportsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [FSMService, LoginRegisterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
