import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { SignalrOnlineChatService, OnlineMessageNode, MessageTypeEnum } from '../../service/signalr-online-chat-service';
import { HttpClient } from '@angular/common/http';
import { CourseConfig } from '../../../shard/CourseConfig';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat-peer',
  templateUrl: './chat-peer.component.html',
  styleUrls: ['./chat-peer.component.less']
})
export class ChatPeerComponent implements OnInit, OnChanges {
  private readonly createPath = '/api/services/app/UserMessageService/Create';
  @Input() userInfo;
  @Output() currentMessageEvent = new EventEmitter<any>();
  isFirstLoad = false;
  userMessageMap = new Map<number, MessageModel>();
  currentChatModel = { user: null, nodes: [], text: '' };
  mediaModel = { user: null, type: '' };
  constructor(private runConfig: RuntimeConfigService,
    private onlineChatService: SignalrOnlineChatService,
    private http: HttpClient, private modalService: NgbModal) {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (!this.isFirstLoad) {
      return;
    }
    const current = changes['userInfo'].currentValue;
    console.log(current);
    if (current && current === '[remove]') {
      this.userMessageMap.delete(current.data.userId);
    } else if (current) {
      this.currentChatModel.user = current;
      if (!this.userMessageMap.has(current.userId)) {
        this.userMessageMap.set(current.userId, new MessageModel(null, false, []));
      }
      console.log(this.userMessageMap.get(current.userId));
      this.loadMessage(current, this.userMessageMap.get(current.userId));
    } else {
      this.currentChatModel = { user: null, nodes: [], text: '' };
    }
  }

  loadMessage(item: any, model: MessageModel) {
    if (model.isLoad) {
      this.currentChatModel.nodes = model.nodes;
      return;
    }
    const getPath = '/api/services/app/UserMessageService/GetMessages';
    let url = `${CourseConfig.CourseRootUrl}${getPath}?CourseId=Peer-Peer`;
    url += `&UserId=${this.runConfig.userId}&ToUserId=${item.userId}`;
    this.http.get<any>(url).subscribe(d => {
      if (d.success) {
        this.currentChatModel.nodes = [];
        d.result.items.forEach(node => {
          this.currentChatModel.nodes.push(new ChatNode(node.message, node.fromUserId,
            node.toUserId, node.messageType, node.creationTime));
        });
        if (this.currentChatModel.nodes.length > 0) {
          model.lastChatNode = this.currentChatModel.nodes[this.currentChatModel.nodes.length - 1];
          this.currentMessageEvent.emit(model.lastChatNode);
          model.isLoad = true;
          model.nodes = this.currentChatModel.nodes;
        }

        setTimeout(() => {
          $('#m-message').scrollTop(50000);
        }, 100);
      }
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
    if (type !== MessageTypeEnum.Text) {
      chat.text = 'Media Call';
    }
    this.currentChatModel.nodes.push(chat);

    // this.userMessageMap.get(this.currentChatModel.user.userId).nodes.push(chat);
    this.currentMessageEvent.emit(chat);
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
    this.isFirstLoad = true;
  }
  initGetChatMessage() {
    this.onlineChatService.obMessageNodes.subscribe(node => {
      const model = node as OnlineMessageNode;

      switch (model.messageType) {
        case MessageTypeEnum.Audio:
          this.currentMessageEvent.emit(new ChatNode('Audio invitations', model.fromUserId, model.toUserId,
            model.messageType, model.creationTime));
          break;
        case MessageTypeEnum.Video:
          this.currentMessageEvent.emit(new ChatNode('Video invitations', model.fromUserId, model.toUserId,
            model.messageType, model.creationTime));
          break;
        case MessageTypeEnum.Text:
          const chat = new ChatNode(model.message, model.fromUserId, model.toUserId,
            model.messageType, model.creationTime);
          if (!this.userMessageMap.has(node.fromUserId)) {
            this.userMessageMap.set(node.fromUserId, new MessageModel(null, false, []));
          }
          const userMap = this.userMessageMap.get(node.fromUserId);
          userMap.lastChatNode = chat;
          //  userMap.nodes.push(chat);
          this.currentMessageEvent.emit(chat);
          this.currentChatModel.nodes.push(chat);
          setTimeout(() => {
            $('#m-message').scrollTop(50000);
          }, 100);
          break;
      }
    });
  }
  linkInfo(type: string) {
    this.mediaModel = { user: this.currentChatModel.user, type: type };
    $('#chat-main').width($('.chat-peer').width() * 0.7);
    $('#media-main').width($('.chat-peer').width() * 0.3);
    $('#media-main').show();
  }
  sendMediaMessage(model: any) {
    this.postMesssage(model.channel, model.type, model.callBack);
  }
}

class MessageModel {
  constructor(public lastChatNode: ChatNode, public isLoad: boolean,
    public nodes: ChatNode[]) {

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

