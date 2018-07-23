import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // 导入router服务
import { HttpClient } from '@angular/common/http';
import { CourseConfig } from '../../../shard/CourseConfig';
import { RuntimeConfigService } from '../../service/runtime-config-service';

@Component({
  selector: 'app-course-navigate',
  templateUrl: './course-navigate.component.html',
  styleUrls: ['./course-navigate.component.less']
})
export class CourseNavigateComponent implements OnInit {
  teacherNum = 0;
  isFirst = true;
  constructor(private router: Router, private http: HttpClient,
    private runConfig: RuntimeConfigService) {
  }

  ngOnInit() {
    const apiPath = '/api/services/app/CourseLiveConfig/GetCourseLiveConfig?courseId=';
    const parms = window.location.search;
    this.http.get<any>(`${CourseConfig.CourseRootUrl}${apiPath}${encodeURIComponent(this.runConfig.courseId)}`).subscribe(data => {
      if (data.success) {
        if (data.result.masterId === this.runConfig.userId) {
          this.router.navigateByUrl('/course-master' + parms);
        } else {
          this.router.navigateByUrl('/course' + parms);
        }
      }

    });
  }

}
