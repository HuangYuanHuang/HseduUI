import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFileComponent } from './course-file.component';

describe('CourseFileComponent', () => {
  let component: CourseFileComponent;
  let fixture: ComponentFixture<CourseFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
