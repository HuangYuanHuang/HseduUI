import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseFileComponent } from './course-file/course-file.component';
import { CourseHomeComponent } from './course-home/course-home.component';
import { CourseChatComponent } from './course-chat/course-chat.component';
import { CourseVideoMasterComponent } from './course-video-master/course-video-master.component';
import { CourseVideoComponent } from './course-video/course-video.component';
import { CourseVoteComponent } from './course-vote/course-vote.component';
import { CourseVoteMasterComponent } from './course-vote-master/course-vote-master.component';
import { CourseHomeMasterComponent } from './course-home-master/course-home-master.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CourseBoardComponent } from './course-board/course-board.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AgoraServiceService } from '../service/agora-service.service';
import { SignalrChatService } from '../service/signalr-chat-service';

import { CourseOnlineComponent } from './course-online/course-online.component';
import { CoursePointMasterComponent } from './course-point-master/course-point-master.component';
import { CoursePointComponent } from './course-point/course-point.component';
import { CourseNavigateComponent } from './course-navigate/course-navigate.component';
import { FilterPipe } from '../pipe/filter.pipe';
import { NgxEchartsModule } from 'ngx-echarts';

const appRoutes: Routes = [
  { path: 'course', component: CourseHomeComponent },
  { path: 'navigate', component: CourseNavigateComponent },
  { path: 'course-master', component: CourseHomeMasterComponent }
];
@NgModule({
  imports: [
    CommonModule, NgbModule, TranslateModule, HttpClientModule, FormsModule, NgxEchartsModule,
    RouterModule.forRoot(
      appRoutes
    ),
  ], providers: [
    AgoraServiceService,
    SignalrChatService
  ],
  declarations: [FilterPipe,
    CourseChatComponent,
    CourseFileComponent,
    CourseHomeComponent,
    CourseVideoMasterComponent,
    CourseVideoComponent,
    CourseVoteComponent,
    CourseVoteMasterComponent,
    CourseHomeMasterComponent,
    CourseBoardComponent,
    CourseOnlineComponent,
    CoursePointMasterComponent,
    CoursePointComponent,
    CourseNavigateComponent
  ]
})
export class CourseModule { }
