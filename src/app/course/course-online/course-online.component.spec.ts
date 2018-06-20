import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseOnlineComponent } from './course-online.component';

describe('CourseOnlineComponent', () => {
  let component: CourseOnlineComponent;
  let fixture: ComponentFixture<CourseOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
