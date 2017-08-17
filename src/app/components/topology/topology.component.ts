import { Component, OnInit } from '@angular/core';
import {Section} from "../../beans/section";
import {FSMService} from "../../services/fsm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Machine} from "../../beans/machine";
import {FailureReport} from "../../beans/failureReport";
import {Interface} from "../../beans/interface";
import {NgForm} from "@angular/forms";
import {ConnectionType} from "../../beans/connection-type";
import {Topology} from "../../beans/topology";
import {MachineInTopology} from "../../beans/machine-in-topology";

@Component({
  selector: 'app-topology',
  templateUrl: './topology.component.html',
  styleUrls: ['./topology.component.css']
})
export class TopologyComponent implements OnInit {

  private section:Section = new Section();
  private machines:Machine[]=[];
  private selectedMachines:Machine[]=[];
  private topology:Topology = new Topology();
  private machinesInTopology:MachineInTopology[]=[];
  private connectionTypes:ConnectionType[]=[];

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

    this.fsmService.getConnectionTypes().subscribe(
      (data) => {
        this.connectionTypes = JSON.parse(data['_body']);
      }
    );
  }

  selectMachine(machine:Machine){
        document.getElementById('span'+machine.idM).style.backgroundColor="#ccffde";
        document.getElementById('as'+machine.idM).style.display='none';
        document.getElementById('au'+machine.idM).style.removeProperty('display');
        this.selectedMachines.push(machine);
  }

  unselectMachine(machine:Machine){
    document.getElementById('span'+machine.idM).style.removeProperty('background-color')
    document.getElementById('as'+machine.idM).style.removeProperty('display');
    document.getElementById('au'+machine.idM).style.display = 'none';
    var index = this.selectedMachines.indexOf(machine, 0);
    if (index > -1) {
      this.selectedMachines.splice(index, 1);
    }
  }

  onNext(){
    if(this.selectedMachines.length <= 1){
      alert('Please select at least 2 machines');
      return;
    }
    document.getElementById('machinesContainer').style.display = 'none';

    let topology:Topology = new Topology();
    topology.version = 1;
    topology.section = this.section;
    topology.name='Topology';
    topology.description='Description';

    this.fsmService.createTopology(topology).subscribe(
      (data) => {
        this.topology = JSON.parse(data['_body']);

        for(var i = 0; i < this.selectedMachines.length; i++){
          let mt:MachineInTopology = new MachineInTopology();
          mt.machine = this.selectedMachines[i];
          mt.description='Description';
          mt.topology = this.topology;
          mt.x= 5;
          mt.y= 5;
          this.machinesInTopology.push(mt);
        }

        this.fsmService.createMachinesInTopology(this.machinesInTopology).subscribe(
          (data) => {
            this.machinesInTopology = JSON.parse(data['_body']);
            document.getElementById('mitTable').style.removeProperty('display');

            for (var i=0; i < this.selectedMachines.length; i++){
              for(var j=0; j < this.selectedMachines.length; j++){
                if(this.selectedMachines[i].idM != this.selectedMachines[j].idM){
                  for(var k = 0; k < this.selectedMachines[i].supportsInterface.length; k++){
                    for(var p =0; p < this.selectedMachines[j].supportsInterface.length; p++){
                        console.log('Isti interface');
                    }
                  }
                }
              }
            }
          }
        );

      }
    );


  }

}
