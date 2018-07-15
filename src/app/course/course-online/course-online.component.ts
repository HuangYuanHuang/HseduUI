import { Component, OnInit } from '@angular/core';
import { SignalrChatService, RealModel, ReceiveStausEnum } from '../../service/signalr-chat-service';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { HttpClient } from '@angular/common/http';
import { CourseConfig } from '../../../shard/CourseConfig';
import { FilterPipe } from '../../pipe/filter.pipe';
import { UserContactService } from '../../service/user-contact-service';

@Component({
  selector: 'app-course-online',
  templateUrl: './course-online.component.html',
  styleUrls: ['./course-online.component.less'],
  providers: [FilterPipe]
})
export class CourseOnlineComponent implements OnInit {
  onlineNodes = [];
  formSearch;
  userApplyNodes = [];
  userRequestNodes = [];
  constructor(private signalr: SignalrChatService,
    private runConfig: RuntimeConfigService,
    private httpClient: HttpClient,
    private userContact: UserContactService) {
    this.signalr.obRealNodes.subscribe(node => {
      const subject = node as RealModel;
      if (subject.type === ReceiveStausEnum.OnlineNum) {
        this.onlineNodes = [];
        subject.data.forEach(d => {
          const userDetail = new UserDetailModel(d.userId, d.userName, d.teacher, runConfig.userId);
          this.onlineNodes.push(userDetail);

          const resUserApply = this.userApplyNodes.filter(item => item.fromUserId === this.runConfig.userId && item.toUserId === userDetail.userId);
          if (resUserApply && resUserApply.length > 0) {
            userDetail.status = resUserApply[0].status;
          }
          const resUserRequest = this.userRequestNodes.filter(item => item.fromUserId === userDetail.userId &&
            item.toUserId === this.runConfig.userId);
          if (resUserRequest && resUserRequest.length > 0) {
            userDetail.status = resUserRequest[0].status;
          }
        });
        console.log('online num');
        $('#onlineNum').text(subject.data.length);
      }

    });

  }

  ngOnInit() {
    const url = `${CourseConfig.CourseRootUrl}/api/services/app/UserApplyService/GetUserApplys?userId=${this.runConfig.userId}&status=-1`;
    this.loadApplys(url, (nodes) => {
      this.userRequestNodes = nodes;
    }, true);
    const requestUrl = `${CourseConfig.CourseRootUrl}/api/services/app/UserApplyService/GetFromUserApplys?userId=${this.runConfig.userId}&status=-1`;
    this.loadApplys(requestUrl, (nodes) => {
      this.userApplyNodes = nodes;
    });
  }
  chat(item: UserDetailModel) {
    top.postMessage(item, CourseConfig.LMSURL);
    console.log(item);

  }
  loadApplys(url: string, callBack, isloadFromDetail = false) {

    this.httpClient.get<any>(url).subscribe(data => {
      if (data.success) {
        const nodes = [];
        data.result.items.forEach(d => {
          const node = new UserApply(d.fromUserId, d.toUserId, d.creationTime, d.status, d.id);
          const userId = isloadFromDetail ? d.fromUserId : d.toUserId;
          node.userDetail = this.userContact.getUserInfoFromCache(userId);
          if (node.userDetail == null) {
            this.userContact.getUserInfoFromHttp(userId, (model) => node.userDetail = model);
          }
          nodes.push(node);
        });
        callBack(nodes);
      }
    });
  }
  addFriend(item: UserDetailModel) {
    console.log(this.runConfig);
    const url = `${CourseConfig.CourseRootUrl}/api/services/app/UserApplyService/Create`;
    this.httpClient.post<any>(url, {
      fromUserId: this.runConfig.userId,
      toUserId: item.userId,
      bio: '',
      source: 'User Online List'
    }).subscribe(data => {
      if (data.success) {
        item.status = 0;
      }
    });
  }
}

class UserDetailModel {
  public status = -1;
  constructor(public userId: number, public userName: string, public teacher: boolean,
    public myUserId: number) {
    if (userId === myUserId) {
      this.status = 9;
    }
  }
}
class UserApply {
  public userDetail: any;
  constructor(public fromUserId: number, public toUserId: number,
    public time: Date, public status: number, public id: string) {

  }
}


