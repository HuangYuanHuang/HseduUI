import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HseduCoursePreviewComponent } from './hsedu-course-preview.component';

describe('HseduCoursePreviewComponent', () => {
  let component: HseduCoursePreviewComponent;
  let fixture: ComponentFixture<HseduCoursePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HseduCoursePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HseduCoursePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
