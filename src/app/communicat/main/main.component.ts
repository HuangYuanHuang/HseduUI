import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserContactService, EventType } from '../../service/user-contact-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  mySelfInfo;
  constructor(private activeRouter: ActivatedRoute, private userContact: UserContactService) {
    userContact.getUserSelfInfo((d) => this.mySelfInfo = d);
  }

  ngOnInit() {
    addEventListener('message', (node) => {
      if (typeof (node.data) === 'string') {
        console.log(node.data);
        $(`#pills-${node.data}-tab`).trigger('click');
      }
    });
    const userId = this.activeRouter.snapshot.queryParams['toUserId'];
    if (userId) {
      this.userContact.getUserInfoFromHttp(userId, (model) => {
        this.userContact.sendEvent(EventType.ChatInfo, model);
        $('#pills-chat-tab').trigger('click');
      });
    }
    const tabName = this.activeRouter.snapshot.queryParams['tabs'];
    if (tabName) {
      $(`#pills-${tabName}-tab`).trigger('click');
    }

  }

}
