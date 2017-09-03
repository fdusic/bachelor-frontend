import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
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
import swal from 'sweetalert2';
import * as go from "gojs";
import {GojsBean} from "../../beans/gojsBean";
import {GojsLink} from "../../beans/gojsLink";
import {Link} from "../../beans/link";

@Component({
  selector: 'app-section-detail',
  templateUrl: './section-detail.component.html',
  styleUrls: ['./section-detail.component.css']
})
export class SectionDetailComponent implements OnInit{

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
  private chosenTopology : Topology = null;
  private activeProcess : Process = new Process();
  @ViewChild('chooseTopologyForProcessClose') chooseTopologyForProcessClose : any;

  private $ : any = null;
  private diagram : any = null;
  private selectedProcess : Process = new Process();
  private selectedProcessLinks : Link[] = [];
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
        this.selectedProcess = this.processes[0];
        this.processService.getLinksForProcess(this.selectedProcess).subscribe(
          data => {
            if(data['_body'] != '')
              this.selectedProcessLinks = JSON.parse(data['_body']);
            this.showProcessDiagram();
          }
        );
      }
    );

    this.topologyService.getTopologiesForSection(this.activatedRoute.snapshot.params['idS']).subscribe(
      (data) => {
        this.topologies = JSON.parse(data['_body']);
      }
    );

  }

  /* PROCESS METHODS */

  chooseTopology(t : Topology){
    if(this.chosenTopology != null)
      document.getElementById('tr' + this.chosenTopology.idT).classList.remove('selectedRow');
    this.chosenTopology = t;
    document.getElementById('tr' + t.idT).classList.add('selectedRow');
  }

  goToNewProcessPage() {
    if(this.chosenTopology == null){
      swal(
        'Error',
        'You must select a topology!',
        'error'
      );
    } else{
      this.chooseTopologyForProcessClose.nativeElement.click();
      this.router.navigateByUrl('/home/createProcess/' + this.chosenTopology.idT);
    }
  }

  setActiveProcess(p : Process) {
    this.activeProcess = p;

  }

  showProcessDiagram() {
    let nodeDataArray : GojsBean[] = [];
    for(let i = 0; i < this.selectedProcess.steps.length; i++) {
      let bean = new GojsBean();
      bean.key = this.selectedProcess.steps[i].machine.idM.toString();
      bean.text = this.selectedProcess.steps[i].name;
      bean.color = this.selectedProcess.steps[i].color;
      nodeDataArray.push(bean);
    }

    let linkDataArray : GojsLink[] = [];
    for(let i = 0; i < this.selectedProcessLinks.length; i++) {
      let link = new GojsLink();
      link.from = this.selectedProcessLinks[i].from.machine.idM.toString();
      link.to = this.selectedProcessLinks[i].to.machine.idM.toString();
      linkDataArray.push(link);
    }

    if(this.$ != null) {
      this.diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
      this.diagram.rebuildParts();
      return;
    }

    this.$ = go.GraphObject.make;

    this.diagram = this.$(go.Diagram, "processDiagramDiv",  // create a this.diagram for the DIV HTML element
      {
        initialContentAlignment: go.Spot.Center,  // center the content
        "undoManager.isEnabled": true  // enable undo & redo
      });

    this.diagram.layout =
      this.$(go.LayeredDigraphLayout,  // this will be discussed in a later section
        { columnSpacing: 5,
          setsPortSpots: false });



    this.diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    this.diagram.nodeTemplate =
      this.$(go.Node, "Auto",
        { fromSpot: go.Spot.Right,  // coming out from middle-right
          toSpot: go.Spot.Left },   // going into at middle-left
        this.$(go.Shape, { width : 90, height : 70 },  "RoundedRectangle", new go.Binding("fill", "color")),
        this.$(go.TextBlock,
          { margin: 5},
          new go.Binding("text", "text"))
      );

    this.diagram.linkTemplate =
      this.$(go.Link,
        this.$(go.Shape),
        this.$(go.Shape, { toArrow: "Triangle"})
      );
  }

  /* PROCESS METHODS END! */

  /* TOPOLOGY METHODS */

  makeGoTopology(){
    alert("sdas");
  }

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
