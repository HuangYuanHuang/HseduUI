import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseVoteComponent } from './course-vote.component';

describe('CourseVoteComponent', () => {
  let component: CourseVoteComponent;
  let fixture: ComponentFixture<CourseVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
