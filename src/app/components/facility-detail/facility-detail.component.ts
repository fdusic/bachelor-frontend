import { Component, OnInit } from '@angular/core';
import {Facility} from "../../beans/facility";
import {FSMService} from "../../services/fsm.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Section} from "../../beans/section";

@Component({
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.component.html',
  styleUrls: ['./facility-detail.component.css']
})
export class FacilityDetailComponent implements OnInit {


  private facility:Facility = new Facility();

  constructor(private fsmService:FSMService,private router:Router,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.fsmService.getFacilityById(this.activatedRoute.snapshot.params['idF']).subscribe(
      (data) => {
        this.facility = JSON.parse(data['_body']);
      }
    );

  }

  deleteFacility(){
    this.fsmService.deleteFacility(this.facility.idF).subscribe(
      () => {
        this.router.navigateByUrl('/home/facilities');
      }
    );
  }

}
