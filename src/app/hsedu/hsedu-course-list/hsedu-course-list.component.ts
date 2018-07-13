import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hsedu-course-list',
  templateUrl: './hsedu-course-list.component.html',
  styleUrls: ['./hsedu-course-list.component.css']
})
export class HseduCourseListComponent implements OnInit {

  readonly defalutUrl = 'https://unescoedu.hyhrobot.com/api/courses/v1/courses';
  courses;
  constructor() { }

  ngOnInit() {

  }


}
