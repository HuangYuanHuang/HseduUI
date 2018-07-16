import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { SignalrOnlineChatService, OnlineMessageNode, MessageTypeEnum } from '../../service/signalr-online-chat-service';
import { HttpClient } from '@angular/common/http';
import { CourseConfig } from '../../../shard/CourseConfig';
import { UserContactService, UserModel, EventModel, EventType } from '../../service/user-contact-service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AgoraServiceService, SubjectVideo, AgoraVideoNode, AgoraEnum } from '../../service/agora-service.service';

@Component({
  selector: 'app-chat-peer',
  templateUrl: './chat-peer.component.html',
  styleUrls: ['./chat-peer.component.less']
})
export class ChatPeerComponent implements OnInit {
  private readonly createPath = '/api/services/app/UserMessageService/Create';
  userMessageMap = new Map<number, MessageModel>();
  currentChatModel = { user: null, nodes: [], text: '' };
  mediaModel = { user: null, type: '', channel: '', audio: false, video: false };
  modalResult;
  @ViewChild('content') modalContext: ElementRef;

  constructor(private runConfig: RuntimeConfigService,
    private onlineChatService: SignalrOnlineChatService, private agora: AgoraServiceService,
    private http: HttpClient, private userContact: UserContactService, private modalService: NgbModal) {
    this.userContact.obEventNodes.subscribe(data => {
      const model = data as EventModel;
      if (model.type === EventType.OpenChat || model.type === EventType.OpenVideo || model.type === EventType.OpenAudio) {
        this.currentChatModel.user = model.data;
        if (!this.userMessageMap.has(model.data.userId)) {
          this.userMessageMap.set(model.data.userId, new MessageModel(null, false, []));
        }
        this.loadMessage(model.data, this.userMessageMap.get(model.data.userId));
        if (model.type === EventType.OpenVideo) {
          setTimeout(() => {
            this.linkInfo('video');
          }, 1000);

        } else if (model.type === EventType.OpenAudio) {
          setTimeout(() => {
            this.linkInfo('audio');
          }, 1000);

        }
      } else if (model.type === EventType.RemoveUser) {
        this.userMessageMap.delete(model.data.userDetail.userId);
        if (this.userMessageMap.size === 0) {
          this.currentChatModel = { user: null, nodes: [], text: '' };
        }
      }
    });
  }

  loadMessage(item: any, model: MessageModel) {
    if (model.isLoad) {
      this.currentChatModel.nodes = model.nodes;
      setTimeout(() => {
        $('#m-message').scrollTop(50000);
      }, 100);
      return;
    }
    const getPath = '/api/services/app/UserMessageService/GetMessages';
    let url = `${CourseConfig.CourseRootUrl}${getPath}?CourseId=Peer-Peer`;
    url += `&UserId=${this.runConfig.userId}&ToUserId=${item.userId}`;
    this.http.get<any>(url).subscribe(d => {
      if (d.success) {
        this.currentChatModel.nodes = [];
        d.result.items.forEach(node => {
          const temp = new ChatNode(node.message, node.fromUserId, node.toUserId, node.messageType, node.creationTime);
          temp.msgId = node.id;
          this.currentChatModel.nodes.push(temp);
        });
        if (this.currentChatModel.nodes.length > 0) {
          model.lastChatNode = this.currentChatModel.nodes[this.currentChatModel.nodes.length - 1];
          this.userContact.sendEvent(EventType.ChatMessage, model.lastChatNode);
          model.isLoad = true;
          model.nodes = this.currentChatModel.nodes;
          this.changeMessageReader(model.lastChatNode.msgId);
        }

        setTimeout(() => {
          $('#m-message').scrollTop(50000);
        }, 100);
      }
    });
  }

  changeMessageReader(msgId: number) {
    const url = `${CourseConfig.CourseRootUrl}/api/services/app/UserMessageService/ChangeMessageRead?msgId=${msgId}`;
    this.http.post<any>(url, {
      msgId: msgId
    }).subscribe(d => {

    });
  }
  sendMessage() {
    if (this.currentChatModel.text.trim().length > 0) {
      this.postMesssage(this.currentChatModel.text.trim(), MessageTypeEnum.Text, null);
      this.currentChatModel.text = '';
      setTimeout(() => {
        $('#m-message').scrollTop(50000);
      }, 100);
    }
  }
  postMesssage(message: string, type: MessageTypeEnum, callBack) {
    const chat = new ChatNode(message, this.runConfig.userId, this.currentChatModel.user.userId, type, new Date());
    if (type === MessageTypeEnum.Video) {
      chat.text = 'fas fa-video';
    } else if (type === MessageTypeEnum.Audio) {
      chat.text = 'fas fa-microphone';
    }
    if (chat.messageType === MessageTypeEnum.Text || chat.messageType === MessageTypeEnum.Video || chat.messageType === MessageTypeEnum.Audio) {
      this.currentChatModel.nodes.push(chat);
      this.userContact.sendEvent(EventType.ChatMessage, chat);
    }

    this.http.post<any>(`${CourseConfig.CourseRootUrl}${this.createPath}`, {
      fromUserId: this.runConfig.userId,
      toUserId: this.currentChatModel.user.userId,
      message: message,
      courseId: 'Peer-Peer',
      messageType: type
    }).subscribe(d => {
      if (d.success) {
        if (callBack) {
          callBack();
        }
      }
    });
  }
  ngOnInit() {
    this.initGetChatMessage();
    setTimeout(() => {
      this.GetUnreadMessage();
    }, 1000);

  }

