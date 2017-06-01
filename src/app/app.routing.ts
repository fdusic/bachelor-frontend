import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {WelcomeComponent} from "./components/welcome/welcome.component";
import {AddFacilityComponent} from "./components/forms/add-facility/add-facility.component";
import {FacilityDetailComponent} from "./components/facility-detail/facility-detail.component";
import {FacilitiesComponent} from "./components/facilities/facilities.component";
import {UpdateFacilityComponent} from "./components/forms/update-facility/update-facility.component";
import {RegistrationReportComponent} from "./components/forms/registration-report/registration-report.component";


const APP_ROUTES: Routes = [
  {path:'home',component:HomeComponent, children:[
    {path:'addfacility', component:AddFacilityComponent},
    {path:'facilities/update/:idF', component:UpdateFacilityComponent},
    {path:'facilities/:idF',component:FacilityDetailComponent},
    {path:'facilities',component:FacilitiesComponent},
    {path:'registrationreport',component:RegistrationReportComponent},
    {path:'',component:WelcomeComponent}
  ]},
  {path:'',component:LoginComponent}
]

export const routing = RouterModule.forRoot(APP_ROUTES);
