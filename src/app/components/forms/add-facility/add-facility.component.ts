import { Component, OnInit } from '@angular/core';
import {FSMService} from "../../../services/fsm.service";
import {Facility} from "../../../beans/facility";

@Component({
  selector: 'app-add-facility',
  templateUrl: './add-facility.component.html',
  styleUrls: ['./add-facility.component.css']
})
export class AddFacilityComponent implements OnInit {

  constructor(private pomService:FSMService) { }

  ngOnInit() {
  }


  onSubmit(facility:Facility){

  }

}
