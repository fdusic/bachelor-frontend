import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Machine} from "../beans/machine";
import {Process} from "../beans/process";
import {Link} from "../beans/link";

@Injectable()
export class ProcessService {

  private path = 'http://localhost:8080/process/';

  constructor(private http : Http) { }

  getProcessesForSection(sectionId) {
    return this.http.post(this.path + 'getProcessesForSection', sectionId.toString(), { withCredentials : true});
  }

  getTopologyById(topologyId) {
    return this.http.post(this.path + 'getTopologyById', topologyId.toString(), { withCredentials : true});
  }

  getImportSteps(machines : Machine[]) {
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.path + 'getImportSteps', JSON.stringify(machines) ,{ withCredentials : true, headers : headers });
  }

  saveProcessAndSteps(process : Process) {
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.path + 'saveProcessAndSteps', JSON.stringify(process), { withCredentials : true, headers : headers });
  }

  saveLinks(links : Link[]) {
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.path + 'saveLinks', JSON.stringify(links), { withCredentials : true, headers : headers });
  }

  getLinksForProcess(p : Process) {
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.path + 'getLinksForProcess', JSON.stringify(p), { withCredentials : true, headers : headers });
  }

}
