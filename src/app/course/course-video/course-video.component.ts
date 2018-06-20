import { Component, OnInit } from '@angular/core';
import { AgoraServiceService, SubjectVideo, AgoraEnum } from '../../service/agora-service.service';
@Component({
  selector: 'app-course-video',
  templateUrl: './course-video.component.html',
  styleUrls: ['./course-video.component.css']
})
export class CourseVideoComponent implements OnInit {
  public videoNodes = [];
  constructor(private agoraService: AgoraServiceService) {
    this.agoraService.changeVideOb.subscribe(node => {
      const subject = node as SubjectVideo;
      if (!subject.is_teacher && subject.aogra === AgoraEnum.Connect && !subject.is_peer) {
        this.videoNodes.push(subject.videNode);
        subject.videNode.play();
      } else if (!subject.is_teacher && subject.aogra === AgoraEnum.DisConnect) {
        console.log('user is disconnet' + subject.videNode.getStreamId());
        this.removeNode(subject.videNode.getStreamId());
      }
      console.log(subject);
    });
  }

  removeNode(streamId: any) {
    let index = 0;
    this.videoNodes.forEach(d => {
      if (d.getStreamId() === streamId) {
        this.videoNodes.splice(index, 1);

      }
      index++;
    });

  }
  ngOnInit() {
  }

}
