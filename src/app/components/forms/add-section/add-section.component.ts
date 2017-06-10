import { Component, OnInit } from '@angular/core';
import {Section} from "../../../beans/section";
import {Router, ActivatedRoute} from "@angular/router";
import {Facility} from "../../../beans/facility";
import {FSMService} from "../../../services/fsm.service";

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css']
})
export class AddSectionComponent implements OnInit {

  private facility:Facility = new Facility();

  constructor(private router:Router,private activatedRoute:ActivatedRoute,private fsmService:FSMService) { }


  ngOnInit() {
    this.fsmService.getFacilityById(this.activatedRoute.snapshot.params['idF']).subscribe(
      (data) => {
        this.facility = JSON.parse(data['_body']);
      }
    );

  }


  onSubmit(section:Section){
      section.facility = this.facility;

      this.fsmService.createSection(section).subscribe(
        () => {
          this.router.navigateByUrl('/home/facilities/'+this.facility.idF);
        }
      );
  }

}
