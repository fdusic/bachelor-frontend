import {Component, OnInit} from "@angular/core";
import {RegistrationReport} from "../../beans/registrationReport";
import {LoginRegisterService} from "../../services/login-register.service";


@Component({
  selector: 'app-registration-reports',
  templateUrl: './registration-reports.component.html',
  styleUrls: ['./registration-reports.component.css']
})
export class RegistrationReportsComponent implements OnInit {

  private registrationReports : RegistrationReport[] = [];

  constructor(private loginRegisterService : LoginRegisterService){ }

  ngOnInit() {
    this.loginRegisterService.getRegistrationReports().subscribe(
      data => {
        this.registrationReports = JSON.parse(data['_body']);
        console.log(this.registrationReports);
      }
    );
  }

  register(rr : RegistrationReport){
    this.loginRegisterService.register(rr).subscribe(
      () => {
        this.registrationReports.splice(this.registrationReports.indexOf(rr),1);
      }
    );
  }

}
