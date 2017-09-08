import {Component, OnInit, ViewChild, AfterViewInit, DoCheck} from '@angular/core';
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
import * as go from "gojs";
import {BabicGoJsBean} from "../../beans/gojsBean";
import {GojsLink} from "../../beans/gojsLink";
import {Link} from "../../beans/link";
import {ConnectedMachines} from "../../beans/connected-machines";
import {GoJSBean} from "../../beans/gojs-bean";

declare let swal:any;

@Component({
  selector: 'app-section-detail',
  templateUrl: './section-detail.component.html',
  styleUrls: ['./section-detail.component.css']
})
export class SectionDetailComponent implements OnInit, DoCheck{

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
  @ViewChild('chooseTopologyForProcessClose') chooseTopologyForProcessClose : any;

  private $ : any = null;
  private diagram : any = null;
  private selectedProcess : Process = new Process();
  private selectedProcessLinks : Link[] = [];
  /* PROCESS VARIABLES END! */

  /* TOPOLOGY VARIABLES */
  private topologies : Topology[] = [];
  private selectedTopology:Topology = new Topology();
  private connectedMachines:ConnectedMachines[]=[];

  private top_$:any = null;
  private top_diagram:any = null;
  private linkDataArray:GoJSBean[]=[];

  /* TOPOLOGY VARIABLES END! */

  constructor(private fsmService:FSMService, private activatedRoute:ActivatedRoute,private router:Router, private roleService: RoleService,
                    private processService : ProcessService, private topologyService : TopologyService) { }




