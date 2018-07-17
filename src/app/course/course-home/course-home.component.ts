import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgoraServiceService, SubjectVideo, AgoraVideoNode, AgoraEnum } from '../../service/agora-service.service';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { SignalrChatService, ReceiveStausEnum } from '../../service/signalr-chat-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-home',
  templateUrl: './course-home.component.html',
  styleUrls: ['./course-home.component.css']
})
export class CourseHomeComponent implements OnInit {
  @ViewChild('content') modalContext: ElementRef;

  public localVideoNode: AgoraVideoNode;
  courseId;
  userId;
  userName;
  courseName;
  isTeacher = false;
  constructor(private agora: AgoraServiceService, private runConfig: RuntimeConfigService,
    private signalr: SignalrChatService, private modalService: NgbModal) {
    this.courseId = runConfig.courseId;
    this.userId = runConfig.userId;
    this.userName = runConfig.userName;
    this.courseName = runConfig.courseName;
    this.agora.agoraInit(this.userId, this.courseId, true, true, this.isTeacher, false);
    this.agora.changeVideOb.subscribe(node => {
      const subject = node as SubjectVideo;
      if (subject.is_local && !subject.is_peer) {
        this.localVideoNode = this.agora.localVideo;
      }

    });
  }
  streamClose() {
    this.localVideoNode.stop();
    $('.div-button button').attr('disabled', 'disabled');
    this.agora.subjectVideo.next(new SubjectVideo(this.localVideoNode, AgoraEnum.DisConnect, this.isTeacher, true, false));
  }

  playVideo(item: AgoraVideoNode) {
    this.signalr.sendMediaOpera(item.userDetail.userId, ReceiveStausEnum.VideoSelfOpera, () => {
      //   item.playVideo();
    });
  }
  playAudio(item: AgoraVideoNode) {
    this.signalr.sendMediaOpera(item.userDetail.userId, ReceiveStausEnum.AudioSelfOpera, () => {
      //    item.playAudio();
    });
  }
  ngOnInit() {
    setTimeout(() => {
      if (!this.localVideoNode) {
        this.modalService.open(this.modalContext, { backdrop: 'static', centered: true });
      }
    }, 5000);
  }

}
