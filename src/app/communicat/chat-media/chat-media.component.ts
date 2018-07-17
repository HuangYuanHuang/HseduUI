import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgoraServiceService, SubjectVideo, AgoraVideoNode, AgoraEnum } from '../../service/agora-service.service';
import { SignalrOnlineChatService, MessageTypeEnum, ChatStautsEnum, OnlineMessageNode } from '../../service/signalr-online-chat-service';
import { RuntimeConfigService } from '../../service/runtime-config-service';

@Component({
  selector: 'app-chat-media',
  templateUrl: './chat-media.component.html',
  styleUrls: ['./chat-media.component.less']
})
export class ChatMediaComponent implements OnInit, OnChanges {
  private static isInitSubscribe = false;

  @Input() mediaModel;
  private localVideoNode: AgoraVideoNode;
  private remoteVideoNode: AgoraVideoNode;
  @Output() sendMessage = new EventEmitter<any>();
  isLoad = false;
  chatStatus = ChatStautsEnum.Invitation;
  mediaVideo = false;
  mediaMessage = { channel: '', video: false, audio: false };
  constructor(private agora: AgoraServiceService,
    private onlineChatService: SignalrOnlineChatService,
    private runConfig: RuntimeConfigService) {
    this.initAgora();
    if (!ChatMediaComponent.isInitSubscribe) {
      this.initGetChatMessage();
      ChatMediaComponent.isInitSubscribe = true;
    }

  }
  ngOnChanges(changes: SimpleChanges) {
    if (!this.isLoad) {
      return;
    }
    if (changes['mediaModel']) {
      console.log(this.mediaModel);
      this.linkInfo(this.mediaModel.type);
    }
  }
  initGetChatMessage() {
    this.onlineChatService.obMessageNodes.subscribe(node => {
      const model = node as OnlineMessageNode;
      console.log(model);
      switch (model.messageType) {
        case MessageTypeEnum.Audio:
          this.chatStatus = ChatStautsEnum.Confirm;
          this.mediaVideo = false;
          this.mediaMessage = { channel: model.message, audio: true, video: false };
          break;
        case MessageTypeEnum.Video:
          this.chatStatus = ChatStautsEnum.Confirm;
          this.mediaVideo = true;
          this.mediaMessage = { channel: model.message, audio: true, video: true };
          break;
        case MessageTypeEnum.Accept:
          this.chatStatus = ChatStautsEnum.Accept;
          setTimeout(() => {
            const backgroundUrl = `url('${this.mediaModel.user.imageUrlFull}')`;
            $('.media-main').css('background-image', backgroundUrl);
          }, 100);

          this.localVideoNode.play();
          break;
        case MessageTypeEnum.Refuse:
          this.closeStream('Refuse', MessageTypeEnum.Refuse, model);
          break;
        case MessageTypeEnum.Exit:
          if (this.localVideoNode) {
            this.localVideoNode.stop();
          }
          $('#chat-main').width($('.chat-peer').width());
          $('#media-main').width($('.chat-peer').width() * 0.3);
          $('#media-main').hide();
          $('.opera-btn').show();
          break;
      }
    });
  }
  ngOnInit() {
    this.isLoad = true;
    $('.sidebar-right').on('mouseover', 'div[id="media-call"]', function () {
      $('#footer-opera', this).show();
    });
    $('.sidebar-right').on('mouseout', 'div[id="media-call"]', function () {
      $('#footer-opera', this).hide();
    });
  }
  initAgora() {
    this.agora.changeVideOb.subscribe(node => {
      const subject = node as SubjectVideo;
      if (subject.is_local && subject.is_peer) {
        this.localVideoNode = this.agora.localVideo;
        subject.videNode.play();
      } else if (!subject.is_local && subject.aogra === AgoraEnum.Connect && subject.is_peer) {
        this.remoteVideoNode = subject.videNode;
        this.chatStatus = ChatStautsEnum.Accept;
        setTimeout(() => {
          const backgroundUrl = `url('${this.mediaModel.user.imageUrlFull}')`;
          $('.media-main').css('background-image', backgroundUrl);
        }, 100);
        this.remoteVideoNode.play();
      }
    });
  }
  linkInfo(type: string) {
    const timeSpan = new Date().getHours() + new Date().getMilliseconds() + new Date().getSeconds();
    const channel = `Peer_${this.runConfig.userId}-Peer_${this.mediaModel.user.userId}-${timeSpan}`;
    setTimeout(() => {
      const backgroundUrl = `url('${this.mediaModel.user.imageUrlFull}')`;
      $('.media-main').css('background-image', backgroundUrl);
    }, 100);
    if (type === 'audio') {
      this.chatStatus = ChatStautsEnum.Invitation;
      console.log(this.mediaModel.user.imageUrlFull);
      this.sendMessage.emit({
        channel: channel,
        type: MessageTypeEnum.Audio,
        callBack: () => {
          this.mediaVideo = false;
          this.agora.agoraInit(this.runConfig.userId, channel, true, false, false, true);
          $('.opera-btn').hide();
        }
      });
    } else {
      this.chatStatus = ChatStautsEnum.Invitation;
      this.sendMessage.emit({
        channel: channel,
        type: MessageTypeEnum.Video,
        callBack: () => {
          this.mediaVideo = true;
          this.agora.agoraInit(this.runConfig.userId, channel, true, true, false, true);
          $('.opera-btn').hide();
        }
      });
    }
  }
  closeStream(channel: string, type: MessageTypeEnum, data: any) {
    if (this.localVideoNode) {
      this.sendMessage.emit({
        channel: channel, type: type, data: data, callBack: () => {
          this.localVideoNode.stop();
        }
      });
    }
    $('#chat-main').width($('.chat-peer').width());
    $('#media-main').width($('.chat-peer').width() * 0.3);
    $('#media-main').hide();
    $('.opera-btn').show();
  }
}
