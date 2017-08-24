import {Component, OnInit} from '@angular/core';
import {Facility} from "../../beans/facility";
import {FSMService} from "../../services/fsm.service";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.css']
})
export class FacilitiesComponent implements OnInit {

  private facilities: Facility[] = [];

  constructor(private fsmService: FSMService, private roleService: RoleService) {
  }

  ngOnInit() {
    this.fsmService.getFacilities().subscribe(
      (data) => {
        this.facilities = JSON.parse(data['_body']);
      }
    );
  }

}
