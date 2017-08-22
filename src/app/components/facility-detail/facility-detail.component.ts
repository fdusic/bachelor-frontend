import {Component, OnInit} from '@angular/core';
import {Facility} from "../../beans/facility";
import {FSMService} from "../../services/fsm.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Section} from "../../beans/section";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.component.html',
  styleUrls: ['./facility-detail.component.css']
})
export class FacilityDetailComponent implements OnInit {

  private facility: Facility = new Facility();
  private sections: Section[] = [];

  constructor(private fsmService: FSMService, private router: Router, private activatedRoute: ActivatedRoute, private roleService: RoleService) {
  }

  ngOnInit() {
    this.fsmService.getFacilityById(this.activatedRoute.snapshot.params['idF']).subscribe(
      (data) => {
        this.facility = JSON.parse(data['_body']);
        this.fsmService.getSectionByFacility(this.facility).subscribe(
         (data) => {
         this.sections = JSON.parse(data['_body']);
         }
         );
      }
    );

  }

  deleteFacility() {
    this.fsmService.deleteFacility(this.facility.idF).subscribe(
      () => {
        this.router.navigateByUrl('/home/facilities');
      }
    );
  }

}
