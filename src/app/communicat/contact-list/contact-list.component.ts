import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseConfig } from '../../../shard/CourseConfig';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { UserModel } from '../../service/signalr-online-chat-service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.less']
})
export class ContactListComponent implements OnInit {
  @Output('userInfoEvent') userInfoEvent: EventEmitter<any>;

  userNodes = [];
  constructor(private httpClient: HttpClient, private runConfig: RuntimeConfigService) {
    this.userInfoEvent = new EventEmitter<any>();
  }

  ngOnInit() {
    const url = `${CourseConfig.CourseRootUrl}/api/services/app/UserRelationService/GetUserRelations?userId=${this.runConfig.userId}`;
    this.httpClient.get<any>(url).subscribe(data => {
      if (data.success) {
        data.result.items.forEach(item => {
          this.userNodes.push(new UserModel(item.userIndex, item.userName, item.bio, item.imageUrlMedium, item.imageUrlFull, item.country));
        });
        if (this.userNodes.length > 0) {
          if (this.userInfoEvent) {
            this.userInfoEvent.emit(this.userNodes[0]);
            this.userNodes[0].active = 'table-active';
          }

        }
      }
    });
  }
  setUser(item) {
    this.userNodes.forEach(d => d.active = '');
    item.active = 'table-active';
    this.userInfoEvent.emit(item);
  }

}


