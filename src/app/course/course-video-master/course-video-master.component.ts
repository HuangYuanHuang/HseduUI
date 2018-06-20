import { Component, OnInit, Input } from '@angular/core';
import { AgoraServiceService, AgoraVideoNode, SubjectVideo, AgoraEnum } from '../../service/agora-service.service';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-course-video-master',
  templateUrl: './course-video-master.component.html',
  styleUrls: ['./course-video-master.component.css']
})
export class CourseVideoMasterComponent implements OnInit {
  @Input() isTeacher;
  videoId: string;

  constructor(private agoraService: AgoraServiceService) {
    this.agoraService.changeVideOb.subscribe(node => {
      const subject = node as SubjectVideo;
      if (subject.is_teacher && subject.aogra === AgoraEnum.Connect) {
        this.videoId = subject.videNode.getStreamId();
        subject.videNode.play();
      } else if (subject.is_teacher && subject.aogra === AgoraEnum.DisConnect) {
        $('#' + this.videoId).html('');
      }
      console.log(subject);
    });
  }


  ngOnInit() {
  }

}
