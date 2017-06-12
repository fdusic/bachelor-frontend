import { Component, OnInit } from '@angular/core';
import {Section} from "../../../beans/section";
import {FSMService} from "../../../services/fsm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Interface} from "../../../beans/interface";
import {Machine} from "../../../beans/machine";

@Component({
  selector: 'app-add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.css']
})
export class AddMachineComponent implements OnInit {

  private imageName:string = '';
  private formData:FormData = new FormData();
  private interfaces:Interface[]=[];
  private supportedInterfaces:Interface[]=[];


  constructor(private fsmService:FSMService,private activatedRoute:ActivatedRoute,private router:Router) { }

  ngOnInit() {

    this.fsmService.getInterfaces().subscribe(
      (data) => {
        this.interfaces = JSON.parse(data['_body']);
      }
    );

  }


  imageChange(event){
    let file = event.srcElement.files;
    this.imageName=file[0].name;

    this.formData.append('image',file[0]);
  }

  onSubmit(form:NgForm){
    this.formData.append('name',form.controls['name'].value);
    this.formData.append('description',form.controls['description'].value);
    this.formData.append('section',this.activatedRoute.snapshot.params['idS']);

    for(var i = 0; i  < this.interfaces.length; i++){
      if(form.controls['switch'+this.interfaces[i].idI].value){
        this.supportedInterfaces.push(this.interfaces[i]);
      }
    }


    this.fsmService.createMachine(this.formData).subscribe(
      (data) => {

          let machine:Machine = JSON.parse(data['_body']);
          machine.supportsInterface = this.supportedInterfaces;
          this.fsmService.machineSupportInterfaces(machine).subscribe(
            () => {
              this.router.navigateByUrl('/home/sections/'+this.activatedRoute.snapshot.params['idS']);
            }
          );



      }
    );
  }


  onSubmitInterface(iface:Interface){

    this.fsmService.createInterface(iface).subscribe(
      (data) => {
        this.interfaces.push(JSON.parse(data['_body']));
        document.getElementById("closeInterfaceModalButton").click();
      }
    );

  }

}
