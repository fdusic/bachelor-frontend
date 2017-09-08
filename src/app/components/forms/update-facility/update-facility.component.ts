import { Component, OnInit } from '@angular/core';
import {Facility} from "../../../beans/facility";
import {FSMService} from "../../../services/fsm.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-facility',
  templateUrl: './update-facility.component.html',
  styleUrls: ['./update-facility.component.css']
})
export class UpdateFacilityComponent implements OnInit {


  private facility:Facility = new Facility();

  constructor(private fsmService:FSMService,private activatedRoute:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.fsmService.getFacilityById(this.activatedRoute.snapshot.params['idF']).subscribe(
      (data) => {
        this.facility = JSON.parse(data['_body']);
      }
    );
  }


  onSubmit(facility:Facility){
    this.fsmService.updateFacility(facility).subscribe(
      () => {
        this.router.navigateByUrl('/home/facilities');
      }
    );
  }

}
