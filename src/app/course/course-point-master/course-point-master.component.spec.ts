import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePointMasterComponent } from './course-point-master.component';

describe('CoursePointMasterComponent', () => {
  let component: CoursePointMasterComponent;
  let fixture: ComponentFixture<CoursePointMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePointMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePointMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
