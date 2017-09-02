import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";
import {ProcessService} from "../../services/process.service";
import {Topology} from "../../beans/topology";
import {Machine} from "../../beans/machine";
import {Step} from "../../beans/step";
import {NgForm} from "@angular/forms";
import {Link} from "../../beans/link";
import * as go from "gojs";
import {GojsBean} from "../../beans/gojsBean";
import {GojsLink} from "../../beans/gojsLink";
import {Process} from "../../beans/process";
import {ProcessSaveHelp} from "../../beans/processSaveHelp";
import {ConnectedMachines} from "../../beans/connected-machines";

@Component({
  selector: 'app-create-process',
  templateUrl: './create-process.component.html',
  styleUrls: ['./create-process.component.css']
})
export class CreateProcessComponent implements OnInit {

  @ViewChild('li1') li1 : any;
  @ViewChild('li2') li2 : any;
  @ViewChild('li3') li3 : any;
  @ViewChild('li4') li4 : any;

  @ViewChild('div1') div1 : any;
  @ViewChild('div2') div2 : any;
  @ViewChild('div3') div3 : any;
  @ViewChild('div4') div4 : any;

  @ViewChild('processDetailForm') processDetailForm : any;

  @ViewChild('newStepClose') newStepClose : any;
  @ViewChild('importStepClose') importStepClose : any;
  @ViewChild('addSuccessorsClose') addSuccessorsClose : any;

  private topology : Topology = new Topology();
  private connectedMachines : ConnectedMachines[] = [];
  private availableMachines : Machine[] = [];
  private steps : Step[] = [];
  private importSteps : Step[] = [];
  private chosenStep : Step = null;
  private selectedStep : Step = null;
  private successors : Step[] = [];
  private links : Link[] = [];
  private availableSuccessors : Step[] = [];
  private selectedSuccessor : Step = null;

  private $ : any = null;
  private diagram : any = null;

  constructor(private activatedRoute: ActivatedRoute, private processService : ProcessService, private router : Router) { }

  ngOnInit() {
    this.processService.getTopologyById(this.activatedRoute.snapshot.params['idT']).subscribe(
      (data) => {
        this.topology = JSON.parse(data['_body']);
        this.availableMachines = this.topology.machines;
        this.processService.getMachineConnections(this.topology).subscribe(
          data => {
            this.connectedMachines = JSON.parse(data['_body']);
          }
        );
      }
    );
  }

  addStep(f : NgForm) {
    if(!f.valid)
      return;
    this.newStepClose.nativeElement.click();

    let s = new Step();
    s.description = f.controls['description'].value;
    s.name = f.controls['name'].value;
    s.color = f.controls['color'].value;

    for(let i = 0 ; i < this.availableMachines.length; i++) {
      if(this.availableMachines[i].idM == f.controls['machine'].value){
        s.machine = this.availableMachines[i];
        this.availableMachines.splice(this.availableMachines.indexOf(this.availableMachines[i]), 1);
        //this.removeFromImportSteps(this.availableMachines[i]);
        break;
      }
    }
    this.steps.push(s);
    f.reset();
  }

 /* removeFromImportSteps(m : Machine) {
    for(let i = 0; i < this.importSteps.length; i++) {
      if(this.importSteps[i].machine.idM == m.idM) {
        this.
      }
    }
  }*/

  setAvailableSuccessors() {
    this.availableSuccessors = [];

    if(this.selectedSuccessor != null)
      document.getElementById('ttr' + this.selectedSuccessor.machine.idM).classList.remove('selectedRow');

    for(let i = 0; i < this.steps.length; i++) {
      let flag = true;
      for(let j = 0; j < this.links.length; j++) {
        if(this.links[j].from.machine.idM == this.selectedStep.machine.idM && this.links[j].to.machine.idM == this.steps[i].machine.idM) {
          flag = false;
          break;
        }
      }

      if(flag && this.areConnected(this.selectedStep.machine, this.steps[i].machine)) {
        this.availableSuccessors.push(this.steps[i]);
      }
    }

    let tempButton = this.addSuccessorsClose;
    if(this.availableSuccessors.length == 0) {
      swal(
        'Error',
        'There are no more available successors!',
        'error'
      ).then(
        function(){
          tempButton.nativeElement.click();
        }
      );
    }
  }

