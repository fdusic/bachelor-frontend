import { Component, OnInit, ViewChild } from '@angular/core';
import {Section} from "../../beans/section";
import {FSMService} from "../../services/fsm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Machine} from "../../beans/machine";
import {ConnectionType} from "../../beans/connection-type";
import {Topology} from "../../beans/topology";
import {ConnectedMachines} from "../../beans/connected-machines";
import * as go from "gojs";
import {GoJSBean} from "../../beans/gojs-bean";
import {Interface} from "../../beans/interface";
import {TopologyService} from "../../services/topology.service";

declare let swal:any;

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
  private connectionTypes:ConnectionType[]=[];
  private viewMachine:Machine = new Machine();


  //koraci
  private step1:boolean = true;

  private step2:boolean = false;
  private step2_2:boolean = false;

  private step3:boolean = false;

  private nextBoolean:boolean = true;
  private finishBoolean:boolean = false;


  //za konekciju
  private machinesToConnect:Machine[]=[];
  private machineToConnect:Machine = new Machine();

  private commonInterfaces:Interface[]=[];
  private commonProtocols:ConnectionType[]=[];


  private connectingMachine:Machine = new Machine();

  private selectedInterface:Interface = new Interface();
  private selectedProtocol:ConnectionType = new ConnectionType();

  private connectedMachines:ConnectedMachines[]=[];




  constructor(private fsmService:FSMService, private activatedRoute:ActivatedRoute,private router:Router,private topologyService:TopologyService) { }

  ngOnInit() {

    this.fsmService.getSectionById(this.activatedRoute.snapshot.params['idS']).subscribe(
      (data) => {
        this.section = JSON.parse(data['_body']);
        this.fsmService.getMachinesBySection(this.section).subscribe(
          (data) => {
            this.machines = JSON.parse(data['_body']);
            this.viewMachine = this.machines[0];
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

  machineClick(machine:Machine){

    if(document.getElementById('tr'+machine.idM).style.backgroundColor){
      document.getElementById('tr'+machine.idM).style.removeProperty('background-color');
      var index = this.selectedMachines.indexOf(machine, 0);
      if (index > -1) {
        this.selectedMachines.splice(index, 1);
      }
    }else{
      document.getElementById('tr'+machine.idM).style.backgroundColor="#b4bec9";
      this.selectedMachines.push(machine);
    }
  }


  assignMasineForView(machine:Machine){
      this.viewMachine = machine;
  }


  onNext(){

    if(this.step1){
      if(this.selectedMachines.length < 2){
        swal(
          'Requirement: Choose at least 2 machines.',
          '',
          'warning'
        );
        return;
      }

      this.step1=false;
      this.step2=true;
      return;
    }

    if(this.step2){
      this.step2 = false;
      this.step2_2 = false;
      this.step3 = true;
      return;
    }


    if(this.step3){
        document.getElementById("buttonTModal").click();
    }
  }



  selectedMachineClick(m:Machine){

    this.machinesToConnect = [];
    if(document.getElementById('trsm'+m.idM).style.backgroundColor){
      document.getElementById('trsm' + m.idM).style.removeProperty('background-color');
      this.machineToConnect = new Machine();
      this.step2_2 = false;
    }else{
      document.getElementById('trsm'+m.idM).style.backgroundColor="#b4bec9";

      for(var i = 0; i < this.selectedMachines.length; i++){
        if(this.selectedMachines[i].idM != m.idM){

          if(document.getElementById('trsm'+this.selectedMachines[i].idM).style.backgroundColor) {
            document.getElementById('trsm' + this.selectedMachines[i].idM).style.removeProperty('background-color');
          }

          this.machinesToConnect.push(this.selectedMachines[i]);
        }
      }
      this.machineToConnect = m;
      this.step2_2 = true;
    }
  }


  canConnect(m:Machine){
    let cnt:number = 0;

    for(var i = 0; i < m.supportsInterface.length; i++){

      if(cnt == 1){
        break;
      }

      for(var j = 0; j < this.machineToConnect.supportsInterface.length; j++){
        if(m.supportsInterface[i].idI == this.machineToConnect.supportsInterface[j].idI){
          cnt++;
          break;
        }
      }
    }

    for(var i = 0; i < m.supportsProtocol.length; i++){

      if(cnt == 2){
        break;
      }

      for(var j = 0; j < this.machineToConnect.supportsProtocol.length; j++){
        if(m.supportsProtocol[i].idCT == this.machineToConnect.supportsProtocol[j].idCT){
          cnt++;
          break;
        }
      }
    }


    if(cnt == 2){
      return true;
    }

    return false;
  }


  connectMachines(m:Machine){
    if(!this.canConnect(m)){
      swal(
        'Machines can not be connected!',
        'Requirement: Common interface and protocol.',
        'error'
      );
      return;
    }

    this.commonInterfaces=[];
    this.commonProtocols=[];

    for(var i = 0; i < m.supportsInterface.length; i++){
      for(var j = 0; j < this.machineToConnect.supportsInterface.length; j++){
        if(m.supportsInterface[i].idI == this.machineToConnect.supportsInterface[j].idI){
          this.commonInterfaces.push(m.supportsInterface[i]);
        }
      }
    }


    for(var i = 0; i < m.supportsProtocol.length; i++){
      for(var j = 0; j < this.machineToConnect.supportsProtocol.length; j++){
        if(m.supportsProtocol[i].idCT == this.machineToConnect.supportsProtocol[j].idCT){
          this.commonProtocols.push(m.supportsProtocol[i]);
        }
      }
    }

    this.connectingMachine = m;
    document.getElementById("buttonIPModal").click();
  }


  commonInterfacesClick(iface:Interface){
      if(document.getElementById('trcis'+iface.idI).style.backgroundColor){
        document.getElementById('trcis' + iface.idI).style.removeProperty('background-color');
        this.selectedInterface = new Interface();
      }else{
        document.getElementById('trcis'+iface.idI).style.backgroundColor='#b4bec9';
        this.selectedInterface = iface;

        for(var i = 0;i < this.commonInterfaces.length; i++){
          if(this.commonInterfaces[i].idI != iface.idI){
            if(document.getElementById('trcis'+this.commonInterfaces[i].idI).style.backgroundColor){
              document.getElementById('trcis' + this.commonInterfaces[i].idI).style.removeProperty('background-color');
            }
          }
        }
      }
  }

  commonProtocolClick(ct:ConnectionType){
    if(document.getElementById('trcps'+ct.idCT).style.backgroundColor){
      document.getElementById('trcps' + ct.idCT).style.removeProperty('background-color');
      this.selectedProtocol = new ConnectionType();
    }else{
      document.getElementById('trcps'+ct.idCT).style.backgroundColor='#b4bec9';
      this.selectedProtocol = ct;


      for(var i = 0;i < this.commonProtocols.length; i++){
        if(this.commonProtocols[i].idCT != ct.idCT){
          if(document.getElementById('trcps'+this.commonProtocols[i].idCT).style.backgroundColor){
            document.getElementById('trcps' + this.commonProtocols[i].idCT).style.removeProperty('background-color');
          }
        }
      }
    }
  }


  onFinishConnection(){

    if(!this.selectedInterface.idI){
      swal(
        'Select the connection interface!',
        '',
        'warning'
      );
      return;
    }

    if(!this.selectedProtocol.idCT){
      swal(
        'Select the connection protocol!',
        '',
        'warning'
      );
      return;
    }



    let cm:ConnectedMachines = new ConnectedMachines();
    cm.machine1 = this.machineToConnect;
    cm.machine2 = this.connectingMachine;
    cm.connectionType = this.selectedProtocol;
    cm.iface = this.selectedInterface;

    this.connectedMachines.push(cm);

    document.getElementById("closeIPModal").click();
  }


  areConnected(m:Machine){
    for(var i = 0; i < this.connectedMachines.length; i++){
      let machine1:Machine = this.connectedMachines[i].machine1;
      let machine2:Machine = this.connectedMachines[i].machine2;


      if((machine1.idM == this.machineToConnect.idM && machine2.idM == m.idM) || (machine2.idM == this.machineToConnect.idM && machine1.idM == m.idM)){
        return true;
      }
    }


    return false;
  }


  disconnectMachines(m:Machine){

    let connectedMachines:ConnectedMachines[] = this.connectedMachines;
    let machineToConnect:Machine = this.machineToConnect;

     swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Cut off!'
    }).then(function () {

      let cm:ConnectedMachines = new ConnectedMachines();

         for(var i = 0; i < connectedMachines.length; i++){
           let machine1:Machine = connectedMachines[i].machine1;
           let machine2:Machine = connectedMachines[i].machine2;


           if((machine1.idM == machineToConnect.idM && machine2.idM == m.idM) || (machine2.idM == machineToConnect.idM && machine1.idM == m.idM)){
             cm = connectedMachines[i];
             break;
           }
         }

         var index = connectedMachines.indexOf(cm, 0);
         if (index > -1) {
           connectedMachines.splice(index, 1);
         }

    },function (dismiss) {

     }
    );
  }


  onSubmitTopology(topology:Topology){

    topology.machines = this.selectedMachines;
    topology.section = this.section;
    topology.active = false;

    //SERVIS -- Metoda za dodavanje topologije
    this.topologyService.saveTopology(topology).subscribe(
      (data) => {
        topology = JSON.parse(data['_body']);

        for(var i = 0; i < this.connectedMachines.length; i++){
          this.connectedMachines[i].topology = topology;
        }

        this.topologyService.saveConnectedMachines(this.connectedMachines).subscribe(
          () => {

          }
        );

      }
    );


    //ODMA TU dodavanje svih ConnectedMachines-a


    this.step3 = false;
    document.getElementById("myDiagramDiv").style.display='';


    //Prikaz go.js

    const $ = go.GraphObject.make;
    const myDiagram =
      $(go.Diagram, "myDiagramDiv",
        { // automatically scale the diagram to fit the viewport's size
          initialAutoScale: go.Diagram.Uniform,
          // start everything in the middle of the viewport
          initialContentAlignment: go.Spot.Center,
          // disable user copying of parts
          allowCopy: false,
          allowDelete:false,
          // position all of the nodes and route all of the links
          layout:
            $(go.LayeredDigraphLayout,
              { direction: 90,
                layerSpacing: 10,
                columnSpacing: 15,
                setsPortSpots: false })
        });


    myDiagram.nodeTemplate =
      $(go.Node, "Vertical",  // the whole node panel
        $(go.TextBlock, this.textStyle(),
          new go.Binding("text", "key")),
        $(go.Picture,  // the icon showing the logo
          // You should set the desiredSize (or width and height)
          // whenever you know what size the Picture should be.
          { desiredSize: new go.Size(75, 50) },
          new go.Binding("source", "key",this.convertKeyImage.bind(this)))
      );

    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        { curve: go.Link.Bezier, toShortLength: 2 },
        $(go.Shape,  // the link shape
          { strokeWidth: 2.5, stroke:"#669453" }),
        $(go.Shape,
          { fromArrow: "Backward", strokeWidth:3.5, stroke:"#669453" }),
        $(go.Shape,
          { toArrow: "Standard", strokeWidth:3.5, stroke:"#669453" })
      );




    const linkDataArray = [];



    for(var i = 0; i < this.connectedMachines.length; i++){
      let gjsb1:GoJSBean = new GoJSBean();
      gjsb1.from = 'idM:'+this.connectedMachines[i].machine1.idM +' Name:'+this.connectedMachines[i].machine1.name;
      gjsb1.to = 'idM:'+this.connectedMachines[i].machine2.idM +' Name:'+this.connectedMachines[i].machine2.name;


      linkDataArray.push(gjsb1);
    }

    let otherMachines:Machine[]=[];


    for(var i = 0; i < this.selectedMachines.length; i++){
      otherMachines.push(this.selectedMachines[i]);
    }

    for(var i = 0; i < this.selectedMachines.length; i++){
      for(var j = 0; j < this.connectedMachines.length; j++){
        if((this.selectedMachines[i].idM == this.connectedMachines[j].machine1.idM) || (this.selectedMachines[i].idM == this.connectedMachines[j].machine2.idM)){
          var index = otherMachines.indexOf(this.selectedMachines[i], 0);
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
      linkDataArray.push(gjsb1);
    }


    // create the model and assign it to the Diagram
    myDiagram.model =
      $(go.GraphLinksModel,
        { // automatically create node data objects for each "from" or "to" reference
          // (set this property before setting the linkDataArray)
          archetypeNodeData: {},
          // process all of the link relationship data
          linkDataArray: linkDataArray
        });


    this.nextBoolean = false;
    this.finishBoolean = true;

    document.getElementById("closeTopologyModal").click();

  }



   convertKeyImage(key) {

     let s:string[] = key.split(' ');
     let idM:number = parseInt(s[0].split(':')[1]);
     let m:Machine = null;

     for(var i = 0; i < this.selectedMachines.length; i++){
        if(this.selectedMachines[i].idM == idM){
          m = this.selectedMachines[i];
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





}
