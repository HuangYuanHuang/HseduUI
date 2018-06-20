import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HseduNavComponent } from './hsedu-nav/hsedu-nav.component';
import { HseduSlideComponent } from './hsedu-slide/hsedu-slide.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HseduCoursePreviewComponent } from './hsedu-course-preview/hsedu-course-preview.component';
import { RouterModule, Routes } from '@angular/router';
import { HseduHomeComponent } from './hsedu-home/hsedu-home.component';
import { HseduCourseListComponent } from './hsedu-course-list/hsedu-course-list.component';

const appRoutes: Routes = [
  { path: '', component: HseduHomeComponent },
  { path: 'course-list', component: HseduCourseListComponent }
];


@NgModule({
  imports: [
    CommonModule,
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
    HseduCourseListComponent
  ],
  exports: [
    HseduNavComponent,
    HseduSlideComponent,
    HseduCoursePreviewComponent,
    HseduHomeComponent,
    HseduCourseListComponent
  ]
})
export class HseduModule { }
