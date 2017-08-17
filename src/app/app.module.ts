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

import { AddSectionComponent } from './components/forms/add-section/add-section.component';
import { SectionDetailComponent } from './components/section-detail/section-detail.component';
import { UpdateSectionComponent } from './components/forms/update-section/update-section.component';
import {AddMachineComponent} from "./components/forms/add-machine/add-machine.component";
import { UpdateMachineComponent } from './components/forms/update-machine/update-machine.component';
import { FailureReportsComponent } from './components/failure-reports/failure-reports.component';
import {RoleService} from "./services/role.service";
import { TopologyComponent } from './components/topology/topology.component';

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
    RegistrationReportsComponent,
    AddSectionComponent,
    SectionDetailComponent,
    UpdateSectionComponent,
    AddMachineComponent,
    UpdateMachineComponent,
    FailureReportsComponent,
    TopologyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [FSMService, LoginRegisterService, RoleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
