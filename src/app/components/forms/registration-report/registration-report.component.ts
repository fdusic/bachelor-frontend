import { Component, OnInit } from '@angular/core';
import {RegistrationReport} from "../../../beans/registrationReport";
import {LoginRegisterService} from "../../../services/login-register.service";
import swal from 'sweetalert2';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-registration-report',
  templateUrl: './registration-report.component.html',
  styleUrls: ['./registration-report.component.css']
})
export class RegistrationReportComponent implements OnInit {

  constructor(private httpService : LoginRegisterService) { }

  ngOnInit() {
  }

  onSubmit(rr : RegistrationReport, password_r : string, form:NgForm){
    if(rr.password != password_r){
      swal(
        'Sorry...',
        'Passwords must match!',
        'error'
      );
    } else{
      this.httpService.createRegistrationReport(rr).subscribe(
        () => {
          swal({
            text: "Do you wish to make another report?",
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText:'No',
            confirmButtonText: 'Yes'
          }).then(function () {
            form.reset();
          },function (dismiss) {
              if(dismiss=="cancel"){
                history.go(-1);
              }
            }
          );
        }
      );
    }
  }

}
