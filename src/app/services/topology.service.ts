import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

@Injectable()
export class TopologyService {

  private path = 'http://localhost:8080/topology/';

  constructor(private http : Http) { }

  getTopologiesForSection(sectionId) {
    return this.http.post(this.path + 'getTopologiesForSection', sectionId.toString(), { withCredentials : true});
  }

}
