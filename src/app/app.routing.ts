import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {WelcomeComponent} from "./components/welcome/welcome.component";
import {AddFacilityComponent} from "./components/forms/add-facility/add-facility.component";
import {FacilityDetailComponent} from "./components/facility-detail/facility-detail.component";
import {FacilitiesComponent} from "./components/facilities/facilities.component";
import {UpdateFacilityComponent} from "./components/forms/update-facility/update-facility.component";
import {RegistrationReportComponent} from "./components/forms/registration-report/registration-report.component";

import {RegistrationReportsComponent} from "./components/registration-reports/registration-reports.component";

import {AddSectionComponent} from "./components/forms/add-section/add-section.component";
import {SectionDetailComponent} from "./components/section-detail/section-detail.component";
import {UpdateSectionComponent} from "./components/forms/update-section/update-section.component";
import {AddMachineComponent} from "./components/forms/add-machine/add-machine.component";
import {UpdateMachineComponent} from "./components/forms/update-machine/update-machine.component";



const APP_ROUTES: Routes = [
  {path:'home',component:HomeComponent, children:[
    {path:'addsection/:idF',component:AddSectionComponent},
    {path:'updatemachine/:idM',component:UpdateMachineComponent},
    {path:'addmachine/:idS',component:AddMachineComponent},
    {path:'addfacility', component:AddFacilityComponent},
    {path:'sections/update/:idS', component:UpdateSectionComponent},
    {path:'sections/:idS', component:SectionDetailComponent},
    {path:'facilities/update/:idF', component:UpdateFacilityComponent},
    {path:'facilities/:idF',component:FacilityDetailComponent},
    {path:'facilities',component:FacilitiesComponent},
    {path:'registrationreport',component:RegistrationReportComponent},
    {path:'registrationReports', component: RegistrationReportsComponent},
    {path:'',component:WelcomeComponent}
  ]},
  {path:'',component:LoginComponent}
]

export const routing = RouterModule.forRoot(APP_ROUTES);
