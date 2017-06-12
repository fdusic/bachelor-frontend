import { Component, OnInit } from '@angular/core';
import {FSMService} from "../../../services/fsm.service";
import {Interface} from "../../../beans/interface";
import {Machine} from "../../../beans/machine";
import {Router, ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-update-machine',
  templateUrl: './update-machine.component.html',
  styleUrls: ['./update-machine.component.css']
})
export class UpdateMachineComponent implements OnInit {


  private machine:Machine = new Machine();
  private imageName:string='';
  private interfaces:Interface[]=[];

  constructor(private fsmService:FSMService, private router:Router,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.fsmService.getMachineById(this.activatedRoute.snapshot.params['idM']).subscribe(
      (data) => {
        this.machine = JSON.parse(data['_body']);
        this.imageName = this.machine.image;
      }
    );

    this.fsmService.getInterfaces().subscribe(
      (data) => {
        this.interfaces = JSON.parse(data['_body']);
      }
    );

  }


  doesMachineSupportInterface(iface:Interface){
    for(var i = 0; i < this.machine.supportsInterface.length; i++){
      if(this.machine.supportsInterface[i].idI == iface.idI){
        return true;
      }
    }
    return false;
  }

}
