import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import {User} from "../beans/user";
import {RegistrationReport} from "../beans/registrationReport";

@Injectable()
export class LoginRegisterService {

  private path : string = 'http://localhost:8080/loginRegister/';

  constructor(private http : Http) { }

  login(user : User){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.path + "login", JSON.stringify(user), { headers :  headers, withCredentials : true });
  }

  createRegistrationReport(rr : any){
    delete rr.password_r;
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.path + "createRegistrationReport", JSON.stringify(rr), { headers :  headers, withCredentials : true });
  }

  getRegistrationReports(){
    return this.http.get(this.path + 'getRegistrationReports',{withCredentials : true});
  }

  register(rr : RegistrationReport){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.path + 'register', JSON.stringify(rr), { headers : headers, withCredentials : true});
  }

}
