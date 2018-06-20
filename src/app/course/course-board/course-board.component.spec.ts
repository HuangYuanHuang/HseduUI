import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseBoardComponent } from './course-board.component';

describe('CourseBoardComponent', () => {
  let component: CourseBoardComponent;
  let fixture: ComponentFixture<CourseBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
