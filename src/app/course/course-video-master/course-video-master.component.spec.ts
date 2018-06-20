import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseVideoMasterComponent } from './course-video-master.component';

describe('CourseVideoMasterComponent', () => {
  let component: CourseVideoMasterComponent;
  let fixture: ComponentFixture<CourseVideoMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseVideoMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseVideoMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
