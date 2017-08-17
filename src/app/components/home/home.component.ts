import {Component, OnInit} from "@angular/core";
import {RoleService} from "../../services/role.service";
import {LoginRegisterService} from "../../services/login-register.service";
import {User} from "../../beans/user";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private roleService : RoleService, private loginRegisterService : LoginRegisterService) { }

  ngOnInit() {
    console.log('real init');
    this.loginRegisterService.getLogedUser().subscribe(
      data => {
        let user : User = JSON.parse(data['_body']);
        this.roleService.setRole(user.proffesion);
        console.log('home init')
      }
    );
  }

}
