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
  @Input() mediaModel;
  private localVideoNode: AgoraVideoNode;
  private remoteVideoNode: AgoraVideoNode;
  @Output() sendMessage = new EventEmitter<any>();
  isLoad = false;
  chatStatus = ChatStautsEnum.Invitation;
  mediaMessage = { channel: '', video: false, audio: false };
  constructor(private agora: AgoraServiceService,
    private onlineChatService: SignalrOnlineChatService,
    private runConfig: RuntimeConfigService) {
    this.initAgora();
    this.initGetChatMessage();
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
          this.mediaMessage = { channel: model.message, audio: true, video: false };
          $('#chat-main').width($('.chat-peer').width() * 0.7);
          $('#media-main').width($('.chat-peer').width() * 0.3);
          $('#media-main').show();
          break;
        case MessageTypeEnum.Video:
          this.chatStatus = ChatStautsEnum.Confirm;
          this.mediaMessage = { channel: model.message, audio: true, video: true };
          $('#chat-main').width($('.chat-peer').width() * 0.7);
          $('#media-main').width($('.chat-peer').width() * 0.3);
          $('#media-main').show();
          break;
        case MessageTypeEnum.Accept:
          this.chatStatus = ChatStautsEnum.Accept;
          this.localVideoNode.play();
          break;
        case MessageTypeEnum.Refuse:
          this.closeStream();
          break;
        case MessageTypeEnum.Exit:
          this.closeStream();
          break;
      }
    });
  }
  ngOnInit() {
    this.isLoad = true;
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
      }
    });
  }
  join() {
    this.sendMessage.emit({
      channel: 'Accept',
      type: MessageTypeEnum.Accept,
      callBack: () => {
        this.chatStatus = ChatStautsEnum.Accept;
        this.agora.agoraInit(this.runConfig.userId, this.mediaMessage.channel, this.mediaMessage.audio, this.mediaMessage.video, false, true);
        $('.opera-btn').hide();
      }
    });

  }
  linkInfo(type: string) {
    const timeSpan = new Date().getHours() + new Date().getMilliseconds() + new Date().getSeconds();
    const channel = `Peer_${this.runConfig.userId}-Peer_${this.mediaModel.user.userId}-${timeSpan}`;
    if (type === 'audio') {
      this.chatStatus = ChatStautsEnum.Invitation;
      this.sendMessage.emit({
        channel: channel,
        type: MessageTypeEnum.Audio,
        callBack: () => {
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
          this.agora.agoraInit(this.runConfig.userId, channel, true, true, false, true);
          $('.opera-btn').hide();
        }
      });
    }
  }
  closeStream() {
    if (this.localVideoNode) {
      this.sendMessage.emit({
        channel: 'Close', type: MessageTypeEnum.Close, callBack: () => {
          this.localVideoNode.stop();
        }
      });

    }
    $('#chat-main').width($('.chat-peer').width());
    $('#media-main').width($('.chat-peer').width() * 0.3);
    $('#media-main').hide();
    $('.opera-btn').show();
  }

  closeInfo(opera: string) {
    if (opera === 'refuse') {
      this.sendMessage.emit({
        channel: 'Refuse',
        type: MessageTypeEnum.Refuse,
        callBack: () => {
          $('#chat-main').removeAttr('style');
          this.closeStream();
        }
      });

    } else if (opera === 'exit') {
      this.sendMessage.emit({
        channel: 'Exit',
        type: MessageTypeEnum.Exit,
        callBack: () => {
          $('#chat-main').removeAttr('style');
          this.closeStream();
        }
      });
    }

  }
}
