import { Component, OnInit } from '@angular/core';
import { AgoraServiceService, SubjectVideo, AgoraEnum, AgoraVideoNode } from '../../service/agora-service.service';
import { UserContactService } from '../../service/user-contact-service';

@Component({
  selector: 'app-course-video',
  templateUrl: './course-video.component.html',
  styleUrls: ['./course-video.component.css']
})
export class CourseVideoComponent implements OnInit {
  public videoNodes = [];
  private currentPoper = { user: null, node: null };
  private currentContent = [];
  private interval = null;
  constructor(private agoraService: AgoraServiceService, private userContact: UserContactService) {
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

  itemPover(item: AgoraVideoNode, cotnent: any) {
    if (cotnent.isOpen()) {
      cotnent.close();
      while (this.currentContent.length > 0) {
        this.currentContent.pop().close();
      }
      return;
    }
    while (this.currentContent.length > 0) {
      this.currentContent.pop().close();
    }
    const userId = item.getStreamId();
    this.currentPoper.node = item;
    this.currentContent.push(cotnent);
    const userInfo = this.userContact.getUserInfoFromCache(userId);
    if (userInfo === null) {
      this.userContact.getUserInfoFromHttp(userId, (d) => {
        this.currentPoper.user = d;
        cotnent.open();
        this.clearOrOpenInterval();
      });
    } else {
      this.currentPoper.user = userInfo;
      console.log(userInfo);
      cotnent.open();
      this.clearOrOpenInterval();
    }

  }
  clearOrOpenInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      while (this.currentContent.length > 0) {
        this.currentContent.pop().close();
      }
    }, 5000);
  }

  ngOnInit() {

  }

}
