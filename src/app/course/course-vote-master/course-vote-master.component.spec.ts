import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseVoteMasterComponent } from './course-vote-master.component';

describe('CourseVoteMasterComponent', () => {
  let component: CourseVoteMasterComponent;
  let fixture: ComponentFixture<CourseVoteMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseVoteMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseVoteMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
