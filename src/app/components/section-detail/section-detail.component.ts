import { Component, OnInit } from '@angular/core';
import {Section} from "../../beans/section";
import {FSMService} from "../../services/fsm.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-section-detail',
  templateUrl: './section-detail.component.html',
  styleUrls: ['./section-detail.component.css']
})
export class SectionDetailComponent implements OnInit {

  private section:Section = new Section();

  constructor(private fsmService:FSMService, private activatedRoute:ActivatedRoute,private router:Router) { }

  ngOnInit() {

    this.fsmService.getSectionById(this.activatedRoute.snapshot.params['idS']).subscribe(
      (data) => {
        this.section = JSON.parse(data['_body']);
      }
    );
  }


  deleteSection(){
    this.fsmService.deleteSection(this.section.idS).subscribe(
      () => {
        this.router.navigateByUrl('/home/facilities');
      }
    );
  }

}
