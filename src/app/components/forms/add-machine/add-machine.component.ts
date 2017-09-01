import { Component, OnInit } from '@angular/core';
import {Section} from "../../../beans/section";
import {FSMService} from "../../../services/fsm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Interface} from "../../../beans/interface";
import {Machine} from "../../../beans/machine";
import {ConnectionType} from "../../../beans/connection-type";

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
  private connectionTypes:ConnectionType[]=[];
  private supportedProtocols:ConnectionType[]=[];


  constructor(private fsmService:FSMService,private activatedRoute:ActivatedRoute,private router:Router) { }

  ngOnInit() {

    this.fsmService.getInterfaces().subscribe(
      (data) => {
        this.interfaces = JSON.parse(data['_body']);
      }
    );


    this.fsmService.getConnectionTypes().subscribe(
      (data) => {
        this.connectionTypes = JSON.parse(data['_body']);
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

    for(var i = 0; i  < this.connectionTypes.length; i++){
      if(form.controls['switchct'+this.connectionTypes[i].idCT].value){
        this.supportedProtocols.push(this.connectionTypes[i]);
      }
    }


    this.fsmService.createMachine(this.formData).subscribe(
      (data) => {

          let machine:Machine = JSON.parse(data['_body']);
          machine.supportsInterface = this.supportedInterfaces;
          machine.supportsProtocol = this.supportedProtocols;
          this.fsmService.machineSupportInterfaces(machine).subscribe(
            () => {
              this.router.navigateByUrl('/home/sections/'+this.activatedRoute.snapshot.params['idS']);
            }
          );



      }
    );
  }


  onSubmitInterface(iface:Interface, form:NgForm){

    this.fsmService.createInterface(iface).subscribe(
      (data) => {
        this.interfaces.push(JSON.parse(data['_body']));
        document.getElementById("closeInterfaceModalButton").click();
        form.reset();
      }
    );

  }

  onSubmitConnectionType(ct:ConnectionType, form:NgForm){
    this.fsmService.createConnectionType(ct).subscribe(
      (data) => {
        let ct1:ConnectionType = JSON.parse(data['_body']);
        this.connectionTypes.push(ct1);
        document.getElementById('closeConnectionTypeButton').click();
        form.reset();
      }
    );
  }

}
