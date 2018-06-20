import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPeerComponent } from './chat-peer.component';

describe('ChatPeerComponent', () => {
  let component: ChatPeerComponent;
  let fixture: ComponentFixture<ChatPeerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPeerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
