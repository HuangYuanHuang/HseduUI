import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseHomeMasterComponent } from './course-home-master.component';

describe('CourseHomeMasterComponent', () => {
  let component: CourseHomeMasterComponent;
  let fixture: ComponentFixture<CourseHomeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseHomeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseHomeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
