import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HseduNavComponent } from './hsedu-nav.component';

describe('HseduNavComponent', () => {
  let component: HseduNavComponent;
  let fixture: ComponentFixture<HseduNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HseduNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HseduNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
