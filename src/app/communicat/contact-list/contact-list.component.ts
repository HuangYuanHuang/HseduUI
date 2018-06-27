import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserContactService } from '../../service/user-contact-service';
import { SignalrOnlineChatService } from '../../service/signalr-online-chat-service';

import { OnlinePipe } from '../../pipe/online.pipe';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.less'],
  providers: [OnlinePipe]

})
export class ContactListComponent implements OnInit {
  @Output('userInfoEvent') userInfoEvent: EventEmitter<any>;
  online = true;
  userNodes = [];
  isFirstLoad = true;
  constructor(private userContact: UserContactService, private onlineService: SignalrOnlineChatService) {
    this.userInfoEvent = new EventEmitter<any>();
    this.userContact.obUserNodes.subscribe(nodes => {
      this.userNodes = nodes;
      if (this.isFirstLoad && this.userNodes.length > 0) {
        this.isFirstLoad = false;
        if (this.userInfoEvent) {
          this.userInfoEvent.emit(this.userNodes[0]);
          this.userNodes[0].active = 'table-active';
        }

      }
    });
  }

  ngOnInit() {
    this.onlineService.obOnlineNodes.subscribe(node => {
      const user = this.userContact.getUserInfoFromCache(node.userId);
      console.log('contact-list' + user);
      if (user) {
        const res = this.userNodes.filter(d => d.userId === user.userId);
        if (res && res.length > 0) {
          res[0].isOnline = node.isOnline;
        }
        this.online = !this.online;
        user.isOnline = node.isOnline;
      }
    });
  }
  setUser(item) {
    this.userNodes.forEach(d => d.active = '');
    item.active = 'table-active';
    this.userInfoEvent.emit(item);
  }

}


