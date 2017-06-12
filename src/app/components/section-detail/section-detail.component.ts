import { Component, OnInit } from '@angular/core';
import {Section} from "../../beans/section";
import {FSMService} from "../../services/fsm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Machine} from "../../beans/machine";

@Component({
  selector: 'app-section-detail',
  templateUrl: './section-detail.component.html',
  styleUrls: ['./section-detail.component.css']
})
export class SectionDetailComponent implements OnInit {

  private section:Section = new Section();
  private machines:Machine[]=[];
  private machineForDelete:Machine = new Machine();
  private machineForDetails:Machine = new Machine();

  constructor(private fsmService:FSMService, private activatedRoute:ActivatedRoute,private router:Router) { }

  ngOnInit() {

    this.fsmService.getSectionById(this.activatedRoute.snapshot.params['idS']).subscribe(
      (data) => {
        this.section = JSON.parse(data['_body']);
        this.fsmService.getMachinesBySection(this.section).subscribe(
          (data) => {
            this.machines = JSON.parse(data['_body']);
          }
        );
      }
    );
  }


  deleteSection(){
    this.fsmService.deleteSection(this.section.idS).subscribe(
      () => {
        this.router.navigateByUrl('/home/facilities');
      }
    );
  }


  assignMachineForDelete(machine:Machine){
    this.machineForDelete = machine;
  }

  deleteMachine(){
    this.fsmService.deleteMachine(this.machineForDelete.idM).subscribe(
      () => {
        var index = this.machines.indexOf(this.machineForDelete, 0);
        if (index > -1) {
          this.machines.splice(index, 1);
        }
      }
    );
  }

  assignMachineForDetails(machine:Machine){
    this.machineForDetails = machine;
  }

}
