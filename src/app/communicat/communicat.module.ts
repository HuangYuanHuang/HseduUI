import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatPeerComponent } from './chat-peer/chat-peer.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { SystemNoticeComponent } from './system-notice/system-notice.component';
import { ChatMediaComponent } from './chat-media/chat-media.component';
import { SearchComponent } from './search/search.component';
import { OnlinePipe } from '../pipe/online.pipe';
import { ChatMessageComponent } from './chat-message/chat-message.component';

const appRoutes: Routes = [
  {
    path: 'main', component: MainComponent, children: [
      { path: '', component: MainComponent },
      { path: 'search', component: SearchComponent }
    ]
  },
];
@NgModule({
  imports: [
    CommonModule, TranslateModule, FormsModule, NgbModule, HttpClientModule,
    RouterModule.forChild(
      appRoutes
    ),
  ],
  declarations: [
    OnlinePipe,
    MainComponent,
    ChatListComponent,
    ChatPeerComponent,
    ContactListComponent,
    ContactInfoComponent,
    SystemNoticeComponent,
    SearchComponent,
    ChatMediaComponent,
    ChatMessageComponent
  ]
})
export class CommunicatModule { }
