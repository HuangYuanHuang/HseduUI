import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SignalrChatService, RealModel, ReceiveStausEnum } from '../../service/signalr-chat-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignalrOnlineChatService, OnlineMessageNode, MessageTypeEnum } from '../../service/signalr-online-chat-service';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { HttpClient } from '@angular/common/http';
import { FilterPipe } from '../../pipe/filter.pipe';
import { CourseConfig } from '../../../shard/CourseConfig';
import { AgoraServiceService, SubjectVideo, AgoraVideoNode, AgoraEnum } from '../../service/agora-service.service';
import * as moment from 'moment';
@Component({
  selector: 'app-course-online',
  templateUrl: './course-online.component.html',
  styleUrls: ['./course-online.component.less'],
  providers: [FilterPipe]
})
export class CourseOnlineComponent implements OnInit {
  private readonly createPath = '/api/services/app/UserMessageService/Create';
  private readonly getPath = '/api/services/app/UserMessageService/GetMessages';
  private localVideoNode: AgoraVideoNode;
  private remoteVideoNode: AgoraVideoNode;
  @ViewChild('invitations') modalContext: ElementRef;
  @ViewChild('content') modalChatContext: ElementRef;
  onlineNodes;
  formSearch;
  chatModalIsOpen = false;
  currentChatModel = { user: null, text: '', nodes: [] };
  chatStatus: ChatStautsEnum;
  slider = { display: null, showInfo: false, showAudio: false, showVideo: false };
  mediaMessage = { title: '', type: 1, item: null, modalResult: null, message: null };
  timeInterval = null;
  preTime = null;
  callSecond = '00:00:00';
  constructor(private signalr: SignalrChatService,
    private onlineChatService: SignalrOnlineChatService,
    private runConfig: RuntimeConfigService,
    private http: HttpClient,
    private modalService: NgbModal,
    private agora: AgoraServiceService) {
    this.signalr.obRealNodes.subscribe(node => {
      const subject = node as RealModel;
      if (subject.type === ReceiveStausEnum.OnlineNum) {
        this.onlineNodes = subject.data;
        $('#onlineNum').text(subject.data.length);
      }

    });
    this.initGetChatMessage();
    this.initAgora();
  }
  initAgora() {
    this.agora.changeVideOb.subscribe(node => {
      const subject = node as SubjectVideo;
      if (subject.is_local && subject.is_peer) {
        this.localVideoNode = this.agora.localVideo;
        subject.videNode.play();
      } else if (!subject.is_local && subject.aogra === AgoraEnum.Connect && subject.is_peer) {
        this.remoteVideoNode = subject.videNode;
        this.remoteVideoNode.play();
        this.setPanel();
      }
    });
  }
  initGetChatMessage() {
    this.onlineChatService.obMessageNodes.subscribe(node => {
      const model = node as OnlineMessageNode;
      switch (model.messageType) {
        case MessageTypeEnum.Refuse:
          this.closeInfo('video', null);
          this.currentChatModel.nodes.push(new ChatNode('The other party rejected your call', 0,
            this.runConfig.userId, MessageTypeEnum.Refuse, new Date()));
          setTimeout(() => {
            $('#m-message').scrollTop(50000);
          }, 100);
          break;
        case MessageTypeEnum.Exit:
          this.closeInfo('video', null);
          this.currentChatModel.nodes.push(new ChatNode('The other party Exit your call', 0,
            this.runConfig.userId, MessageTypeEnum.Exit, new Date()));
          if (this.timeInterval) {
            clearInterval(this.timeInterval);
          }
          setTimeout(() => {
            $('#m-message').scrollTop(50000);
          }, 100);
          break;
        case MessageTypeEnum.Accept:
          this.chatStatus = ChatStautsEnum.Accept;
          this.preTime = moment('2013-01-01T00:00:00.000');
          this.callSecond = '00:00:00';
          this.timeInterval = setInterval(() => {
            this.preTime = this.preTime.add(1, 's');
            this.callSecond = this.preTime.format('HH:mm:ss');
          }, 1000);
          setTimeout(() => {
            this.localVideoNode.play();

          }, 1000);
          break;
        case MessageTypeEnum.Audio:
          this.openMediaModal(model);
          break;
        case MessageTypeEnum.Video:
          this.openMediaModal(model);
          break;
        default:
          this.currentChatModel.nodes.push(new ChatNode(model.message, model.fromUserId, model.toUserId,
            model.messageType, model.creationTime));
          setTimeout(() => {
            $('#m-message').scrollTop(50000);
          }, 100);

      }
    });
  }
  openMediaModal(model: OnlineMessageNode) {

    this.mediaMessage.type = model.messageType;
    const result = this.onlineNodes.filter(d => d.userId === model.fromUserId);
    if (result && result.length > 0) {
      this.mediaMessage.title = result[0].userName;
      this.mediaMessage.item = result[0];
      this.mediaMessage.message = model;
      this.chatStatus = ChatStautsEnum.Confirm;
      this.currentChatModel.user = this.mediaMessage.item;
      if (this.chatModalIsOpen) {
        $('#chat-main').width(450);
        this.slider.showAudio = this.mediaMessage.type === MessageTypeEnum.Audio;
        this.slider.showVideo = this.mediaMessage.type === MessageTypeEnum.Video;
        this.slider.showInfo = false;
        this.slider.display = true;
        return;
      }
      this.mediaMessage.modalResult = this.modalService.open(this.modalContext, { centered: true, backdrop: 'static' });
    }

  }
  accept() {
    this.chat(this.mediaMessage.item, this.modalChatContext);
    this.chatStatus = ChatStautsEnum.Accept;
    this.slider.showAudio = this.mediaMessage.type === MessageTypeEnum.Audio;
    this.slider.showVideo = this.mediaMessage.type === MessageTypeEnum.Video;
    this.slider.showInfo = false;
    this.slider.display = true;
    this.join(this.slider.showVideo ? true : this.slider.showAudio, this.slider.showVideo);
    setTimeout(() => {
      this.mediaMessage.modalResult.close();
      $('#chat-main').width(450);

    }, 100);

  }
  modalRefuse() {
    this.closeInfo('media', 'refuse');
    setTimeout(() => {
      this.mediaMessage.modalResult.close();
    }, 100);
  }
  join(audio: boolean, video: boolean) {
    this.postMesssage('Accept', MessageTypeEnum.Accept, () => {
      console.log(this.mediaMessage.message);
      this.chatStatus = ChatStautsEnum.Accept;
      this.preTime = moment('2013-01-01T00:00:00.000');
      this.callSecond = '00:00:00';
      this.timeInterval = setInterval(() => {
        this.preTime = this.preTime.add(1, 's');
        this.callSecond = this.preTime.format('HH:mm:ss');
      }, 1000);
      this.agora.agoraInit(this.runConfig.userId, this.mediaMessage.message.message, audio, video, false, true);
    });
  }
  chat(item: any, content: any) {
    this.currentChatModel.user = item;
    this.modalService.open(content, { size: 'lg', backdrop: 'static' }).result.then((d) => {
      this.chatModalIsOpen = false;
      if (this.slider.showVideo) {
        this.closeInfo('video', 'exit');
      }
    }, (reason) => {
      console.log(reason);
      this.chatModalIsOpen = false;
      if (this.slider.showVideo) {
        this.closeInfo('video', 'exit');
      }
    });
    this.chatModalIsOpen = true;
    $('.modal-content').width(900);
    let url = `${CourseConfig.CourseRootUrl}${this.getPath}?CourseId=${encodeURIComponent(this.runConfig.courseId)}`;
    url += `&UserId=${this.runConfig.userId}&ToUserId=${item.userId}`;
    this.http.get<any>(url).subscribe(d => {
      if (d.success) {
        this.currentChatModel.nodes = [];
        d.result.items.forEach(node => {
          this.currentChatModel.nodes.push(new ChatNode(node.message, node.fromUserId,
            node.toUserId, node.messageType, node.creationTime));
        });
        setTimeout(() => {
          $('#m-message').scrollTop(50000);
        }, 100);
      }
    });
    console.log(item);
  }
  linkInfo(type: string) {
    this.slider.showAudio = false;
    this.slider.showVideo = false;
    this.slider.showInfo = false;
    this.slider.display = true;
    const timeSpan = new Date().getHours() + new Date().getMilliseconds() + new Date().getSeconds();
    const channel = `Peer_${this.runConfig.userId}-Peer_${this.currentChatModel.user.userId}-${timeSpan}`;
    const result = this.onlineNodes.filter(d => d.userId === this.currentChatModel.user.userId);
    if (result && result.length > 0) {
      this.mediaMessage.title = result[0].userName;
    }
    if (type === 'info') {
      this.slider.showInfo = true;
    } else if (type === 'audio') {
      this.slider.showAudio = true;
      this.chatStatus = ChatStautsEnum.Invitation;
      this.postMesssage(channel, MessageTypeEnum.Audio, () => {
        this.agora.agoraInit(this.runConfig.userId, channel, true, false, false, true);
      });
    } else {
      this.slider.showVideo = true;
      this.chatStatus = ChatStautsEnum.Invitation;
      this.postMesssage(channel, MessageTypeEnum.Video, () => {
        this.agora.agoraInit(this.runConfig.userId, channel, true, true, false, true);
      });
    }
    $('#chat-main').width(450);
  }
  closeInfo(type: string, opera: string) {
    if (opera === 'refuse') {
      this.postMesssage('Refuse', MessageTypeEnum.Refuse, () => {
        this.slider.display = null;
        this.slider.showAudio = false;
        this.slider.showVideo = false;
        $('#chat-main').removeAttr('style');
      });
    } else if (opera === 'exit') {
      this.postMesssage('Exit', MessageTypeEnum.Exit, () => {
        this.slider.display = null;
        this.slider.showAudio = false;
        this.slider.showVideo = false;
        $('#chat-main').removeAttr('style');
        if (this.timeInterval) {
          clearInterval(this.timeInterval);
        }
        if (this.localVideoNode) {
          this.localVideoNode.stop();
        }
      });
    } else {
      this.slider.display = null;
      this.slider.showAudio = false;
      this.slider.showVideo = false;
      $('#chat-main').removeAttr('style');
      if (this.localVideoNode) {
        this.localVideoNode.stop();
      }
    }

  }
  postMesssage(message: string, messageType: number, callBack) {
    this.http.post(`${CourseConfig.CourseRootUrl}${this.createPath}`, {
      fromUserId: this.runConfig.userId,
      toUserId: this.currentChatModel.user.userId,
      message: message,
      courseId: this.runConfig.courseId,
      messageType: messageType
    }).subscribe(d => {
      if (messageType === MessageTypeEnum.Text) {
        this.currentChatModel.nodes.push(new ChatNode(message, this.runConfig.userId,
          this.currentChatModel.user.userId, messageType, new Date()));
        setTimeout(() => {
          $('#m-message').scrollTop(50000);
        }, 100);
      }
      if (callBack) {
        callBack();
      }
    });
  }
  sendMessage() {
    if (this.currentChatModel.text.length <= 1) {
      return;
    }
    this.postMesssage(this.currentChatModel.text.trim(), MessageTypeEnum.Text, () => this.currentChatModel.text = '');

  }
  ngOnInit() {

  }
  setPanel() {
    $('#video-peer').on('mouseover', function () {
      $('#exit-button').show();
    });
    $('#video-peer').on('mouseout', function () {
      $('#exit-button').hide();
    });
  }
}


class ChatNode {
  constructor(public text: string, public userId: number, public toUserId: number,
    public messageType: number, public creationTime: Date) {

  }

  getSelfActive(runConfig: RuntimeConfigService) {
    if (this.toUserId === runConfig.userId) {
      return '';
    }
    return 'self';
  }
}

enum ChatStautsEnum {
  Invitation,
  Confirm,
  Accept,
  Refuse
}
