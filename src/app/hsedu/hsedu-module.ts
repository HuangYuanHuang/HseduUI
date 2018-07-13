import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HseduNavComponent } from './hsedu-nav/hsedu-nav.component';
import { HseduSlideComponent } from './hsedu-slide/hsedu-slide.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HseduCoursePreviewComponent } from './hsedu-course-preview/hsedu-course-preview.component';
import { RouterModule, Routes } from '@angular/router';
import { HseduHomeComponent } from './hsedu-home/hsedu-home.component';
import { HseduCourseListComponent } from './hsedu-course-list/hsedu-course-list.component';
import { HseduNoticeComponent } from './hsedu-notice/hsedu-notice.component';
import { TranslateModule } from '@ngx-translate/core';
import { HseduFooterComponent } from './hsedu-footer/hsedu-footer.component';
import { HseduFeatureComponent } from './hsedu-feature/hsedu-feature.component';
const appRoutes: Routes = [
  { path: '', component: HseduHomeComponent },
  { path: 'course-list', component: HseduCourseListComponent },
  { path: 'feature', component: HseduFeatureComponent }
];


@NgModule({
  imports: [
    CommonModule, TranslateModule,
    RouterModule.forRoot(
      appRoutes
    ),

    NgbModule.forRoot()
  ],
  declarations: [
    HseduNavComponent,
    HseduSlideComponent,
    HseduHomeComponent,
    HseduCoursePreviewComponent,
    HseduCourseListComponent,
    HseduNoticeComponent,
    HseduFooterComponent,
    HseduFeatureComponent
  ]
})
export class HseduModule { }