  areConnected(m1 : Machine, m2 : Machine) {
    if(m1.idM == m2.idM)
      return true;
    for(let i = 0; i < this.connectedMachines.length; i++) {
      if((this.connectedMachines[i].machine1.idM == m1.idM && this.connectedMachines[i].machine2.idM == m2.idM) ||
                                            ((this.connectedMachines[i].machine2.idM == m1.idM && this.connectedMachines[i].machine1.idM == m2.idM))) {
        console.log(m1.idM + ' ' + m2.idM);
        return true;
      }
    }
    return false;
  }

  addSuccessor() {
    this.successors.push(this.selectedSuccessor);
    this.availableSuccessors.splice(this.availableSuccessors.indexOf(this.selectedSuccessor), 1);
    let link = new Link();
    link.from = this.selectedStep;
    link.to = this.selectedSuccessor;
    this.links.push(link);
    this.selectedSuccessor = null;
    this.addSuccessorsClose.nativeElement.click();
  }

  removeFromSuccessors(s : Step) {
    this.successors.splice(this.successors.indexOf(s), 1);
    this.availableSuccessors.push(s);

    for(let i = 0; i < this.links.length; i++) {
      if(this.links[i].from.machine.idM == this.selectedStep.machine.idM && this.links[i].to.machine.idM == s.machine.idM){
        this.links.splice(this.links.indexOf(this.links[i]),1);
        break;
      }
    }
  }

  chooseSuccessor(s : Step) {
    if(this.selectedSuccessor != null)
      document.getElementById('ttr' + this.selectedSuccessor.machine.idM).classList.remove('selectedRow');
    this.selectedSuccessor = s;
    document.getElementById('ttr' + s.machine.idM).classList.add('selectedRow');
  }

  onNewStep() {
    if(this.availableMachines.length == 0) {
      let tempButton = this.newStepClose;
      swal(
        'Error',
        'There are no more available machines!',
        'error'
      ).then(
        function(){
          tempButton.nativeElement.click();
        }
      );
    }
  }

  onImportSteps() {
    if(this.availableMachines.length == 0) {
      let tempButton = this.importStepClose;
      swal(
        'Error',
        'There are no more available machines!',
        'error'
      ).then(
        function(){
          tempButton.nativeElement.click();
        }
      );
      return;
    }

    this.processService.getImportSteps(this.availableMachines).subscribe(
      (data) => {
        console.log(JSON.parse(data['_body']));
        this.importSteps = JSON.parse(data['_body']);
        if(this.importSteps.length == 0) {
          swal(
            'Error',
            'There are no available steps to import for the machines that are left!',
            'error'
          );
          return;
        }
      }
    );
  }

  chooseStep(s : Step){
    if(this.chosenStep != null)
      document.getElementById('tr' + this.chosenStep.idStep).classList.remove('selectedRow');
    this.chosenStep = s;
    document.getElementById('tr' + s.idStep).classList.add('selectedRow');
  }

  selectStep(s : Step) {
    this.successors = [];
    for(let i = 0; i < this.links.length; i++) {
      if(this.links[i].from.machine.idM == s.machine.idM){
        this.successors.push(this.links[i].to);
      }
    }
    if(this.selectedStep != null)
      document.getElementById('trr' + this.selectedStep.machine.idM).classList.remove('selectedRow');
    this.selectedStep = s;
    document.getElementById('trr' + s.machine.idM).classList.add('selectedRow');
  }

  import() {
    if(this.chosenStep == null) {
      swal(
        'Error',
        'No step is chosen!',
        'error'
      );
    } else {
      for(let i = 0; i < this.availableMachines.length; i++) {
        if(this.availableMachines[i].idM == this.chosenStep.machine.idM){
          this.availableMachines.splice(i, 1);
        }
      }
      this.importStepClose.nativeElement.click();
      this.importSteps.splice(this.importSteps.lastIndexOf(this.chosenStep), 1);
      this.steps.push(this.chosenStep);
      this.chosenStep = null;
    }
  }

