import { Component, OnInit } from '@angular/core';
import {FSMService} from "../../../services/fsm.service";
import {Facility} from "../../../beans/facility";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-facility',
  templateUrl: './add-facility.component.html',
  styleUrls: ['./add-facility.component.css']
})
export class AddFacilityComponent implements OnInit {

  constructor(private fsmService:FSMService,private router:Router) { }

  ngOnInit() {
  }


  onSubmit(facility:Facility){
      this.fsmService.createFacility(facility).subscribe(
        () => {
            this.router.navigateByUrl('/home/facilities');
        }
      );
  }

}
