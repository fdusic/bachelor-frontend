import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";

@Injectable()
export class ProcessService {

  private path = 'http://localhost:8080/process/';

  constructor(private http : Http) { }

  getProcessesForSection(sectionId) {
    return this.http.post(this.path + 'getProcessesForSection', sectionId.toString(), { withCredentials : true});
  }

}