  next(n : number) {
    switch (n){
      case 1 : {
        if(!this.processDetailForm.valid) {
          swal(
            'Error',
            'Name must contain between 5 and 20 characters. \n Description must contain between 5 and 100 characters.',
            'error'
          );
          return;
        }
        this.li2.nativeElement.className = 'active';
        this.li1.nativeElement.className = '';
        this.div2.nativeElement.className = 'tab-pane active';
        this.div1.nativeElement.className = 'tab-pane';
        break;
      }
      case 2 : {
        if(this.steps.length == 0){
          swal(
            'Error',
            'No steps defined!',
            'error'
          );
          return;
        }

        this.li3.nativeElement.className = 'active';
        this.li2.nativeElement.className = '';
        this.div3.nativeElement.className = 'tab-pane active';
        this.div2.nativeElement.className = 'tab-pane';
        break;
      }
      case 3 : {
        if(this.links.length == 0) {
          swal(
            'Error',
            'No links defined!',
            'error'
          );
          return;
        }
        this.showDiagram();
        this.li4.nativeElement.className = 'active';
        this.li3.nativeElement.className = '';
        this.div4.nativeElement.className = 'tab-pane active';
        this.div3.nativeElement.className = 'tab-pane';
        break;
      }
    }
  }

  previous(n : number) {
    switch(n) {
      case 2 : {
        this.li1.nativeElement.className = 'active';
        this.li2.nativeElement.className = '';
        this.div1.nativeElement.className = 'tab-pane active';
        this.div2.nativeElement.className = 'tab-pane';
        break;
      }
      case 3 : {
        this.li2.nativeElement.className = 'active';
        this.li3.nativeElement.className = '';
        this.div2.nativeElement.className = 'tab-pane active';
        this.div3.nativeElement.className = 'tab-pane';
        break;
      }
      case 4 : {
        this.li3.nativeElement.className = 'active';
        this.li4.nativeElement.className = '';
        this.div3.nativeElement.className = 'tab-pane active';
        this.div4.nativeElement.className = 'tab-pane';
        break;
      }
    }
  }

  showDiagram() {

    let nodeDataArray : GojsBean[] = [];
    for(let i = 0; i < this.steps.length; i++) {
      let bean = new GojsBean();
      bean.key = this.steps[i].machine.idM.toString();
      bean.text = this.steps[i].name;
      bean.color = this.steps[i].color;
      nodeDataArray.push(bean);
    }

    let linkDataArray : GojsLink[] = [];
    for(let i = 0; i < this.links.length; i++) {
      let link = new GojsLink();
      link.from = this.links[i].from.machine.idM.toString();
      link.to = this.links[i].to.machine.idM.toString();
      linkDataArray.push(link);
    }

    if(this.$ != null) {
      this.diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
      this.diagram.rebuildParts();
      return;
    }

    this.$ = go.GraphObject.make;

    this.diagram = this.$(go.Diagram, "gojsDiv",  // create a this.diagram for the DIV HTML element
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
        this.$(go.Shape, "RoundedRectangle", new go.Binding("fill", "color")),
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

  save() {
    let process = new Process();
    process.description = this.processDetailForm.controls['description'].value;
    process.name = this.processDetailForm.controls['name'].value;
    process.steps = this.steps;
    process.topology = this.topology;

    console.log(process);

    this.processService.saveProcessAndSteps(process).subscribe(
      (data) => {
        let psh : ProcessSaveHelp = JSON.parse(data['_body']);
        let steps : Step[] = psh.steps;
        let p : Process = psh.process;

        for(let i = 0; i < steps.length; i++) {
          for(let j = 0; j < this.links.length; j++) {
            if(this.links[j].from.machine.idM == steps[i].machine.idM) {
              this.links[j].from = steps[i];
            }
            if(this.links[j].to.machine.idM == steps[i].machine.idM) {
              this.links[j].to = steps[i];
            }
            this.links[j].process = p;
          }
        }
        const tempRouter = this.router;
        const tempSection = this.topology.section;
        this.processService.saveLinks(this.links).subscribe(
          () => {
            swal(
              'Success',
              'The process has been saved!',
              'success'
            ).then(
              function() {
                tempRouter.navigateByUrl('/home/sections/' + tempSection.idS);
              }
            );
          }
        );
      }
    );
  }

}
