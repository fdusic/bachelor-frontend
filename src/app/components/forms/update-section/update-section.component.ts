import { Component, OnInit } from '@angular/core';
import {Section} from "../../../beans/section";
import {FSMService} from "../../../services/fsm.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-section',
  templateUrl: './update-section.component.html',
  styleUrls: ['./update-section.component.css']
})
export class UpdateSectionComponent implements OnInit {


  private section:Section = new Section();
  constructor(private fsmService:FSMService,private activatedRoute:ActivatedRoute,private router:Router) { }

  ngOnInit() {

    this.fsmService.getSectionById(this.activatedRoute.snapshot.params['idS']).subscribe(
      (data) => {
        this.section = JSON.parse(data['_body']);
      }
    );
  }


  onSubmit(section:Section){
    this.section.name = section.name;
    this.section.description = section.description;
    this.section.surface = section.surface;
    this.fsmService.updateSection(this.section).subscribe(
      () => {
        history.go(-1);
      }
    );
  }




}
