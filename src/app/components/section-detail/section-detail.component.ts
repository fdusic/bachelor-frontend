import {Component, OnInit, ViewChild} from '@angular/core';
import {Section} from "../../beans/section";
import {FSMService} from "../../services/fsm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Machine} from "../../beans/machine";
import {FailureReport} from "../../beans/failureReport";
import {Interface} from "../../beans/interface";
import {NgForm} from "@angular/forms";
import {ConnectionType} from "../../beans/connection-type";
import {RoleService} from "../../services/role.service";
import {Process} from "../../beans/process";
import {ProcessService} from "../../services/process.service";
import {Topology} from "../../beans/topology";
import {TopologyService} from "../../services/topology.service";

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
  private interfaces:Interface[]=[];
  private connectionTypes:ConnectionType[]=[];

  @ViewChild("textarea") textarea : any;

  private m : Machine= new Machine();

  /* PROCESS VARIABLES */
  private processes : Process[] = [];
  /* PROCESS VARIABLES END! */

  /* TOPOLOGY VARIABLES */
  private topologies : Topology[] = [];
  /* TOPOLOGY VARIABLES END! */

  constructor(private fsmService:FSMService, private activatedRoute:ActivatedRoute,private router:Router, private roleService: RoleService,
                    private processService : ProcessService, private topologyService : TopologyService) { }

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

    this.processService.getProcessesForSection(this.activatedRoute.snapshot.params['idS']).subscribe(
      (data) => {
        this.processes = JSON.parse(data['_body']);
      }
    );

    this.topologyService.getTopologiesForSection(this.activatedRoute.snapshot.params['idS']).subscribe(
      (data) => {
        this.topologies = JSON.parse(data['_body']);
      }
    );

  }

  /* PROCESS METHODS */
  /* PROCESS METHODS END! */

  /* TOPOLOGY METHODS */
  /* TOPOLOGY METHODS END! */

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


  assignMachineForDetails(machine:Machine) {
    this.machineForDetails = machine;
  }

  sendReport(){
    let rf = new FailureReport();
    rf.error = this.textarea.nativeElement.value;
    rf.machine = this.m;
    console.log(rf);
    this.fsmService.createFailureReport(rf).subscribe(
      () => {}
    );
  }

  setSelected(m){
    this.m = m;
  }

  onSubmitConnectionType(form:NgForm){
      let ct:ConnectionType = new ConnectionType();
      ct.name = form.controls['name'].value;
      ct.description = form.controls['description'].value;

      let temp:string = form.controls['interface'].value;
      let s1:string = temp.split(' ')[0];
      let s2:string = s1.split(':')[1];

      for(var i = 0;i < this.interfaces.length; i++){
        if(parseInt(s2) == this.interfaces[i].idI){
          ct.iface = this.interfaces[i];
          break;
        }
      }

      this.fsmService.createConnectionType(ct).subscribe(
        (data) => {
          let ct1:ConnectionType = JSON.parse(data['_body']);
          this.connectionTypes.push(ct1);
          document.getElementById('closeConnectionTypeButton').click();
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

}
