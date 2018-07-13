import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HseduFooterComponent } from './hsedu-footer.component';

describe('HseduFooterComponent', () => {
  let component: HseduFooterComponent;
  let fixture: ComponentFixture<HseduFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HseduFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HseduFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
