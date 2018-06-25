import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HseduNoticeComponent } from './hsedu-notice.component';

describe('HseduNoticeComponent', () => {
  let component: HseduNoticeComponent;
  let fixture: ComponentFixture<HseduNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HseduNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HseduNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
