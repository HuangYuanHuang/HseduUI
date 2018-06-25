import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CourseConfig } from '../../../shard/CourseConfig';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../service/signalr-online-chat-service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  currentInfo;
  chatInfo;
  currentMessage;
  constructor(private modalService: NgbModal, private router: Router,
    private activeRouter: ActivatedRoute, private httpClient: HttpClient) {


  }

  ngOnInit() {

    const userId = this.activeRouter.snapshot.queryParams['toUserId'];
    if (userId) {
      this.getUserInfo(userId);
      $('#pills-chat-tab').trigger('click');
    }
    const tabName = this.activeRouter.snapshot.queryParams['tabs'];
    if (tabName) {
      $(`#pills-${tabName}-tab`).trigger('click');
    }

  }
  getUserInfo(userId: number) {
    const url = `${CourseConfig.CourseRootUrl}/api/services/app/AuthEdxUserService/GetUserById?userId=${userId}`;
    this.httpClient.get<any>(url).subscribe(data => {
      if (data.success) {
        this.chatInfo = new UserModel(data.result.userIndex, data.result.userName, data.result.bio,
          data.result.imageUrlMedium, data.result.imageUrlFull, data.result.country);

      }
    });
  }
  open(content: any) {
    this.router.navigate(['main/search']);
    this.modalService.open(content, { backdrop: 'static', size: 'lg' });
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
