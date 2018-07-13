import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HseduFeatureComponent } from './hsedu-feature.component';

describe('HseduFeatureComponent', () => {
  let component: HseduFeatureComponent;
  let fixture: ComponentFixture<HseduFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HseduFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HseduFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
