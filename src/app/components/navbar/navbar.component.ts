import {Component, OnInit} from "@angular/core";
import {LoginRegisterService} from "../../services/login-register.service";
import {Router} from "@angular/router";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private loginRegisterService : LoginRegisterService, private router : Router, private roleService : RoleService) { }

  ngOnInit() {
    console.log('navbar init');
  }

  logout(){
    this.loginRegisterService.logout().subscribe(
      () => {
        this.router.navigateByUrl('');
      }
    );
  }

}
