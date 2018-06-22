import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.less']
})
export class ChatListComponent implements OnInit, OnChanges {
  chatNodes = [];
  @Input() userInfo;
  @Input() currentMessage;
  @Output() openChatEvent = new EventEmitter<any>();
  @Output() removeChatEvent = new EventEmitter<any>();
  isngOnInit = false;
  constructor() { }
  ngOnChanges(changes: SimpleChanges) {
    if (this.isngOnInit) {

      if (changes['userInfo']) {
        const info = changes['userInfo'].currentValue;
        const res = this.chatNodes.filter(d => d.userDetail.userId === info.userId);
        if (res && res.length > 0) {
          res[0].time = new Date();
          this.chatNodes.forEach(d => d.active = '');
          res[0].active = 'table-active';
        } else {
          this.chatNodes.forEach(d => d.active = '');
          const newInfo = new ChatModel(info, new Date());
          newInfo.active = 'table-active';
          this.chatNodes.push(newInfo);
        }
        console.log('chat-list:');
        console.log(info);
        this.openChatEvent.emit(info);
      }
      if (changes['currentMessage']) {
        const newMessage = changes['currentMessage'].currentValue;
        const res = this.chatNodes.filter(d => d.userDetail.userId === newMessage.userId || d.userDetail.userId === newMessage.toUserId);
        if (res && res.length > 0) {
          res[0].text = newMessage.text;
          res[0].time = newMessage.creationTime;
        }
      }
    }

  }
  ngOnInit() {
    this.isngOnInit = true;
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
    this.openChatEvent.emit(item.userDetail);
  }
  removeUser(item: any, index: number) {
    this.openChatEvent.emit(item.userDetail);
    this.chatNodes.splice(index, 1);
    if (this.chatNodes.length <= 0) {
      this.openChatEvent.emit(null);
    } else {
      this.chatUser(this.chatNodes[index]);
    }
  }
}

class ChatModel {
  public text: string;
  public active = '';
  constructor(public userDetail: any, public time: Date) {

  }
}
