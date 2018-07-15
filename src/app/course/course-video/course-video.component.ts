import { Component, OnInit, Input } from '@angular/core';
import { AgoraServiceService, SubjectVideo, AgoraEnum, AgoraVideoNode } from '../../service/agora-service.service';
import { UserContactService } from '../../service/user-contact-service';
import { SignalrChatService, RealModel, ReceiveStausEnum } from '../../service/signalr-chat-service';
import { RuntimeConfigService } from '../../service/runtime-config-service';

@Component({
  selector: 'app-course-video',
  templateUrl: './course-video.component.html',
  styleUrls: ['./course-video.component.css']
})
export class CourseVideoComponent implements OnInit {
  @Input() videoOpera = false;
  public videoNodes = [];
  constructor(private agoraService: AgoraServiceService,
    private userContact: UserContactService,
    private signalr: SignalrChatService, private runConfig: RuntimeConfigService) {
    this.agoraService.changeVideOb.subscribe(node => {
      const subject = node as SubjectVideo;
      if (!subject.is_teacher && subject.aogra === AgoraEnum.Connect && !subject.is_peer) {
        this.videoNodes.push(subject.videNode);
        const userInfo = this.userContact.getUserInfoFromCache(subject.videNode.getStreamId());
        if (userInfo === null) {
          this.userContact.getUserInfoFromHttp(subject.videNode.getStreamId(), (d) => {
            subject.videNode.userDetail = d;
          });
        } else {
          subject.videNode.userDetail = userInfo;
        }
        subject.videNode.play();
      } else if (!subject.is_teacher && subject.aogra === AgoraEnum.DisConnect) {
        this.removeNode(subject.videNode.getStreamId());
      }
      console.log(subject);
    });
    this.initVideoRemoteOpera();
  }
  initVideoRemoteOpera() {
    this.signalr.obRealNodes.subscribe(node => {
      const subject = node as RealModel;
      if (subject.type === ReceiveStausEnum.VideoOpera && subject.data === this.runConfig.userId) {
        const res = this.videoNodes.filter(d => d.getStreamId() === this.runConfig.userId);
        if (res && res.length > 0) {
          res[0].playVideo();
        }
      } else if (subject.type === ReceiveStausEnum.AudioOpera && subject.data === this.runConfig.userId) {
        const res = this.videoNodes.filter(d => d.getStreamId() === this.runConfig.userId);
        if (res && res.length > 0) {
          res[0].playAudio();
        }
      }
    });
  }

  playVideo(item: AgoraVideoNode) {
    this.signalr.sendMediaOpera(item.userDetail.userId, ReceiveStausEnum.VideoOpera, () => {
      item.playVideo();
    });
  }
  playAudio(item: AgoraVideoNode) {
    this.signalr.sendMediaOpera(item.userDetail.userId, ReceiveStausEnum.AudioOpera, () => {
      item.playAudio();
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
    if (this.videoOpera) {
      $('#video-person-card').on('mouseover', 'div[class="video-play"]', function () {
        $('.video-opera-popber', this).show();
      });
      $('#video-person-card').on('mouseout', 'div[class="video-play"]', function () {
        $('.video-opera-popber', this).hide();
      });
    }

  }

}
