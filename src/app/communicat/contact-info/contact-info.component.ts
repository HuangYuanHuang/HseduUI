import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.less']
})
export class ContactInfoComponent implements OnInit {
  @Input() userInfo;
  @Output() chatUserEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  sendMessage() {
    this.chatUserEvent.emit(this.userInfo);
  }
}
