import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseConfig } from '../../../shard/CourseConfig';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { UserContactService } from '../../service/user-contact-service';

@Component({
  selector: 'app-system-notice',
  templateUrl: './system-notice.component.html',
  styleUrls: ['./system-notice.component.less']
})
export class SystemNoticeComponent implements OnInit {

  userApplyNodes = [];
  userRequestNodes = [];
  constructor(private httpClient: HttpClient, private runConfig: RuntimeConfigService,
    private userContact: UserContactService) {

  }

  ngOnInit() {
    const url = `${CourseConfig.CourseRootUrl}/api/services/app/UserApplyService/GetUserApplys?userId=${this.runConfig.userId}&status=-1`;
    this.loadApplys(url, (nodes) => this.userRequestNodes = nodes, true);
    const requestUrl = `${CourseConfig.CourseRootUrl}/api/services/app/UserApplyService/GetFromUserApplys?userId=${this.runConfig.userId}&status=-1`;
    this.loadApplys(requestUrl, (nodes) => this.userApplyNodes = nodes);
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
        console.log(nodes);
      }
    });
  }

  changeApply(item: UserApply, status: number) {
    const url = `${CourseConfig.CourseRootUrl}/api/services/app/UserApplyService/ChangeApply`;
    this.httpClient.post<any>(url, {
      id: item.id,
      status: status
    }).subscribe(data => {
      if (data.success) {
        item.status = status;
      }
    });
  }
}

class UserApply {
  public userDetail: any;
  constructor(public fromUserId: number, public toUserId: number,
    public time: Date, public status: number, public id: string) {

  }
}
