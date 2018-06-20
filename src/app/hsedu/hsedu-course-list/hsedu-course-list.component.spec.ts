import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HseduCourseListComponent } from './hsedu-course-list.component';

describe('HseduCourseListComponent', () => {
  let component: HseduCourseListComponent;
  let fixture: ComponentFixture<HseduCourseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HseduCourseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HseduCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
