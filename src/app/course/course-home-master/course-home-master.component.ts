import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AgoraServiceService, AgoraVideoNode, SubjectVideo, AgoraEnum } from '../../service/agora-service.service';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-course-home-master',
  templateUrl: './course-home-master.component.html',
  styleUrls: ['./course-home-master.component.css']
})
export class CourseHomeMasterComponent implements OnInit {
  @ViewChild('content') modalContext: ElementRef;

  courseId;
  public localVideoNode: AgoraVideoNode;
  userId;
  userName;
  courseName;
  isTeacher = true;
  constructor(private agora: AgoraServiceService,
    private runConfig: RuntimeConfigService, private modalService: NgbModal) {
    this.courseId = runConfig.courseId;
    this.userId = runConfig.userId;
    this.userName = runConfig.userName;
    this.courseName = runConfig.courseName;
    runConfig.isTeacher = true;
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
  ngOnInit() {
    // setTimeout(() => {
    //   if (!this.localVideoNode) {
    //     this.modalService.open(this.modalContext, { backdrop: 'static', centered: true });
    //   }
    // }, 5000);
  }

}
