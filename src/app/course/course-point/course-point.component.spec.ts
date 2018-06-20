import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePointComponent } from './course-point.component';

describe('CoursePointComponent', () => {
  let component: CoursePointComponent;
  let fixture: ComponentFixture<CoursePointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
