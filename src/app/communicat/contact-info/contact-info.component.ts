import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserContactService, EventType, EventModel } from '../../service/user-contact-service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.less']
})
export class ContactInfoComponent implements OnInit {
  userInfo;
  constructor(private userContact: UserContactService) {
    this.userContact.obEventNodes.subscribe(data => {
      const model = data as EventModel;
      if (model.type === EventType.ContactInfo) {
        this.userInfo = model.data;
      }

    });

  }
  ngOnInit() {
  }
  sendMessage() {
    this.userContact.sendEvent(EventType.ChatInfo, this.userInfo);
    $('#pills-chat-tab').trigger('click');
  }
  sendAudio() {
    this.userContact.sendEvent(EventType.ChatAudio, this.userInfo);
    $('#pills-chat-tab').trigger('click');
  }
  sendVideo() {
    this.userContact.sendEvent(EventType.ChatVideo, this.userInfo);
    $('#pills-chat-tab').trigger('click');
  }
}
