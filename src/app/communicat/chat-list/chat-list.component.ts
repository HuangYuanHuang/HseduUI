import { Component, OnInit } from '@angular/core';
import { UserContactService, EventModel, EventType } from '../../service/user-contact-service';
import { MessageTypeEnum } from '../../service/signalr-online-chat-service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.less']
})
export class ChatListComponent implements OnInit {
  chatNodes = [];
  constructor(private userContact: UserContactService) {
    this.userContact.obEventNodes.subscribe(data => {
      const model = data as EventModel;
      if (model.type === EventType.ChatInfo || model.type === EventType.ChatVideo || model.type === EventType.ChatAudio) {
        const info = model.data;
        const res = this.chatNodes.filter(d => d.userDetail.userId === info.userId);
        this.chatNodes.forEach(d => d.active = '');
        if (res && res.length > 0) {
          res[0].time = new Date();
          res[0].active = 'table-active';
        } else {
          const newInfo = new ChatModel(info, new Date());
          newInfo.active = 'table-active';
          this.chatNodes.push(newInfo);
        }
        if (model.type === EventType.ChatInfo) {
          this.userContact.sendEvent(EventType.OpenChat, info);
        } else if (model.type === EventType.ChatVideo) {
          this.userContact.sendEvent(EventType.OpenVideo, info);
        } else if (model.type === EventType.ChatAudio) {
          this.userContact.sendEvent(EventType.OpenAudio, info);
        }

      } else if (model.type === EventType.ChatMessage || model.type === EventType.LastMessage) {
        const newMessage = model.data;
        const res = this.chatNodes.filter(d => d.userDetail.userId === newMessage.userId || d.userDetail.userId === newMessage.toUserId);
        if (res && res.length > 0) {
          setTimeout(() => {
            console.log(res[0]);
            if (model.type === EventType.ChatMessage && res[0].active !== 'table-active' && this.chatNodes.length > 1) {
              res[0].num++;
            }
            res[0].text = newMessage.text;
            res[0].time = newMessage.creationTime;
            res[0].type = newMessage.messageType;
          }, 10);

        } else {
          this.getUserInfoById(newMessage.userId, newMessage.text, model.data);
        }
      }
    });
  }

  getUserInfoById(id: any, text: string, data: any) {
    const res = this.chatNodes.filter(d => d.userDetail.userId === id);
    if (res && res.length > 0) {
      res[0].time = new Date();
    } else {
      const userModel = this.userContact.getUserInfoFromCache(id);
      const newInfo = new ChatModel(userModel, new Date());
      this.chatNodes.push(newInfo);
      newInfo.time = new Date();
      if (data.messageType === MessageTypeEnum.Text) {
        newInfo.text = text;

        newInfo.type = EventType.ChatInfo;
      }
      if (this.chatNodes.length > 1) {
        newInfo.num++;
      }
      if (this.chatNodes.length === 1) {
        this.userContact.sendEvent(EventType.OpenChat, newInfo.userDetail);
      }
    }

  }
  ngOnInit() {
    $('#table-chat-list').on('mouseover', 'tbody tr', function () {
      $('.opera-btn button', this).show();
    });
    $('#table-chat-list').on('mouseout', 'tbody tr', function () {
      $('.opera-btn button', this).hide();
    });
  }
  chatUser(item: any) {
    this.chatNodes.forEach(d => d.active = '');
    item.active = 'table-active';
    this.userContact.sendEvent(EventType.OpenChat, item.userDetail);
    item.num = 0;
  }
  removeUser(item: any, index: number) {
    this.userContact.sendEvent(EventType.RemoveUser, item);
    this.chatNodes.splice(index, 1);
    if (this.chatNodes.length > 0) {
      this.chatUser(this.chatNodes[index]);
    }
  }
}

class ChatModel {
  public text: string;
  public type: number;
  public active = '';
  public num = 0;
  constructor(public userDetail: any, public time: Date) {

  }
}
