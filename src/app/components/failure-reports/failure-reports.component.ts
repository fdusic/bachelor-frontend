import { Component, OnInit } from '@angular/core';
import {FSMService} from "../../services/fsm.service";
import {FailureReport} from "../../beans/failureReport";

@Component({
  selector: 'app-failure-reports',
  templateUrl: './failure-reports.component.html',
  styleUrls: ['./failure-reports.component.css']
})
export class FailureReportsComponent implements OnInit {

  private reports : FailureReport[] = [];

  constructor(private fsmService : FSMService) { }

  ngOnInit() {
    this.fsmService.getFailureReports().subscribe(
      data => {
        this.reports = JSON.parse(data['_body']);
      }
    );
  }

  fixed(r){
    this.fsmService.fixed(r).subscribe(
      () => {
        this.reports.splice(this.reports.indexOf(r),1);
      }
    );
  }

}
