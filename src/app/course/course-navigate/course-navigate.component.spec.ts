import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseNavigateComponent } from './course-navigate.component';

describe('CourseNavigateComponent', () => {
  let component: CourseNavigateComponent;
  let fixture: ComponentFixture<CourseNavigateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseNavigateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseNavigateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