  ngDoCheck(){

  }

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
            document.getElementById('trp' + this.selectedProcess.idP).classList.add('selectedRow');
          }
        );
      }
    );

    this.topologyService.getTopologiesForSection(this.activatedRoute.snapshot.params['idS']).subscribe(
      (data) => {
        this.topologies = JSON.parse(data['_body']);
        if(this.topologies.length > 0){
          this.selectedTopology = this.topologies[0];

          this.processService.getMachineConnections(this.selectedTopology).subscribe(
            (data) => {
              this.connectedMachines = JSON.parse(data['_body']);
            }
          );
        }

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
    if(p.idP == this.selectedProcess.idP)
      return;
    document.getElementById('trp' + this.selectedProcess.idP).classList.remove('selectedRow');
    this.selectedProcess = p;
    document.getElementById('trp' + this.selectedProcess.idP).classList.add('selectedRow');
    this.processService.getLinksForProcess(p).subscribe(
      data => {
        if(data['_body'] != '') {
          this.selectedProcessLinks = JSON.parse(data['_body']);
        } else {
          this.selectedProcessLinks = [];
        }
        this.showProcessDiagram();
      }
    );

  }

  showProcessDiagram() {
    let nodeDataArray : BabicGoJsBean[] = [];
    for(let i = 0; i < this.selectedProcess.steps.length; i++) {
      let bean = new BabicGoJsBean();
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
        this.$(go.Shape,  "RoundedRectangle", new go.Binding("fill", "color")),
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

  makeGoTopology(topology:Topology){

    this.linkDataArray = [];
    if(this.top_diagram != null){
      this.top_diagram.div = null;
    }

    this.selectedTopology = topology;

    if(!document.getElementById('trtop' + this.selectedTopology.idT).classList.contains('tselectedRow')){
      document.getElementById('trtop' + this.selectedTopology.idT).classList.add('tselectedRow');


      for(var i = 0; i < this.topologies.length; i++){
        if(this.topologies[i].idT != this.selectedTopology.idT){
          if(document.getElementById('trtop' + this.topologies[i].idT).classList.contains('tselectedRow')){
            document.getElementById('trtop' + this.topologies[i].idT).classList.remove('tselectedRow');
          }
        }
      }
    }

    this.processService.getMachineConnections(this.selectedTopology).subscribe(
      (data) => {
        this.connectedMachines = JSON.parse(data['_body']);

        this.top_$ = go.GraphObject.make;
        this.top_diagram =
          this.top_$(go.Diagram, "topologyDiagramDiv",
            { // automatically scale the diagram to fit the viewport's size
              initialAutoScale: go.Diagram.Uniform,
              // start everything in the middle of the viewport
              initialContentAlignment: go.Spot.Center,
              // disable user copying of parts
              allowCopy: false,
              allowDelete:false,
              // position all of the nodes and route all of the links
              layout:
                this.top_$(go.LayeredDigraphLayout,
                  { direction: 90,
                    layerSpacing: 10,
                    columnSpacing: 15,
                    setsPortSpots: false })
            });



        this.top_diagram.nodeTemplate =
          this.top_$(go.Node, "Vertical",  // the whole node panel
            this.top_$(go.TextBlock, this.textStyle(),
              new go.Binding("text", "key")),
            this.top_$(go.Picture,  // the icon showing the logo
              // You should set the desiredSize (or width and height)
              // whenever you know what size the Picture should be.
              { desiredSize: new go.Size(75, 50) },
              new go.Binding("source", "key",this.convertKeyImage.bind(this)))
          );

        this.top_diagram.linkTemplate =
          this.top_$(go.Link,  // the whole link panel
            { curve: go.Link.Bezier, toShortLength: 2 },
            this.top_$(go.Shape,  // the link shape
              { strokeWidth: 2.5, stroke:"#669453" }),
            this.top_$(go.Shape,
              { fromArrow: "Backward", strokeWidth:3.5, stroke:"#669453" }),
            this.top_$(go.Shape,
              { toArrow: "Standard", strokeWidth:3.5, stroke:"#669453" })
          );




        //const linkDataArray = [];



        for(var i = 0; i < this.connectedMachines.length; i++){
          let gjsb1:GoJSBean = new GoJSBean();
          gjsb1.from = 'idM:'+this.connectedMachines[i].machine1.idM +' Name:'+this.connectedMachines[i].machine1.name;
          gjsb1.to = 'idM:'+this.connectedMachines[i].machine2.idM +' Name:'+this.connectedMachines[i].machine2.name;


          this.linkDataArray.push(gjsb1);
        }

        let otherMachines:Machine[]=[];


        for(var i = 0; i < this.selectedTopology.machines.length; i++){
          otherMachines.push(this.selectedTopology.machines[i]);
        }

        for(var i = 0; i < this.selectedTopology.machines.length; i++){
          for(var j = 0; j < this.connectedMachines.length; j++){
            if((this.selectedTopology.machines[i].idM == this.connectedMachines[j].machine1.idM) || (this.selectedTopology.machines[i].idM == this.connectedMachines[j].machine2.idM)){
              var index = otherMachines.indexOf(this.selectedTopology.machines[i], 0);
              if (index > -1) {
                otherMachines.splice(index, 1);
                continue;
              }
            }
          }
        }

        for(var i = 0; i < otherMachines.length; i++){
          let gjsb1:GoJSBean = new GoJSBean();
          gjsb1.from = 'idM:'+otherMachines[i].idM +' Name:'+otherMachines[i].name;
          this.linkDataArray.push(gjsb1);
        }


        // create the model and assign it to the Diagram
        this.top_diagram.model =
          this.top_$(go.GraphLinksModel,
            { // automatically create node data objects for each "from" or "to" reference
              // (set this property before setting the linkDataArray)
              archetypeNodeData: {},
              // process all of the link relationship data
              linkDataArray: this.linkDataArray
            });


        // this.top_$ = $;
        // this.top_diagram = myDiagram;

      }
    );

  }


  convertKeyImage(key) {

    let s:string[] = key.split(' ');
    let idM:number = parseInt(s[0].split(':')[1]);
    let m:Machine = null;

    for(var i = 0; i < this.selectedTopology.machines.length; i++){
      if(this.selectedTopology.machines[i].idM == idM){
        m = this.selectedTopology.machines[i];
        break;
      }
    }

    return "../../../images/" + m.idM +m.image;
  }

  textStyle() {
    return {
      margin: 6,
      textAlign: "center",
      font: "bold 10pt Beirut"
    };
  }


  /* TOPOLOGY METHODS END! */


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


  sipaj(){
    console.log("dsadas");
  }


}
