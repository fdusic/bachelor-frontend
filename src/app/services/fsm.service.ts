import { Injectable } from '@angular/core';
import {Http,Headers} from "@angular/http";
import {Facility} from "../beans/facility";

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
    return this.http.post('http://localhost:8080/fsm/deleteFacility',idF);
  }

  getFacilities(){
    return this.http.get('http://localhost:8080/fsm/getFacilities');
  }

  getFacilityById(idF:number){
    return this.http.post('http://localhost:8080/fsm/getFacilityById',idF);
  }
  ///////////////////









}
