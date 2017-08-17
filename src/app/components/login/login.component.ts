import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../../beans/user";
import {LoginRegisterService} from "../../services/login-register.service";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginFailed:boolean = false;

  constructor(private router:Router, private httpService : LoginRegisterService, private roleService : RoleService) { }

  ngOnInit() {
  }

  onSubmit(user : User){
    this.httpService.login(user).subscribe(
      data => {
        if(data['_body'] == 'no user' || data['_body'] == 'wrong password')
          this.loginFailed = true;
        else {
          this.router.navigateByUrl('/home');
        }
      }
    );
  }

}
