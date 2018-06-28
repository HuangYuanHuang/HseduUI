import { Component, OnInit } from '@angular/core';
import { SignalrChatService, RealModel, ReceiveStausEnum } from '../../service/signalr-chat-service';
import { RuntimeConfigService } from '../../service/runtime-config-service';

import { FilterPipe } from '../../pipe/filter.pipe';

@Component({
  selector: 'app-course-online',
  templateUrl: './course-online.component.html',
  styleUrls: ['./course-online.component.less'],
  providers: [FilterPipe]
})
export class CourseOnlineComponent implements OnInit {
  onlineNodes;
  formSearch;

  constructor(private signalr: SignalrChatService, private runConfig: RuntimeConfigService) {
    this.signalr.obRealNodes.subscribe(node => {
      const subject = node as RealModel;
      if (subject.type === ReceiveStausEnum.OnlineNum) {
        this.onlineNodes = subject.data;
        $('#onlineNum').text(subject.data.length);
      }

    });

  }

  ngOnInit() {

  }

}




