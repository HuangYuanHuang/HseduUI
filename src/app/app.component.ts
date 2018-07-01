import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RuntimeConfigService } from './service/runtime-config-service';
import { SignalrPointService } from './service/signalr-point-service';
import { SignalrNoticeService } from './service/signalr-notice-service';
import { UserContactService } from './service/user-contact-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(public translateService: TranslateService,
    runtime: RuntimeConfigService,
    signalrPoint: SignalrPointService,
    noticeService: SignalrNoticeService,
    private userContact: UserContactService) {
  }


}
