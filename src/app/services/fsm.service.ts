import { Injectable } from '@angular/core';
import {Http,Headers} from "@angular/http";
import {Facility} from "../beans/facility";
import {Section} from "../beans/section";
import {Interface} from "../beans/interface";
import {Machine} from "../beans/machine";
import {FailureReport} from "../beans/failureReport";
import {ConnectionType} from "../beans/connection-type";
import {Topology} from "../beans/topology";
import {MachineInTopology} from "../beans/machine-in-topology";

@Injectable()
export class FSMService {

  constructor(private http:Http) { }

  //CRUD ZA FACILITY
  createFacility(facility:Facility){
    const body = JSON.stringify(facility);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/createFacility',body,{
      headers:headers
    });
  }

  updateFacility(facility:Facility){
    const body = JSON.stringify(facility);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/updateFacility',body,{
      headers:headers
    });
  }

  deleteFacility(idF:number){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/deleteFacility',idF,{
      headers:headers
    });
  }

  getFacilities(){
    return this.http.get('http://localhost:8080/fsm/getFacilities');
  }

  getFacilityById(idF:number){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/getFacilityById',idF,{
      headers:headers
    });
  }



  ///////////////////
  //CRUD ZA SECTION

  getSectionById(idS:number){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/getSectionById',idS,{
      headers:headers
    });
  }


  getSectionByFacility(facility:Facility){
    const body = JSON.stringify(facility);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/getSectionByFacility',body,{
      headers:headers
    });
  }


  createSection(section:Section){
    const body = JSON.stringify(section);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/createSection',body,{
      headers:headers
    });
  }

  deleteSection(idS:number){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/deleteSection',idS,{
      headers:headers
    });
  }


  updateSection(section:Section){
    const body = JSON.stringify(section);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/updateSection',body,{
      headers:headers
    });
  }


  //////////////
  // CRUD ZA MACHINE

  createMachine(formData:FormData){
    return this.http.post('http://localhost:8080/fsm/createMachine',formData,{withCredentials:true});
  }

  getMachineById(idM:number){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/getMachineById',idM,{
      headers:headers
    });
  }

  getMachinesBySection(section:Section){
    const body = JSON.stringify(section);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/getMachinesBySection',body,{
      headers:headers
    });
  }


  deleteMachine(idM:number){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/deleteMachine',idM,{
      headers:headers
    });
  }


  /////////
  // CRUD ZA INTERFACE
  createInterface(iface:Interface){
    const body = JSON.stringify(iface);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/createInterface',body,{
      headers:headers
    });
  }

  getInterfaces(){
    return this.http.get('http://localhost:8080/fsm/getInterfaces');
  }

  machineSupportInterfaces(machine:Machine){
    const body = JSON.stringify(machine);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/machineSupportInterfaces',body,{
      headers:headers
    });
  }


  // report failure

  createFailureReport(rf : FailureReport){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/createFailureReport',JSON.stringify(rf),{
      headers:headers
    });
  }

  getFailureReports(){
    return this.http.get('http://localhost:8080/fsm/getFailureReports');
  }

  fixed(r){
    console.log(r);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/fixed',JSON.stringify(r),{
      headers:headers
    });
  }


  //KRUD ZA CONNECTION TYPE
  createConnectionType(connectionType:ConnectionType){
    const body = JSON.stringify(connectionType);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/createConnectionType',body,{
      headers:headers
    });
  }

  getConnectionTypes(){
    return this.http.get('http://localhost:8080/fsm/getConnectionTypes');
  }


  //KRUD ZA TOPOLOGIJU
  createTopology(topology:Topology){
    const body = JSON.stringify(topology);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/createTopology',body,{
      headers:headers
    });
  }

  createMachinesInTopology(mts:MachineInTopology[]){
    const body = JSON.stringify(mts);
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/fsm/createMachinesInTopology',body,{
      headers:headers
    });
  }

}
