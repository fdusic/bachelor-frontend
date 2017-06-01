import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginFailed:boolean = false;

  constructor(private router:Router) { }

  ngOnInit() {
  }



  onSubmit(form:NgForm){
    this.loginFailed = false;
    this.router.navigateByUrl('/home')
  }

}
