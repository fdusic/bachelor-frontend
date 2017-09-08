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
  private facility:Facility = new Facility();

  constructor(private fsmService: FSMService, private roleService: RoleService) {
  }

  ngOnInit() {
    this.fsmService.getFacilities().subscribe(
      (data) => {
        this.facilities = JSON.parse(data['_body']);
      }
    );
  }


  assignFacilityForDelete(facility:Facility){
    this.facility = facility;
  }


  deleteFacility() {
    this.fsmService.deleteFacility(this.facility.idF).subscribe(
      () => {
        var index = this.facilities.indexOf(this.facility, 0);
        if (index > -1) {
          this.facilities.splice(index, 1);
        }
      }
    );
  }

}
