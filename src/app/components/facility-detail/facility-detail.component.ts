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
  private closeDetailsBool:boolean = true;
  private section:Section = new Section();

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



  closeDetails(){
    this.closeDetailsBool = false;
    document.getElementById("sectionDiv").classList.remove("col-lg-8");
    document.getElementById("sectionDiv").classList.add("col-lg-12");
  }



  assignSectionForDelete(section:Section){
    this.section = section;
  }


  deleteSection(){
    this.fsmService.deleteSection(this.section.idS).subscribe(
      () => {
        var index = this.sections.indexOf(this.section, 0);
        if (index > -1) {
          this.sections.splice(index, 1);
        }
      }
    );
  }

}
