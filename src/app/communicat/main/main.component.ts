import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  currentInfo;
  chatInfo;
  currentMessage;
  constructor(private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
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
    $('#pills-home-tab').trigger('click');
  }
  removeChatEvent(node: any) {
    node.bio = '[remove]';
    this.chatInfo = node;
  }
  currentMessageEvent(message: any) {
    this.currentMessage = message;
  }
}
