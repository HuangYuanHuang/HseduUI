import { Component, OnInit, Input } from '@angular/core';
import { SignalrChatService, RealModel, MessageNode, ReceiveStausEnum } from '../../service/signalr-chat-service';
import { Subject } from 'rxjs/Subject';
import { RuntimeConfigService } from '../../service/runtime-config-service';
@Component({
  selector: 'app-course-chat',
  templateUrl: './course-chat.component.html',
  styleUrls: ['./course-chat.component.css']
})
export class CourseChatComponent implements OnInit {
  messageContext;
  messageNodes = [];
  constructor(private signalr: SignalrChatService, private runtime: RuntimeConfigService) {
    this.signalr.obRealNodes.subscribe(node => {
      const subject = node as RealModel;
      if (subject.type === ReceiveStausEnum.Message) {
        subject.data.forEach(item => {
          this.messageNodes.push(item);
          setTimeout(() => {
            $('.course-chat').scrollTop(50000);
          }, 100);
        });

      }

    });
  }
  sendMessage() {
    if (this.messageContext.length <= 1) {
      return;
    }
    this.signalr.sendMessage(this.messageContext, () => {
      this.messageContext = '';
      setTimeout(() => {
        $('.course-chat').scrollTop(50000);
      }, 100);
    });
  }

  ngOnInit() {
  }

}
