import { Component, OnInit } from '@angular/core';
import { UserContactService, EventType, UserModel, EventModel } from '../../service/user-contact-service';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { CourseConfig } from '../../../shard/CourseConfig';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.less']
})
export class ChatMessageComponent implements OnInit {
  userNodes = [];
  messageNodes = [];
  pageSize = 20;
  currentPage = 1;
  total = 0;
  currentUserId = 0;
  constructor(private userContact: UserContactService,
    private runConfig: RuntimeConfigService,
    private httpClient: HttpClient) {
    this.userContact.obUserNodes.subscribe(nodes => {
      this.userNodes = [];
      nodes.forEach(d => this.userNodes.push(new UserModel(d.userId, d.userName, d.bio, d.imageUrlMedium,
        d.imageUrlFull, d.country, d.isOnline)));
      this.setUser(this.userNodes[0]);
    });
    this.userContact.obEventNodes.subscribe(node => {
      const model = node as EventModel;
      if (model.type === EventType.MessageHis) {
        const res = this.userNodes.filter(d => d.userId === model.data.userId);
        if (res && res.length > 0) {
          this.setUser(res[0]);
          $('#pills-message-tab').trigger('click');
        }
      }
    });
  }

  ngOnInit() {
  }
  pageChange(page: any) {
    this.loadMessage(this.currentUserId, page);
  }
  setUser(item) {
    this.userNodes.forEach(d => d.active = '');
    item.active = 'table-active';
    this.currentUserId = item.userId;
    this.loadMessage(item.userId, 1);
  }
  loadMessage(toUserId: number, pageIndex: number) {

    const userMessagePath = '/api/services/app/UserMessageService/GetMessagesPage';
    const skipCount = (pageIndex - 1) * this.pageSize;
    const parm = `?SkipCount=${skipCount}&MaxResultCount=${this.pageSize}&CourseId=Peer-Peer&UserId=${this.runConfig.userId}&ToUserId=${toUserId}`;
    const url = `${CourseConfig.CourseRootUrl}${userMessagePath}${parm}`;

    const userInfo = this.userContact.getUserInfoFromCache(this.runConfig.userId);
    const toUserInfo = this.userContact.getUserInfoFromCache(toUserId);
    this.httpClient.get<any>(url).subscribe(data => {
      if (data.success) {
        this.total = data.result.totalCount;
        this.messageNodes = [];
        data.result.items.forEach(d => {
          const info = d.fromUserId === this.runConfig.userId ? toUserInfo : userInfo;
          const color = d.fromUserId === this.runConfig.userId ? 'user-pre' : 'user-self';
          this.messageNodes.push(new MessageNode(info, d.message, d.creationTime, color));
        });
      }
    });
  }
}

class MessageNode {
  constructor(public userInfo: UserModel, public text: string, public time: Date, public color: string) {

  }
}
