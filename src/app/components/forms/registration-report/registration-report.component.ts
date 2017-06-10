import { Component, OnInit } from '@angular/core';
import {RegistrationReport} from "../../../beans/registrationReport";
import {LoginRegisterService} from "../../../services/login-register.service";

@Component({
  selector: 'app-registration-report',
  templateUrl: './registration-report.component.html',
  styleUrls: ['./registration-report.component.css']
})
export class RegistrationReportComponent implements OnInit {

  constructor(private httpService : LoginRegisterService) { }

  ngOnInit() {
  }

  onSubmit(rr : RegistrationReport, password_r : string){
    console.log(password_r);
    if(rr.password != password_r){
      alert('Passwords must match!');
    } else{
      this.httpService.createRegistrationReport(rr).subscribe(
        () => {
        }
      );
    }
  }

}
