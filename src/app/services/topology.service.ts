import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Topology} from "../beans/topology";
import {ConnectedMachines} from "../beans/connected-machines";

@Injectable()
export class TopologyService {

  private path = 'http://localhost:8080/topology/';

  constructor(private http : Http) { }

  getTopologiesForSection(sectionId) {
    return this.http.post(this.path + 'getTopologiesForSection', sectionId.toString(), { withCredentials : true});
  }

  saveTopology(topology:Topology){
    const body = JSON.stringify(topology);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/topology/saveTopology', body, {
      headers: headers, withCredentials : true
    });
  }


  saveConnectedMachines(connectedMachines:ConnectedMachines[]){
    const body = JSON.stringify(connectedMachines);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/topology/saveConnectedMachines', body, {
      headers: headers, withCredentials : true
    });
  }

}
