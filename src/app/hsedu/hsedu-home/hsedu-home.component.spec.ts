import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HseduHomeComponent } from './hsedu-home.component';

describe('HseduHomeComponent', () => {
  let component: HseduHomeComponent;
  let fixture: ComponentFixture<HseduHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HseduHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HseduHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