  GetUnreadMessage() {
    const url = `${CourseConfig.CourseRootUrl}/api/services/app/UserMessageService/GetUnreadMessage?toUserId=${this.runConfig.userId}&courseId=Peer-Peer`;
    this.http.get<any>(url).subscribe(d => {
      if (d.success) {
        d.result.items.forEach(item => {
          const userInfo = this.userContact.getUserInfoFromCache(item.userId);
          if (userInfo) {
            this.userContact.sendEvent(EventType.ChatInfo, userInfo);
          }
        });
      }
    });
  }
  initMediaMessage(text: string, model: OnlineMessageNode, type: string) {
    this.userContact.sendEvent(EventType.ChatMessage, new ChatNode(text, model.fromUserId, model.toUserId,
      model.messageType, model.creationTime));
    this.mediaModel.user = this.userContact.getUserInfoFromCache(model.fromUserId);
    this.mediaModel.type = type;
    this.mediaModel.channel = model.message;
    if (this.mediaModel.user === null) {
      this.userContact.getUserInfoFromHttp(model.fromUserId, (d) => {
        this.mediaModel.user = d;
        this.modalResult = this.modalService.open(this.modalContext, { backdrop: 'static', centered: true });
      });
    } else {
      this.modalResult = this.modalService.open(this.modalContext, { backdrop: 'static', centered: true });
    }

  }
  initGetChatMessage() {
    this.onlineChatService.obMessageNodes.subscribe(node => {
      const model = node as OnlineMessageNode;

      switch (model.messageType) {
        case MessageTypeEnum.Audio:
          this.mediaModel.audio = true;
          this.mediaModel.video = false;
          this.initMediaMessage('Audio invitations', model, 'audio');
          break;
        case MessageTypeEnum.Video:
          this.mediaModel.audio = true;
          this.mediaModel.video = true;
          this.initMediaMessage('Video invitations', model, 'video');
          break;
        case MessageTypeEnum.Close:
          if (this.modalResult) {
            this.modalResult.close();
          }

          break;
        case MessageTypeEnum.Text:
          const chat = new ChatNode(model.message, model.fromUserId, model.toUserId,
            model.messageType, model.creationTime);
          if (!this.userMessageMap.has(node.fromUserId)) {
            this.userMessageMap.set(node.fromUserId, new MessageModel(null, false, []));
          }
          const userMap = this.userMessageMap.get(node.fromUserId);
          userMap.lastChatNode = chat;
          this.userContact.sendEvent(EventType.ChatMessage, chat);
          userMap.nodes.push(chat);
          if (model.fromUserId === this.currentChatModel.user.userId) {
            console.log(node);
            this.changeMessageReader(node.msgId);
          }
          setTimeout(() => {
            $('#m-message').scrollTop(50000);
          }, 100);
          break;
      }
    });
  }
  linkInfo(type: string) {
    this.mediaModel = { user: this.currentChatModel.user, type: type, channel: '', video: true, audio: true };
    $('#chat-main').width($('.chat-peer').width() * 0.7);
    $('#media-main').width($('.chat-peer').width() * 0.3);
    $('#media-main').show();
    $('.opera-btn').hide();
  }
  openMessage() {
    this.userContact.sendEvent(EventType.MessageHis, this.currentChatModel.user);
  }
  sendMediaMessage(model: any) {
    this.postMesssage(model.channel, model.type, model.callBack);
  }
  join() {
    this.sendMediaMessage({
      channel: 'Accept',
      type: MessageTypeEnum.Accept,
      callBack: () => {
        this.agora.agoraInit(this.runConfig.userId, this.mediaModel.channel, this.mediaModel.audio, this.mediaModel.video, false, true);

        const chat = new ChatNode('', this.runConfig.userId, this.currentChatModel.user.userId, MessageTypeEnum.Accept, new Date());
        if (this.mediaModel.video) {
          chat.text = 'fas fa-video';
        } else {
          chat.text = 'fas fa-microphone';
        }
        this.currentChatModel.nodes.push(chat);
        this.userContact.sendEvent(EventType.ChatMessage, chat);
        $('.opera-btn').hide();
        this.modalResult.close();
        $('#chat-main').width($('.chat-peer').width() * 0.7);
        $('#media-main').width($('.chat-peer').width() * 0.3);
        $('#media-main').show();
      }
    });
  }
  refuse() {
    this.sendMediaMessage({
      channel: 'Refuse',
      type: MessageTypeEnum.Refuse,
      callBack: () => {
        $('#chat-main').removeAttr('style');
        $('.opera-btn').show();
      }
    });
  }
}

class MessageModel {
  constructor(public lastChatNode: ChatNode, public isLoad: boolean,
    public nodes: ChatNode[]) {

  }
}
class ChatNode {
  public msgId: number;
  constructor(public text: string, public userId: number, public toUserId: number,
    public messageType: number, public creationTime: Date) {

  }

  getSelfActive(runConfig: RuntimeConfigService) {
    if (this.toUserId === runConfig.userId) {
      return '';
    }
    return 'self';
  }
  getUserInfo(userContact: UserContactService): UserModel {
    return userContact.getUserInfoFromCache(this.userId);
  }
}

