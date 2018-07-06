import { Component, OnInit } from '@angular/core';
import { SignalrPointService } from '../../service/signalr-point-service';

@Component({
  selector: 'app-course-point',
  templateUrl: './course-point.component.html',
  styleUrls: ['./course-point.component.css']
})
export class CoursePointComponent implements OnInit {
  currentPath;
  constructor(private pointService: SignalrPointService) {
    this.pointService.obSlaveNodes.subscribe(url => {
      this.currentPath = url;
      $('#nav-power-tab').trigger('click');
    });

  }

  ngOnInit() {
  }

}
