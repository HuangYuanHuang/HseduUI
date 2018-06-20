import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseChatComponent } from './course-chat.component';

describe('CourseChatComponent', () => {
  let component: CourseChatComponent;
  let fixture: ComponentFixture<CourseChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
