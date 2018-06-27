import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserContactService } from '../../service/user-contact-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  currentInfo;
  chatInfo = {};
  currentMessage;
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
        this.chatInfo = model;
        $('#pills-chat-tab').trigger('click');
      });
    }
    const tabName = this.activeRouter.snapshot.queryParams['tabs'];
    if (tabName) {
      $(`#pills-${tabName}-tab`).trigger('click');
    }

  }
  userInfo(node: any) {
    this.currentInfo = node;
  }
  chatUserEvent(node: any) {
    this.chatInfo = node;
    $('#pills-chat-tab').trigger('click');
  }
  removeChatEvent(node: any) {
    node.bio = '[remove]';
    this.chatInfo = node;
  }
  currentMessageEvent(message: any) {
    this.currentMessage = message;
  }
}
