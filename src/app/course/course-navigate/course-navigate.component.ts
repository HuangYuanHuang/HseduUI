import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // 导入router服务
import { SignalrChatService, RealModel, ReceiveStausEnum } from '../../service/signalr-chat-service';

@Component({
  selector: 'app-course-navigate',
  templateUrl: './course-navigate.component.html',
  styleUrls: ['./course-navigate.component.less']
})
export class CourseNavigateComponent implements OnInit {
  teacherNum = 0;
  isFirst = true;
  constructor(private router: Router, private signalr: SignalrChatService) {
    this.signalr.obRealNodes.subscribe(node => {
      if (!this.isFirst) {
        return;
      }
      const subject = node as RealModel;
      if (subject.type === ReceiveStausEnum.OnlineNum) {
        this.teacherNum = 0;
        subject.data.forEach(d => {
          if (d.teacher) {
            this.teacherNum++;
          }

        });
        if (this.teacherNum === 1) {
          this.router.navigateByUrl('/course-master').then(f => {
            this.isFirst = false;
            setTimeout(() => {
              this.signalr.subjectReal.next(new RealModel(ReceiveStausEnum.OnlineNum, node.data));
            }, 100);
          });
        } else {
          this.router.navigateByUrl('/course').then(f => {
            this.isFirst = false;
            setTimeout(() => {
              this.signalr.subjectReal.next(new RealModel(ReceiveStausEnum.OnlineNum, node.data));
            }, 100);
          });
        }
      }

    });
  }

  ngOnInit() {
  }

}
