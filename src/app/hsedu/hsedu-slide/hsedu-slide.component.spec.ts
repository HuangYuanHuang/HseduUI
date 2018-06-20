import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HseduSlideComponent } from './hsedu-slide.component';

describe('HseduSlideComponent', () => {
  let component: HseduSlideComponent;
  let fixture: ComponentFixture<HseduSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HseduSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HseduSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
